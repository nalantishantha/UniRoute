from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone
import json

# Import your custom models
from apps.accounts.models import Users, UserDetails, UserTypes
from apps.counsellors.models import Counsellors


@csrf_exempt
def admin_create_counsellor(request):
    """Admin-only function to create counsellor accounts"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Admin creating counsellor:", data)
            
            # Get admin user info for authorization
            admin_user_id = data.get('admin_user_id')
            if not admin_user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Admin authorization required'
                }, status=401)
            
            # Verify admin user
            try:
                admin_user = Users.objects.get(user_id=admin_user_id)
                admin_user_type = admin_user.user_type.type_name
                if admin_user_type != 'admin':
                    return JsonResponse({
                        'success': False,
                        'message': 'Only admins can create counsellor accounts'
                    }, status=403)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid admin user'
                }, status=401)
            
            # Get form data
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            phone_number = data.get('phoneNumber', '')
            password = data.get('password')
            experience_years = data.get('experienceYears')
            qualifications = data.get('qualifications', '')
            specializations = data.get('specializations', '')
            bio = data.get('bio', '')
            expertise = data.get('expertise', '')
            hourly_rate = data.get('hourlyRate')
            
            # Basic validation
            if not all([first_name, last_name, email, password]):
                return JsonResponse({
                    'success': False,
                    'message': 'First name, last name, email, and password are required'
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
            
            print("✅ Validation passed, admin creating counsellor...")
            
            # Create user with transaction
            with transaction.atomic():
                # Get counsellor user type
                counsellor_user_type = UserTypes.objects.get(type_name='counsellor')
                print(f"User type: {counsellor_user_type.type_name}")
                
                # Create user
                user = Users.objects.create(
                    username=username,
                    email=email,
                    password_hash=make_password(password),
                    user_type=counsellor_user_type,
                    is_active=1,
                    created_at=timezone.now()
                )
                print(f"User created with ID: {user.user_id}, Username: {username}")
                
                # Create user details
                user_details = UserDetails.objects.create(
                    user=user,
                    full_name=f"{first_name} {last_name}",
                    contact_number=phone_number,
                    bio=bio,
                    is_verified=1,  # Admin-created accounts are pre-verified
                    updated_at=timezone.now()
                )
                print(f"User details created: {user_details.full_name}")
                
                # Create counsellor record
                counsellor = Counsellors.objects.create(
                    user=user,
                    expertise=expertise,
                    bio=bio,
                    experience_years=experience_years if experience_years else None,
                    qualifications=qualifications,
                    specializations=specializations,
                    available_for_sessions=True,
                    hourly_rate=hourly_rate if hourly_rate else None,
                    created_at=timezone.now(),
                    updated_at=timezone.now()
                )
                print(f"Counsellor created with ID: {counsellor.counsellor_id}")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Counsellor account created successfully by admin',
                    'counsellor': {
                        'user_id': user.user_id,
                        'counsellor_id': counsellor.counsellor_id,
                        'username': user.username,
                        'email': user.email,
                        'full_name': user_details.full_name,
                        'contact_number': user_details.contact_number,
                        'experience_years': counsellor.experience_years,
                        'qualifications': counsellor.qualifications,
                        'specializations': counsellor.specializations,
                        'expertise': counsellor.expertise,
                        'hourly_rate': float(counsellor.hourly_rate) if counsellor.hourly_rate else None,
                        'available_for_sessions': counsellor.available_for_sessions,
                        'is_verified': True,
                        'created_by_admin': admin_user.email
                    }
                })
            
        except Exception as e:
            print(f"❌ Admin counsellor creation error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Counsellor creation failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def admin_list_counsellors(request):
    """Admin function to list all counsellors"""
    if request.method == 'GET':
        try:
            # Get admin user info for authorization  
            admin_user_id = request.GET.get('admin_user_id')
            if not admin_user_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Admin authorization required'
                }, status=401)
            
            # Verify admin user
            try:
                admin_user = Users.objects.get(user_id=admin_user_id)
                if admin_user.user_type.type_name != 'admin':
                    return JsonResponse({
                        'success': False,
                        'message': 'Only admins can view counsellor list'
                    }, status=403)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid admin user'
                }, status=401)
            
            # Get all counsellors
            counsellors = Counsellors.objects.select_related('user__userdetails').all()
            
            counsellor_list = []
            for counsellor in counsellors:
                user_details = getattr(counsellor.user, 'userdetails', None)
                counsellor_list.append({
                    'user_id': counsellor.user.user_id,
                    'counsellor_id': counsellor.counsellor_id,
                    'username': counsellor.user.username,
                    'email': counsellor.user.email,
                    'full_name': user_details.full_name if user_details else '',
                    'contact_number': user_details.contact_number if user_details else '',
                    'experience_years': counsellor.experience_years,
                    'qualifications': counsellor.qualifications,
                    'specializations': counsellor.specializations,
                    'expertise': counsellor.expertise,
                    'hourly_rate': float(counsellor.hourly_rate) if counsellor.hourly_rate else None,
                    'available_for_sessions': counsellor.available_for_sessions,
                    'is_active': counsellor.user.is_active,
                    'created_at': counsellor.created_at.isoformat() if counsellor.created_at else None
                })
            
            return JsonResponse({
                'success': True,
                'counsellors': counsellor_list,
                'total_count': len(counsellor_list)
            })
            
        except Exception as e:
            print(f"❌ Admin list counsellors error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to retrieve counsellors: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def admin_update_counsellor(request):
    """Admin function to update counsellor details"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get admin user info for authorization
            admin_user_id = data.get('admin_user_id')
            counsellor_id = data.get('counsellor_id')
            
            if not admin_user_id or not counsellor_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Admin authorization and counsellor ID required'
                }, status=400)
            
            # Verify admin user
            try:
                admin_user = Users.objects.get(user_id=admin_user_id)
                if admin_user.user_type.type_name != 'admin':
                    return JsonResponse({
                        'success': False,
                        'message': 'Only admins can update counsellor accounts'
                    }, status=403)
            except Users.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid admin user'
                }, status=401)
            
            # Get counsellor
            try:
                counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
                user_details = UserDetails.objects.get(user=counsellor.user)
            except (Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Update fields if provided
            if 'full_name' in data:
                user_details.full_name = data['full_name']
            if 'contact_number' in data:
                user_details.contact_number = data['contact_number']
            if 'bio' in data:
                user_details.bio = data['bio']
                counsellor.bio = data['bio']
            if 'expertise' in data:
                counsellor.expertise = data['expertise']
            if 'experience_years' in data:
                counsellor.experience_years = data['experience_years'] if data['experience_years'] else None
            if 'qualifications' in data:
                counsellor.qualifications = data['qualifications']
            if 'specializations' in data:
                counsellor.specializations = data['specializations']
            if 'hourly_rate' in data:
                counsellor.hourly_rate = data['hourly_rate'] if data['hourly_rate'] else None
            if 'available_for_sessions' in data:
                counsellor.available_for_sessions = data['available_for_sessions']
            if 'is_active' in data:
                counsellor.user.is_active = 1 if data['is_active'] else 0
                counsellor.user.save()
            
            # Save changes
            user_details.updated_at = timezone.now()
            user_details.save()
            counsellor.updated_at = timezone.now()
            counsellor.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Counsellor updated successfully',
                'counsellor': {
                    'counsellor_id': counsellor.counsellor_id,
                    'full_name': user_details.full_name,
                    'email': counsellor.user.email,
                    'available_for_sessions': counsellor.available_for_sessions,
                    'is_active': counsellor.user.is_active
                }
            })
            
        except Exception as e:
            print(f"❌ Admin update counsellor error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)