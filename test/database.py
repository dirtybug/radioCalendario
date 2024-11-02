import sqlite3
import os

def init_db(db_name="..\frontend\UserDB.sqlite"):
    # Check if the database file already exists
    if not os.path.exists(db_name):
        # Create the database file by connecting to it
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        # Create users table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
        ''')

        conn.commit()
        conn.close()
        print(f"Database file '{db_name}' created and users table initialized.")
    else:
        print(f"Database file '{db_name}' already exists.")

def register_user(username, password, db_name="..\frontend\UserDB.sqlite"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        print(f"User '{username}' registered successfully.")
    except sqlite3.IntegrityError:
        print("User already exists.")
    finally:
        conn.close()

def delete_user(username, db_name="..\frontend\UserDB.sqlite"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM users WHERE username = ?', (username,))
    conn.commit()
    if cursor.rowcount == 0:
        print(f"No user found with username: {username}")
    else:
        print(f"User '{username}' deleted successfully.")
    
    conn.close()



