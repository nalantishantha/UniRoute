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
from apps.pre_mentors.models import PreMentors

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
                    # Priority order: 1. Approved Mentor, 2. Pre-mentor with pending application, 3. Other types
                    additional_info = {}
                    final_user_type = user_type_name
                    
                    # First check if user is an approved mentor (approved=1)
                    from apps.mentoring.models import Mentors
                    try:
                        mentor = Mentors.objects.get(user=user, approved=1)
                        # User is an approved mentor - should access uni-student dashboard as mentor
                        try:
                            uni_student = mentor.university_student
                            final_user_type = 'mentor'  # Override the user type
                            additional_info = {
                                'mentor_id': mentor.mentor_id,
                                'university_student_id': uni_student.university_student_id,
                                'university_id': uni_student.university_id,
                                'faculty_id': uni_student.faculty_id,
                                'degree_program_id': uni_student.degree_program_id,
                                'year_of_study': uni_student.year_of_study,
                                'registration_number': uni_student.registration_number,
                                'expertise': mentor.expertise,
                                'bio': mentor.bio,
                                'approved': mentor.approved
                            }
                            print(f"User is an approved mentor with ID: {mentor.mentor_id}")
                        except Exception as e:
                            print(f"Error getting mentor uni_student info: {str(e)}")
                    except Mentors.DoesNotExist:
                        # Not an approved mentor, check if has pending mentor application and is pre-mentor
                        pending_mentor = Mentors.objects.filter(user=user, approved=0).first()
                        
                        try:
                            pre_mentor = PreMentors.objects.get(user=user)
                            uni_student = pre_mentor.university_student
                            final_user_type = 'pre_mentor'  # Override the user type
                            
                            # Auto-create mentor record if it doesn't exist
                            mentor_record, created = Mentors.objects.get_or_create(
                                user=user,
                                defaults={
                                    'university_student': uni_student,
                                    'expertise': pre_mentor.skills or "General Mentoring",
                                    'bio': f"Pre-mentor profile for {user_details.full_name if user_details else user.email}",
                                    'approved': 0,  # Always start as pending
                                    'created_at': timezone.now()
                                }
                            )
                            
                            # Set the foreign key relationship if not already set
                            if pre_mentor.mentor != mentor_record:
                                pre_mentor.mentor = mentor_record
                                pre_mentor.save()
                            
                            print(f"Mentor record {'created' if created else 'exists'} for pre-mentor {user.user_id}")
                            
                            additional_info = {
                                'pre_mentor_id': pre_mentor.pre_mentor_id,
                                'university_student_id': uni_student.university_student_id,
                                'university_id': uni_student.university_id,
                                'faculty_id': uni_student.faculty_id,
                                'degree_program_id': uni_student.degree_program_id,
                                'year_of_study': uni_student.year_of_study,
                                'registration_number': uni_student.registration_number,
                                'skills': pre_mentor.skills or '',
                                'recommendation': pre_mentor.recommendation or '',
                                'status': pre_mentor.status,
                                'applied': pre_mentor.applied,
                                'has_pending_mentor_application': mentor_record.approved == 0,
                                'mentor_approved': mentor_record.approved == 1,
                                'mentor_id': mentor_record.mentor_id
                            }
                            print(f"User is a pre-mentor with ID: {pre_mentor.pre_mentor_id}, applied: {pre_mentor.applied}, mentor approved: {mentor_record.approved}")
                        except PreMentors.DoesNotExist:
                            # User is not a pre-mentor, check other types
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
                            
                            elif user_type_name == 'uni_student':
                                try:
                                    uni_student = UniversityStudents.objects.get(user=user)
                                    additional_info = {
                                        'university_student_id': uni_student.university_student_id,
                                        'university_id': uni_student.university_id,
                                        'faculty_id': uni_student.faculty_id,
                                        'degree_program_id': uni_student.degree_program_id,
                                        'year_of_study': uni_student.year_of_study,
                                        'registration_number': uni_student.registration_number
                                    }
                                except UniversityStudents.DoesNotExist:
                                    pass
                    
                    # Determine redirect path and dashboard type based on final user type
                    redirect_path = get_redirect_path(final_user_type)
                    dashboard_type = get_dashboard_type(final_user_type)
                    
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Login successful',
                        'user': {
                            'user_id': user.user_id,
                            'username': user.username,
                            'email': user.email,
                            'full_name': user_details.full_name if user_details else '',
                            'contact_number': user_details.contact_number if user_details else '',
                            'user_type': final_user_type,  # Use the final determined user type
                            'user_type_id': user.user_type_id,
                            'redirect_path': redirect_path,  # Add explicit redirect path
                            'dashboard_type': dashboard_type,  # Add dashboard type
                            'is_approved_mentor': final_user_type == 'mentor',
                            'is_pre_mentor': final_user_type == 'pre_mentor',
                            'login_timestamp': timezone.now().isoformat(),  # Add timestamp to prevent caching
                            'original_user_type': user_type_name,  # Original user type from database
                            'decision_reason': get_decision_reason(final_user_type, user_type_name),  # Debug info
                            **additional_info
                        }
                    }, headers={
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
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


def get_decision_reason(final_user_type, original_user_type):
    """Get explanation for why this user type was chosen (for debugging)"""
    if final_user_type == 'mentor':
        return f"User has approved mentor status (approved=1), overriding original type '{original_user_type}'"
    elif final_user_type == 'pre_mentor':
        return f"User is pre-mentor with pending/no mentor application, overriding original type '{original_user_type}'"
    else:
        return f"Using original user type '{original_user_type}'"


def get_redirect_path(user_type):
    """Get the appropriate redirect path based on user type"""
    redirect_paths = {
        'mentor': '/university-student/dashboard',  # Approved mentors go to uni-student dashboard
        'pre_mentor': '/pre-mentor/dashboard',      # Pre-mentors go to pre-mentor dashboard
        'student': '/student/dashboard',            # Regular students
        'uni_student': '/university-student/dashboard',  # Regular university students
        'university': '/university/dashboard',      # University admins
        'company': '/company/dashboard',           # Company users
        'admin': '/admin/dashboard'                # System admins
    }
    return redirect_paths.get(user_type, '/dashboard')


def get_dashboard_type(user_type):
    """Get the dashboard type for frontend routing"""
    dashboard_types = {
        'mentor': 'university-student',  # Approved mentors use uni-student dashboard
        'pre_mentor': 'pre-mentor',      # Pre-mentors use pre-mentor dashboard
        'student': 'student',
        'uni_student': 'university-student',
        'university': 'university',
        'company': 'company',
        'admin': 'admin'
    }
    return dashboard_types.get(user_type, 'default')


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
                
                # Create pre-mentor record (all university students start as pre-mentors)
                pre_mentor = PreMentors.objects.create(
                    user=user,
                    university_student=university_student,
                    status='active',
                    applied=0,  # Not applied for mentor status yet
                    created_at=timezone.now(),
                    updated_at=timezone.now()
                )
                print(f"Pre-mentor record created with ID: {pre_mentor.pre_mentor_id}")
                
                # Create pending mentor record (approved=0)
                from apps.mentoring.models import Mentors
                mentor = Mentors.objects.create(
                    user=user,
                    university_student=university_student,
                    expertise='',
                    bio='',
                    approved=0,  # Pending approval
                    created_at=timezone.now()
                )
                print(f"Pending mentor record created with ID: {mentor.mentor_id}")
                
                return JsonResponse({
                    'success': True,
                    'message': 'University student registration successful! You can now login as a pre-mentor.',
                    'user': {
                        'id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'full_name': user_details.full_name,
                        'contact_number': user_details.contact_number,
                        'user_type': 'uni_student',
                        'user_type_id': user.user_type.type_id,
                        'university_student_id': university_student.university_student_id,
                        'pre_mentor_id': pre_mentor.pre_mentor_id,
                        'mentor_id': mentor.mentor_id,
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


@csrf_exempt
def upgrade_to_pre_mentor(request):
    """Convert a university student to a pre-mentor"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            university_student_id = data.get('university_student_id')
            
            if not university_student_id:
                return JsonResponse({
                    'success': False,
                    'message': 'University student ID is required'
                }, status=400)
            
            # Get university student
            try:
                uni_student = UniversityStudents.objects.get(university_student_id=university_student_id)
            except UniversityStudents.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'University student not found'
                }, status=404)
            
            # Check if already a pre-mentor
            if PreMentors.objects.filter(university_student=uni_student).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'This university student is already a pre-mentor'
                }, status=400)
            
            with transaction.atomic():
                # Update user type to pre_mentor
                pre_mentor_type, _ = UserTypes.objects.get_or_create(type_name='pre_mentor')
                uni_student.user.user_type = pre_mentor_type
                uni_student.user.save()
                
                # Create pre-mentor record
                pre_mentor = PreMentors.objects.create(
                    user=uni_student.user,
                    university_student=uni_student,
                    status='active',
                    applied=0  # Not applied for mentor status yet
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Successfully upgraded to pre-mentor',
                    'pre_mentor_id': pre_mentor.pre_mentor_id
                })
                
        except Exception as e:
            print(f"Upgrade to pre-mentor error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Upgrade failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def get_user_state(request):
    """Get current user state for debugging login/redirect issues"""
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            email = request.GET.get('email')
            
            if not user_id and not email:
                return JsonResponse({
                    'success': False,
                    'message': 'User ID or email is required'
                }, status=400)
            
            # Get user
            try:
                if user_id:
                    user = Users.objects.get(user_id=user_id)
                else:
                    user = Users.objects.get(email=email)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found'
                }, status=404)
            
            # Get user details
            try:
                user_details = UserDetails.objects.get(user=user)
            except UserDetails.DoesNotExist:
                user_details = None
            
            # Get user type name
            try:
                user_type_obj = UserTypes.objects.get(type_id=user.user_type_id)
                user_type_name = user_type_obj.type_name
            except UserTypes.DoesNotExist:
                user_type_name = 'unknown'
            
            # Check mentor status
            from apps.mentoring.models import Mentors
            mentor_info = {}
            try:
                mentor = Mentors.objects.get(user=user)
                mentor_info = {
                    'has_mentor_record': True,
                    'mentor_id': mentor.mentor_id,
                    'approved': mentor.approved,
                    'approval_status': 'approved' if mentor.approved == 1 else ('rejected' if mentor.approved == -1 else 'pending'),
                    'created_at': mentor.created_at
                }
            except Mentors.DoesNotExist:
                mentor_info = {'has_mentor_record': False}
            
            # Check pre-mentor status
            pre_mentor_info = {}
            try:
                pre_mentor = PreMentors.objects.get(user=user)
                pre_mentor_info = {
                    'has_pre_mentor_record': True,
                    'pre_mentor_id': pre_mentor.pre_mentor_id,
                    'skills': pre_mentor.skills or '',
                    'recommendation': pre_mentor.recommendation or '',
                    'status': pre_mentor.status,
                    'applied': pre_mentor.applied
                }
            except PreMentors.DoesNotExist:
                pre_mentor_info = {'has_pre_mentor_record': False}
            
            # Determine what the login logic would decide
            final_user_type = user_type_name
            decision_logic = []
            
            if mentor_info.get('has_mentor_record') and mentor_info.get('approved') == 1:
                final_user_type = 'mentor'
                decision_logic.append("✅ Has approved mentor record (approved=1)")
            elif pre_mentor_info.get('has_pre_mentor_record'):
                final_user_type = 'pre_mentor'
                decision_logic.append("✅ Has pre-mentor record")
                if mentor_info.get('has_mentor_record'):
                    decision_logic.append(f"⏳ Has mentor application with status: {mentor_info.get('approval_status')}")
            else:
                decision_logic.append(f"📝 Using original user type: {user_type_name}")
            
            return JsonResponse({
                'success': True,
                'user_state': {
                    'user_id': user.user_id,
                    'email': user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'original_user_type': user_type_name,
                    'final_user_type': final_user_type,
                    'dashboard_type': get_dashboard_type(final_user_type),
                    'redirect_path': get_redirect_path(final_user_type),
                    'mentor_info': mentor_info,
                    'pre_mentor_info': pre_mentor_info,
                    'decision_logic': decision_logic,
                    'should_redirect_to': {
                        'dashboard': get_dashboard_type(final_user_type),
                        'path': get_redirect_path(final_user_type)
                    },
                    'timestamp': timezone.now().isoformat()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error getting user state: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)