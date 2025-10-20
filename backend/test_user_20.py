import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.db import connection

def test_user_20():
    """
    Test if user_id=20 exists and what data it has
    """
    try:
        with connection.cursor() as cursor:
            # Check if user exists
            cursor.execute("SELECT user_id, username, email, user_type_id FROM users WHERE user_id = 20")
            user = cursor.fetchone()
            
            if user:
                print("✅ User found:")
                print(f"  User ID: {user[0]}")
                print(f"  Username: {user[1]}")
                print(f"  Email: {user[2]}")
                print(f"  User Type ID: {user[3]}")
                
                # Check user details
                cursor.execute("SELECT full_name, profile_picture, bio FROM user_details WHERE user_id = 20")
                details = cursor.fetchone()
                
                if details:
                    print("\n✅ User details found:")
                    print(f"  Full Name: {details[0]}")
                    print(f"  Profile Picture: {details[1]}")
                    print(f"  Bio: {details[2]}")
                else:
                    print("\n⚠️ No user details found")
                
                # Check student record
                cursor.execute("SELECT student_id, current_stage, district, school FROM students WHERE user_id = 20")
                student = cursor.fetchone()
                
                if student:
                    print("\n✅ Student record found:")
                    print(f"  Student ID: {student[0]}")
                    print(f"  Current Stage: {student[1]}")
                    print(f"  District: {student[2]}")
                    print(f"  School: {student[3]}")
                else:
                    print("\n⚠️ No student record found")
                    
                # Test the API query
                print("\n🧪 Testing API query...")
                query = """
                    SELECT 
                        u.user_id,
                        u.username,
                        u.email,
                        u.is_active,
                        u.created_at,
                        u.user_type_id,
                        ud.full_name,
                        ud.profile_picture,
                        ud.bio,
                        ud.contact_number,
                        ud.location,
                        ud.gender,
                        ud.is_verified,
                        ud.updated_at,
                        s.student_id,
                        s.current_stage,
                        s.district,
                        s.school
                    FROM users u
                    LEFT JOIN user_details ud ON u.user_id = ud.user_id
                    LEFT JOIN students s ON u.user_id = s.user_id
                    WHERE u.user_id = %s AND u.user_type_id = 1
                """
                cursor.execute(query, [20])
                result = cursor.fetchone()
                
                if result:
                    print("✅ API query successful!")
                    print(f"  Profile data available: {len([x for x in result if x is not None])} non-null fields")
                else:
                    print("❌ API query returned no results")
                    print("  This means either user doesn't exist or user_type_id is not 1")
                
            else:
                print("❌ User with ID 20 not found!")
                
                # Show existing users
                cursor.execute("SELECT user_id, username, user_type_id FROM users LIMIT 5")
                users = cursor.fetchall()
                print(f"\nExisting users (first 5):")
                for u in users:
                    print(f"  ID: {u[0]}, Username: {u[1]}, Type: {u[2]}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_user_20()
