import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Posts management API - create, read, update posts
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with posts data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        post_id = params.get('id')
        category = params.get('category')
        
        if post_id:
            cur.execute(
                "UPDATE posts SET views = views + 1 WHERE id = %s",
                (post_id,)
            )
            conn.commit()
            
            cur.execute(
                """SELECT p.*, u.username as author_name, u.full_name as author_full_name 
                   FROM posts p 
                   LEFT JOIN users u ON p.author_id = u.id 
                   WHERE p.id = %s""",
                (post_id,)
            )
            post = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not post:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'post': dict(post)}, default=str),
                'isBase64Encoded': False
            }
        
        if category:
            cur.execute(
                """SELECT p.*, u.username as author_name 
                   FROM posts p 
                   LEFT JOIN users u ON p.author_id = u.id 
                   WHERE p.category = %s 
                   ORDER BY p.created_at DESC""",
                (category,)
            )
        else:
            cur.execute(
                """SELECT p.*, u.username as author_name 
                   FROM posts p 
                   LEFT JOIN users u ON p.author_id = u.id 
                   ORDER BY p.created_at DESC"""
            )
        
        posts = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'posts': [dict(p) for p in posts]}, default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        title = body_data.get('title')
        category = body_data.get('category')
        content = body_data.get('content')
        image_url = body_data.get('image_url', '')
        author_id = body_data.get('author_id')
        
        if not title or not category or not content:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            """INSERT INTO posts (title, category, content, image_url, author_id) 
               VALUES (%s, %s, %s, %s, %s) 
               RETURNING id, title, category, content, image_url, author_id, created_at, views""",
            (title, category, content, image_url, author_id)
        )
        post = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'post': dict(post)}, default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        
        post_id = body_data.get('id')
        title = body_data.get('title')
        category = body_data.get('category')
        content = body_data.get('content')
        image_url = body_data.get('image_url')
        
        if not post_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Post ID required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            """UPDATE posts 
               SET title = COALESCE(%s, title),
                   category = COALESCE(%s, category),
                   content = COALESCE(%s, content),
                   image_url = COALESCE(%s, image_url),
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = %s
               RETURNING id, title, category, content, image_url, author_id, created_at, updated_at, views""",
            (title, category, content, image_url, post_id)
        )
        post = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        if not post:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Post not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'post': dict(post)}, default=str),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
