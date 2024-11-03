import sqlite3
import os
import datetime
import bcrypt

def init_db(db_name=r"../backend/UserDB.sqlite"):
    # Check if the database file already exists
    if not os.path.exists(db_name):
        # Create the database file by connecting to it
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        # Create users table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
        ''')

        conn.commit()
        conn.close()
        print(f"Database file '{db_name}' created and users table initialized.")
    else:
        print(f"Database file '{db_name}' already exists.")
def register_user(email, password, db_name=r"../backend/UserDB.sqlite"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Check if the user already exists
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    print(f"Checking for user: {email}. Found: {user}")  # Debug print
    
    if user:
        print("User already exists.")
    else:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute('INSERT INTO users (email, password, createdAt, updatedAt) VALUES (?, ?, ?,?)', 
                       (email, hashed_password.decode('utf-8'), datetime.datetime.now(), datetime.datetime.now()))
        conn.commit()
        print(f"User '{email}' registered successfully.")
    
    conn.close()
def delete_user(email, db_name=r"../backend/UserDB.sqlite"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM users WHERE email = ?', (email,))
    conn.commit()
    if cursor.rowcount == 0:
        print(f"No user found with email: {email}")
    else:
        print(f"User '{email}' deleted successfully.")
    
    conn.close()
