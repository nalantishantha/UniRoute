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
from apps.university_students.models import UniversityStudents
from apps.universities.models import Universities, UniversityRequests
from apps.companies.models import Companies, CompanyRequests

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
                    full_name=f"{first_name} {last_name}",
                    contact_number=phone_number or '',
                    is_verified=0,
                    updated_at=timezone.now()
                )
                print(f"User details created: {user_details.full_name}")
                
                # Create basic student record (without optional fields)
                student = Students.objects.create(
                    user=user,
                    current_stage='ol',  # Default stage
                    school='',  # Empty for now
                )
                print(f"Student created with ID: {student.student_id}")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Student registration successful!',
                    'user': {
                        'id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'full_name': user_details.full_name,
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
                                # 'student_stage': student.student_stage,
                                'school': student.school
                            }
                        except Students.DoesNotExist:
                            pass
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Login successful',
                        'user': {
                            'user_id': user.user_id,
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


@csrf_exempt
def register_university_student(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received university student registration data:", data)
            
            # Get form data
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            phone_number = data.get('phoneNumber')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            university_id = data.get('universityId')
            faculty_id = data.get('facultyId')
            degree_program_id = data.get('degreeProgramId')
            duration_id = data.get('durationId')
            year_of_study = data.get('yearOfStudy')
            registration_number = data.get('registrationNumber')

            # Basic validation
            if not all([
                first_name, last_name, email, password, confirm_password,
                university_id, degree_program_id, duration_id, year_of_study, registration_number
            ]):
                return JsonResponse({
                    'success': False,
                    'message': 'All required fields must be filled'
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

            print("✅ Validation passed, creating university student...")

            # Create user with transaction
            with transaction.atomic():
                # Get or create university student user type (use uni_student with type_id = 2)
                uni_student_user_type, _ = UserTypes.objects.get_or_create(
                    type_name='uni_student'
                )
                print(f"Using user type: {uni_student_user_type.type_name} (ID: {uni_student_user_type.type_id})")
                
                # Create user
                user = Users.objects.create(
                    username=username,
                    email=email,
                    password_hash=make_password(password),
                    user_type=uni_student_user_type,
                    is_active=1,
                    created_at=timezone.now()
                )
                # Create user details
                user_details = UserDetails.objects.create(
                    user=user,
                    full_name=f"{first_name} {last_name}",
                    contact_number=phone_number or '',
                    is_verified=0,
                    updated_at=timezone.now()
                )
                # Create university student record
                university_student = UniversityStudents.objects.create(
                    user=user,
                    university_id=university_id,
                    faculty_id=faculty_id,
                    degree_program_id=degree_program_id,
                    duration_id=duration_id,
                    year_of_study=year_of_study,
                    registration_number=registration_number
                )
                print(f"University student created with ID: {university_student.university_student_id}")
                return JsonResponse({
                    'success': True,
                    'message': 'University student registration successful!',
                    'user': {
                        'id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'full_name': user_details.full_name,
                        'contact_number': user_details.contact_number,
                        'user_type': 'uni_student',
                        'user_type_id': user.user_type.type_id,
                        'university_student_id': university_student.university_student_id,
                        'university_id': university_id,
                        'faculty_id': faculty_id,
                        'degree_program_id': degree_program_id,
                        'duration_id': duration_id,
                        'year_of_study': year_of_study,
                        'registration_number': registration_number
                    }
                })
            
        except Exception as e:
            print(f"University student registration error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Registration failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def register_university(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received university registration data:", data)
            
            # Get form data
            university_name = data.get('universityName')
            contact_person_name = data.get('contactPersonName')
            contact_person_title = data.get('contactPersonTitle', '')
            email = data.get('email')
            phone_number = data.get('phoneNumber')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            address = data.get('address')
            city = data.get('city')
            website = data.get('website', '')
            established_year = data.get('establishedYear')
            description = data.get('description', '')
            
            # Basic validation
            if not all([university_name, contact_person_name, email, password, confirm_password, address, city]):
                return JsonResponse({
                    'success': False,
                    'message': 'All required fields must be filled'
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
            
            # Check if email already exists in requests or users
            if UniversityRequests.objects.filter(email=email, status__in=['pending', 'approved']).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'A registration request with this email already exists'
                }, status=400)
                
            if Users.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'An account with this email already exists'
                }, status=400)
            
            print("✅ Validation passed, creating university request...")
            
            # Create university registration request
            university_request = UniversityRequests.objects.create(
                university_name=university_name,
                contact_person_name=contact_person_name,
                contact_person_title=contact_person_title,
                email=email,
                phone_number=phone_number or '',
                password_hash=make_password(password),
                location=city,
                district='',  # Can be updated later by admin
                address=address,
                description=description,
                website=website,
                established_year=established_year,
                status='pending'
            )
            
            print(f"University request created with ID: {university_request.request_id}")
            
            return JsonResponse({
                'success': True,
                'message': 'University registration request submitted successfully! We will review your application within 24-48 hours and notify you via email.',
                'request_id': university_request.request_id,
                'university_name': university_name,
                'contact_person': contact_person_name,
                'status': 'pending'
            })
            
        except Exception as e:
            print(f"University registration error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Registration request failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def register_company(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received company registration data:", data)
            
            # Get form data
            company_name = data.get('companyName')
            contact_person_name = data.get('contactPersonName')
            contact_person_title = data.get('contactPersonTitle', '')
            email = data.get('email')
            phone_number = data.get('phoneNumber')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            address = data.get('address')
            city = data.get('city')
            website = data.get('website', '')
            industry = data.get('industry')
            company_size = data.get('companySize')
            established_year = data.get('establishedYear')
            description = data.get('description', '')
            
            # Basic validation
            if not all([company_name, contact_person_name, email, password, confirm_password, address, city]):
                return JsonResponse({
                    'success': False,
                    'message': 'All required fields must be filled'
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
            
            # Check if email already exists in requests or users
            if CompanyRequests.objects.filter(email=email, status__in=['pending', 'approved']).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'A registration request with this email already exists'
                }, status=400)
                
            if Users.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'An account with this email already exists'
                }, status=400)
            
            print("✅ Validation passed, creating company request...")
            
            # Create company registration request
            company_request = CompanyRequests.objects.create(
                company_name=company_name,
                contact_person_name=contact_person_name,
                contact_person_title=contact_person_title,
                email=email,
                phone_number=phone_number or '',
                password_hash=make_password(password),
                address=address,
                city=city,
                website=website,
                industry=industry,
                company_size=company_size,
                established_year=established_year,
                description=description,
                status='pending'
            )
            
            print(f"Company request created with ID: {company_request.request_id}")
            
            return JsonResponse({
                'success': True,
                'message': 'Company registration request submitted successfully! We will review your application within 24-48 hours and notify you via email.',
                'request_id': company_request.request_id,
                'company_name': company_name,
                'contact_person': contact_person_name,
                'status': 'pending'
            })
            
        except Exception as e:
            print(f"Company registration error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Registration request failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)