from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.utils import timezone
import json

# Import your custom models
from .models import Users, UserDetails, UserTypes
from apps.students.models import Students

@csrf_exempt
def register_student(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received registration data:", data)
            
            # Get form data - only the essential fields
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            phone_number = data.get('phoneNumber')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            
            # Basic validation
            if not all([first_name, last_name, email, password, confirm_password]):
                return JsonResponse({
                    'success': False,
                    'message': 'First name, last name, email, and password are required'
                }, status=400)
            
            if password != confirm_password:
                return JsonResponse({
                    'success': False,
                    'message': 'Passwords do not match'
                }, status=400)
            
            if len(password) < 8:
                return JsonResponse({
                    'success': False,
                    'message': 'Password must be at least 8 characters long'
                }, status=400)
            
            # Create username from first and last name
            username = f"{first_name.lower()}.{last_name.lower()}".replace(' ', '')
            
            # Check if username already exists, if so add numbers
            original_username = username
            counter = 1
            while Users.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            # Check if email already exists
            if Users.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Email already exists'
                }, status=400)
            
            print("✅ Validation passed, creating user...")
            
            # Create user with transaction
            with transaction.atomic():
                # Get or create student user type
                student_user_type, created = UserTypes.objects.get_or_create(
                    type_name='student'
                )
                print(f"User type: {student_user_type.type_name}")
                
                # Create user
                user = Users.objects.create(
                    username=username,
                    email=email,
                    password_hash=make_password(password),
                    user_type=student_user_type,
                    is_active=1,
                    created_at=timezone.now()
                )
                print(f"User created with ID: {user.user_id}, Username: {username}")
                
                # Create user details
                user_details = UserDetails.objects.create(
                    user=user,
                    first_name=first_name,
                    last_name=last_name,
                    contact_number=phone_number or '',
                    is_verified=0,
                    updated_at=timezone.now()
                )
                print(f"User details created: {user_details.first_name} {user_details.last_name}")
                
                # Create basic student record (without optional fields)
                student = Students.objects.create(
                    user=user,
                    student_stage='ol',  # Default stage
                    school='',  # Empty for now
                    created_at=timezone.now()
                )
                print(f"Student created with ID: {student.student_id}")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Student registration successful!',
                    'user': {
                        'id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user_details.first_name,
                        'last_name': user_details.last_name,
                        'full_name': f"{user_details.first_name} {user_details.last_name}",
                        'contact_number': user_details.contact_number,
                        'user_type': 'student',
                        'student_id': student.student_id
                    }
                })
            
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Registration failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            print(f"Login attempt for email: {email}")
            
            if not email or not password:
                return JsonResponse({
                    'success': False,
                    'message': 'Email and password are required'
                }, status=400)
            
            try:
                user = Users.objects.get(email=email)
                print(f"Found user: {user.email}, User ID: {user.user_id}, Type ID: {user.user_type_id}")
                print(f"Stored password hash: {user.password_hash}")
                print(f"Provided password: {password}")
                
                # Simple password check for testing - direct comparison
                if check_password(password, user.password_hash):
                    print("Password verified")
                    
                    # Get user details
                    try:
                        user_details = UserDetails.objects.get(user=user)
                        print(f"Found user details: {user_details.full_name}")
                    except UserDetails.DoesNotExist:
                        print("No user details found")
                        user_details = None
                    
                    # Get user type name
                    try:
                        user_type_obj = UserTypes.objects.get(type_id=user.user_type_id)
                        user_type_name = user_type_obj.type_name
                        print(f"User type: {user_type_name}")
                    except UserTypes.DoesNotExist:
                        user_type_name = 'unknown'
                        print("User type not found")
                    
                    # Get additional info based on user type
                    additional_info = {}
                    
                    if user_type_name == 'student':
                        try:
                            student = Students.objects.get(user=user)
                            additional_info = {
                                'student_id': student.student_id,
                                'student_stage': student.student_stage,
                                'school': student.school
                            }
                        except Students.DoesNotExist:
                            pass
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Login successful',
                        'user': {
                            'id': user.user_id,
                            'username': user.username,
                            'email': user.email,
                            'full_name': user_details.full_name if user_details else '',
                            'contact_number': user_details.contact_number if user_details else '',
                            'user_type': user_type_name,
                            'user_type_id': user.user_type_id,
                            **additional_info
                        }
                    })
                else:
                    print("Password incorrect - no match")
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid email or password'
                    }, status=400)
                    
            except Users.DoesNotExist:
                print("User not found")
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            print(f"Login error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Login failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


# Add this logout function after the login function

@csrf_exempt
def logout_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            print(f"Logout attempt for user ID: {user_id}")
            
            if user_id:
                try:
                    user = Users.objects.get(user_id=user_id)
                    print(f"User {user.email} logged out successfully")
                except Users.DoesNotExist:
                    print(f"User with ID {user_id} not found")
            
            return JsonResponse({
                'success': True,
                'message': 'Logged out successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            print(f"Logout error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Logout failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)