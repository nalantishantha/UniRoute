import os
import django
import sys
from decouple import config

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.db import connection
from django.core.exceptions import ImproperlyConfigured

def test_database_connection():
    try:
        print("🔍 Testing database connection...")
        print(f"Host: {config('DB_HOST')}")
        print(f"Database: {config('DB_NAME')}")
        print(f"User: {config('DB_USER')}")
        print("=" * 50)
        
        # Test the connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
            print("✅ Database connection successful!")
            print(f"Test query result: {result}")
            
        # Show database info
        with connection.cursor() as cursor:
            cursor.execute("SELECT DATABASE() as current_db")
            db_name = cursor.fetchone()
            print(f"Connected to database: {db_name[0]}")
            
        # Show tables (if any)
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            if tables:
                print(f"Existing tables: {[table[0] for table in tables]}")
            else:
                print("No tables found (this is normal for a new database)")
                
    except Exception as e:
        print(f"❌ Database connection failed!")
        print(f"Error: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your .env file values")
        print("2. Verify your AlwaysData database is active")
        print("3. Check your internet connection")
        return False
    
    return True

if __name__ == "__main__":
    if test_database_connection():
        print("\n🚀 Ready to run migrations!")
    else:
        print("\n❌ Fix the connection issues first")