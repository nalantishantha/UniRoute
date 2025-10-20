from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.utils import timezone
from datetime import time
import json

# Import your custom models
from apps.accounts.models import Users, UserDetails, UserTypes
from apps.counsellors.models import Counsellors, CounsellorAvailability, CounsellingRequests, CounsellingSessions, CounsellingFeedback
from apps.students.models import Students


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


@csrf_exempt
def get_counsellor_profile(request, user_id):
    """Get counsellor profile by user ID"""
    if request.method == 'GET':
        try:
            # Get the counsellor and related data
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
                user_details = UserDetails.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Get availability data
            availability = []
            for avail in counsellor.availability.filter(is_active=True):
                availability.append({
                    'day_of_week': avail.day_of_week,
                    'day_name': avail.get_day_of_week_display(),
                    'start_time': avail.start_time.strftime('%H:%M') if avail.start_time else None,
                    'end_time': avail.end_time.strftime('%H:%M') if avail.end_time else None
                })
            
            profile_data = {
                'user_id': user.user_id,
                'counsellor_id': counsellor.counsellor_id,
                'username': user.username,
                'email': user.email,
                'full_name': user_details.full_name or '',
                'profile_picture': user_details.profile_picture or '',
                'bio': user_details.bio or counsellor.bio or '',
                'contact_number': user_details.contact_number or '',
                'location': user_details.location or '',
                'gender': user_details.gender or '',
                'is_verified': user_details.is_verified or 0,
                'expertise': counsellor.expertise or '',
                'experience_years': counsellor.experience_years,
                'qualifications': counsellor.qualifications or '',
                'specializations': counsellor.specializations or '',
                'available_for_sessions': counsellor.available_for_sessions,
                'hourly_rate': float(counsellor.hourly_rate) if counsellor.hourly_rate else None,
                'is_active': user.is_active,
                'availability': availability,
                'created_at': counsellor.created_at.isoformat() if counsellor.created_at else None,
                'updated_at': counsellor.updated_at.isoformat() if counsellor.updated_at else None
            }
            
            return JsonResponse({
                'success': True,
                'profile': profile_data
            })
            
        except Exception as e:
            print(f"❌ Get counsellor profile error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to get profile: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def update_counsellor_profile(request, user_id):
    """Update counsellor profile"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get the counsellor and related data
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
                user_details = UserDetails.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Update user details
            if 'full_name' in data:
                user_details.full_name = data['full_name']
            if 'bio' in data:
                user_details.bio = data['bio']
            if 'contact_number' in data:
                user_details.contact_number = data['contact_number']
            if 'location' in data:
                user_details.location = data['location']
            if 'gender' in data:
                user_details.gender = data['gender']
            if 'profile_picture' in data:
                user_details.profile_picture = data['profile_picture']
            
            # Update counsellor-specific fields
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
            
            # If bio is updated in user_details, also update in counsellor table
            if 'bio' in data:
                counsellor.bio = data['bio']
            
            # Save changes with transaction
            with transaction.atomic():
                user_details.updated_at = timezone.now()
                user_details.save()
                counsellor.updated_at = timezone.now()
                counsellor.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully',
                'profile': {
                    'user_id': user.user_id,
                    'counsellor_id': counsellor.counsellor_id,
                    'full_name': user_details.full_name,
                    'email': user.email,
                    'bio': user_details.bio,
                    'contact_number': user_details.contact_number,
                    'location': user_details.location,
                    'expertise': counsellor.expertise,
                    'experience_years': counsellor.experience_years,
                    'qualifications': counsellor.qualifications,
                    'specializations': counsellor.specializations,
                    'hourly_rate': float(counsellor.hourly_rate) if counsellor.hourly_rate else None,
                    'available_for_sessions': counsellor.available_for_sessions,
                    'updated_at': counsellor.updated_at.isoformat()
                }
            })
            
        except Exception as e:
            print(f"❌ Update counsellor profile error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to update profile: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def change_counsellor_password(request, user_id):
    """Change counsellor password"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get the counsellor
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Validate required fields
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            if not current_password or not new_password:
                return JsonResponse({
                    'success': False,
                    'message': 'Current password and new password are required'
                }, status=400)
            
            # Verify current password
            if not check_password(current_password, user.password_hash):
                return JsonResponse({
                    'success': False,
                    'message': 'Current password is incorrect'
                }, status=400)
            
            # Validate new password
            if len(new_password) < 8:
                return JsonResponse({
                    'success': False,
                    'message': 'New password must be at least 8 characters long'
                }, status=400)
            
            # Check if new password is different from current
            if check_password(new_password, user.password_hash):
                return JsonResponse({
                    'success': False,
                    'message': 'New password must be different from current password'
                }, status=400)
            
            # Update password
            user.password_hash = make_password(new_password)
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Password changed successfully'
            })
            
        except Exception as e:
            print(f"❌ Change counsellor password error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to change password: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def delete_counsellor_account(request, user_id):
    """Delete counsellor account (soft delete or hard delete)"""
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            
            # Get the counsellor
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
                user_details = UserDetails.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Validate confirmation text
            confirmation_text = data.get('confirmation_text', '')
            if confirmation_text != 'DELETE MY ACCOUNT':
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid confirmation text. Please type "DELETE MY ACCOUNT"'
                }, status=400)
            
            # Perform soft delete by deactivating the account
            with transaction.atomic():
                # Deactivate user account
                user.is_active = 0
                user.save()
                
                # Mark counsellor as unavailable for sessions
                counsellor.available_for_sessions = False
                counsellor.updated_at = timezone.now()
                counsellor.save()
                
                # Optional: Add deletion timestamp to user_details
                user_details.updated_at = timezone.now()
                user_details.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Account has been successfully deactivated'
            })
            
        except Exception as e:
            print(f"❌ Delete counsellor account error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to delete account: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)


@csrf_exempt
def get_counsellor_settings(request, user_id):
    """Get counsellor settings and preferences"""
    if request.method == 'GET':
        try:
            # Get the counsellor and related data
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
                user_details = UserDetails.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            settings_data = {
                'profile_settings': {
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user_details.full_name or '',
                    'profile_picture': user_details.profile_picture or '',
                    'bio': user_details.bio or '',
                    'contact_number': user_details.contact_number or '',
                    'location': user_details.location or '',
                    'gender': user_details.gender or '',
                    'is_verified': user_details.is_verified or 0
                },
                'counsellor_settings': {
                    'counsellor_id': counsellor.counsellor_id,
                    'available_for_sessions': counsellor.available_for_sessions,
                    'experience_years': counsellor.experience_years,
                    'hourly_rate': float(counsellor.hourly_rate) if counsellor.hourly_rate else None,
                    'expertise': counsellor.expertise or '',
                    'specializations': counsellor.specializations or '',
                    'qualifications': counsellor.qualifications or ''
                },
                'account_settings': {
                    'is_active': user.is_active,
                    'created_at': counsellor.created_at.isoformat() if counsellor.created_at else None,
                    'updated_at': counsellor.updated_at.isoformat() if counsellor.updated_at else None
                }
            }
            
            return JsonResponse({
                'success': True,
                'settings': settings_data
            })
            
        except Exception as e:
            print(f"❌ Get counsellor settings error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to get settings: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def update_counsellor_settings(request, user_id):
    """Update counsellor settings and preferences"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get the counsellor and related data
            try:
                user = Users.objects.get(user_id=user_id)
                counsellor = Counsellors.objects.get(user=user)
                user_details = UserDetails.objects.get(user=user)
            except (Users.DoesNotExist, Counsellors.DoesNotExist, UserDetails.DoesNotExist):
                return JsonResponse({
                    'success': False,
                    'message': 'Counsellor not found'
                }, status=404)
            
            # Update profile settings if provided
            profile_settings = data.get('profile_settings', {})
            if profile_settings:
                if 'full_name' in profile_settings:
                    user_details.full_name = profile_settings['full_name']
                if 'profile_picture' in profile_settings:
                    user_details.profile_picture = profile_settings['profile_picture']
                if 'bio' in profile_settings:
                    user_details.bio = profile_settings['bio']
                if 'contact_number' in profile_settings:
                    user_details.contact_number = profile_settings['contact_number']
                if 'location' in profile_settings:
                    user_details.location = profile_settings['location']
                if 'gender' in profile_settings:
                    user_details.gender = profile_settings['gender']
                if 'username' in profile_settings:
                    # Check if username is unique
                    if Users.objects.filter(username=profile_settings['username']).exclude(user_id=user_id).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Username already exists'
                        }, status=400)
                    user.username = profile_settings['username']
            
            # Update counsellor-specific settings if provided
            counsellor_settings = data.get('counsellor_settings', {})
            if counsellor_settings:
                if 'available_for_sessions' in counsellor_settings:
                    counsellor.available_for_sessions = counsellor_settings['available_for_sessions']
                if 'experience_years' in counsellor_settings:
                    counsellor.experience_years = counsellor_settings['experience_years']
                if 'hourly_rate' in counsellor_settings:
                    counsellor.hourly_rate = counsellor_settings['hourly_rate']
                if 'expertise' in counsellor_settings:
                    counsellor.expertise = counsellor_settings['expertise']
                if 'specializations' in counsellor_settings:
                    counsellor.specializations = counsellor_settings['specializations']
                if 'qualifications' in counsellor_settings:
                    counsellor.qualifications = counsellor_settings['qualifications']
            
            # Save changes with transaction
            with transaction.atomic():
                if profile_settings:
                    user_details.updated_at = timezone.now()
                    user_details.save()
                    if 'username' in profile_settings:
                        user.save()
                
                if counsellor_settings:
                    counsellor.updated_at = timezone.now()
                    counsellor.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Settings updated successfully',
                'settings': {
                    'profile_updated': bool(profile_settings),
                    'counsellor_settings_updated': bool(counsellor_settings),
                    'updated_at': timezone.now().isoformat()
                }
            })
            
        except Exception as e:
            print(f"❌ Update counsellor settings error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Failed to update settings: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)


@csrf_exempt
def manage_counsellor_availability(request, user_id):
    """Manage counsellor availability - GET, POST, PUT, DELETE"""
    
    if request.method == 'GET':
        # Get counsellor availability
        try:
            counsellor = Counsellors.objects.get(user__user_id=user_id)
            availability_slots = CounsellorAvailability.objects.filter(
                counsellor=counsellor, 
                is_active=True
            ).order_by('day_of_week', 'start_time')
            
            availability_list = []
            for slot in availability_slots:
                availability_list.append({
                    'id': slot.availability_id,
                    'day_of_week': slot.day_of_week,
                    'day_name': slot.get_day_of_week_display(),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'is_active': slot.is_active,
                    'created_at': slot.created_at.isoformat(),
                    'updated_at': slot.updated_at.isoformat()
                })
            
            return JsonResponse({
                'status': 'success',
                'availability': availability_list,
                'message': f'Found {len(availability_list)} availability slots'
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to fetch availability: {str(e)}'
            }, status=500)
    
    elif request.method == 'POST':
        # Create new availability slot
        try:
            data = json.loads(request.body)
            counsellor = Counsellors.objects.get(user__user_id=user_id)
            
            # Validate required fields
            day_of_week = data.get('day_of_week')
            start_time_str = data.get('start_time')
            end_time_str = data.get('end_time')
            
            if day_of_week is None or start_time_str is None or end_time_str is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'day_of_week, start_time, and end_time are required'
                }, status=400)
            
            # Validate day_of_week
            if not (0 <= day_of_week <= 6):
                return JsonResponse({
                    'status': 'error',
                    'message': 'day_of_week must be between 0 (Sunday) and 6 (Saturday)'
                }, status=400)
            
            # Convert time strings to time objects
            try:
                start_time = time(*map(int, start_time_str.split(':')))
                end_time = time(*map(int, end_time_str.split(':')))
            except (ValueError, AttributeError):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid time format. Use HH:MM format (e.g., 09:00)'
                }, status=400)
            
            # Validate time order
            if start_time >= end_time:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Start time must be before end time'
                }, status=400)
            
            # Check for overlapping availability
            existing_slots = CounsellorAvailability.objects.filter(
                counsellor=counsellor,
                day_of_week=day_of_week,
                is_active=True
            )
            
            for slot in existing_slots:
                if (slot.start_time <= start_time < slot.end_time or
                    slot.start_time < end_time <= slot.end_time or
                    (start_time <= slot.start_time and end_time >= slot.end_time)):
                    return JsonResponse({
                        'status': 'error',
                        'message': f'Time slot overlaps with existing availability on {slot.get_day_of_week_display()}'
                    }, status=400)
            
            # Create new availability slot
            availability_slot = CounsellorAvailability.objects.create(
                counsellor=counsellor,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time,
                is_active=True
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability slot created successfully',
                'availability': {
                    'id': availability_slot.availability_id,
                    'day_of_week': availability_slot.day_of_week,
                    'day_name': availability_slot.get_day_of_week_display(),
                    'start_time': availability_slot.start_time.strftime('%H:%M'),
                    'end_time': availability_slot.end_time.strftime('%H:%M'),
                    'is_active': availability_slot.is_active
                }
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to create availability: {str(e)}'
            }, status=500)
    
    elif request.method == 'PUT':
        # Update existing availability slot
        try:
            data = json.loads(request.body)
            counsellor = Counsellors.objects.get(user__user_id=user_id)
            
            availability_id = data.get('availability_id')
            if not availability_id:
                return JsonResponse({
                    'status': 'error',
                    'message': 'availability_id is required for updates'
                }, status=400)
            
            try:
                availability_slot = CounsellorAvailability.objects.get(
                    availability_id=availability_id,
                    counsellor=counsellor
                )
            except CounsellorAvailability.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Availability slot not found'
                }, status=404)
            
            # Update fields if provided
            if 'day_of_week' in data:
                day_of_week = data['day_of_week']
                if not (0 <= day_of_week <= 6):
                    return JsonResponse({
                        'status': 'error',
                        'message': 'day_of_week must be between 0 (Sunday) and 6 (Saturday)'
                    }, status=400)
                availability_slot.day_of_week = day_of_week
            
            if 'start_time' in data:
                try:
                    availability_slot.start_time = time(*map(int, data['start_time'].split(':')))
                except (ValueError, AttributeError):
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Invalid start_time format. Use HH:MM format (e.g., 09:00)'
                    }, status=400)
            
            if 'end_time' in data:
                try:
                    availability_slot.end_time = time(*map(int, data['end_time'].split(':')))
                except (ValueError, AttributeError):
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Invalid end_time format. Use HH:MM format (e.g., 09:00)'
                    }, status=400)
            
            # Validate time order if both times are being updated
            if availability_slot.start_time >= availability_slot.end_time:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Start time must be before end time'
                }, status=400)
            
            if 'is_active' in data:
                availability_slot.is_active = data['is_active']
            
            # Check for overlaps (excluding current slot)
            existing_slots = CounsellorAvailability.objects.filter(
                counsellor=counsellor,
                day_of_week=availability_slot.day_of_week,
                is_active=True
            ).exclude(availability_id=availability_id)
            
            for slot in existing_slots:
                if (slot.start_time <= availability_slot.start_time < slot.end_time or
                    slot.start_time < availability_slot.end_time <= slot.end_time or
                    (availability_slot.start_time <= slot.start_time and availability_slot.end_time >= slot.end_time)):
                    return JsonResponse({
                        'status': 'error',
                        'message': f'Updated time slot overlaps with existing availability on {slot.get_day_of_week_display()}'
                    }, status=400)
            
            availability_slot.updated_at = timezone.now()
            availability_slot.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Availability slot updated successfully',
                'availability': {
                    'id': availability_slot.availability_id,
                    'day_of_week': availability_slot.day_of_week,
                    'day_name': availability_slot.get_day_of_week_display(),
                    'start_time': availability_slot.start_time.strftime('%H:%M'),
                    'end_time': availability_slot.end_time.strftime('%H:%M'),
                    'is_active': availability_slot.is_active,
                    'updated_at': availability_slot.updated_at.isoformat()
                }
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to update availability: {str(e)}'
            }, status=500)
    
    elif request.method == 'DELETE':
        # Delete availability slot
        try:
            data = json.loads(request.body)
            counsellor = Counsellors.objects.get(user__user_id=user_id)
            
            availability_id = data.get('availability_id')
            if not availability_id:
                return JsonResponse({
                    'status': 'error',
                    'message': 'availability_id is required for deletion'
                }, status=400)
            
            try:
                availability_slot = CounsellorAvailability.objects.get(
                    availability_id=availability_id,
                    counsellor=counsellor
                )
                
                # Soft delete by setting is_active to False
                availability_slot.is_active = False
                availability_slot.updated_at = timezone.now()
                availability_slot.save()
                
                # Or hard delete if preferred:
                # availability_slot.delete()
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Availability slot deleted successfully'
                })
                
            except CounsellorAvailability.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Availability slot not found'
                }, status=404)
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to delete availability: {str(e)}'
            }, status=500)
    
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Method not allowed'
        }, status=405)


@csrf_exempt
def get_counselling_requests(request, counsellor_id):
    """Get all counselling requests for a counsellor"""
    if request.method == 'GET':
        try:
            # Update expired requests first
            update_expired_requests()
            
            counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            requests = CounsellingRequests.objects.filter(
                counsellor=counsellor
            ).select_related(
                'student__user',
                'student__user__userdetails'
            ).order_by('-created_at')
            
            requests_data = []
            for req in requests:
                student_user = req.student.user
                user_details = getattr(student_user, 'userdetails', None)
                
                requests_data.append({
                    'id': req.request_id,
                    'student_id': req.student.student_id,
                    'student': user_details.full_name if user_details else student_user.username,
                    'topic': req.topic,
                    'description': req.description,
                    'preferred_time': req.preferred_time,
                    'session_type': req.session_type,
                    'urgency': req.urgency,
                    'status': req.status,
                    'requested_date': req.requested_date.isoformat(),
                    'expiry_date': req.expiry_date.isoformat(),
                    'decline_reason': req.decline_reason,
                    'avatar': user_details.profile_picture if user_details else None,
                    'contact': student_user.email,
                })
            
            return JsonResponse({
                'status': 'success',
                'requests': requests_data
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to fetch requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def get_counselling_sessions(request, counsellor_id):
    """Get all counselling sessions for a counsellor"""
    if request.method == 'GET':
        try:
            counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            sessions = CounsellingSessions.objects.filter(
                counsellor=counsellor
            ).select_related(
                'student__user',
                'student__user__userdetails'
            ).order_by('-scheduled_at')
            
            sessions_data = []
            for session in sessions:
                student_user = session.student.user
                user_details = getattr(student_user, 'userdetails', None)
                
                sessions_data.append({
                    'id': session.session_id,
                    'student_id': session.student.student_id,
                    'student': user_details.full_name if user_details else student_user.username,
                    'topic': session.topic,
                    'scheduled_at': session.scheduled_at.isoformat(),
                    'duration_minutes': session.duration_minutes,
                    'status': session.status,
                    'session_type': session.session_type,
                    'meeting_link': session.meeting_link,
                    'location': session.location,
                    'completion_notes': session.completion_notes,
                    'cancellation_reason': session.cancellation_reason,
                    'avatar': user_details.profile_picture if user_details else None,
                    'created_at': session.created_at.isoformat(),
                })
            
            return JsonResponse({
                'status': 'success',
                'sessions': sessions_data
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to fetch sessions: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only GET method allowed'
    }, status=405)


@csrf_exempt
def accept_counselling_request(request, request_id):
    """Accept a counselling request and schedule a session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            counselling_request = CounsellingRequests.objects.get(request_id=request_id)
            
            if counselling_request.status != 'pending':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Request is not in pending status'
                }, status=400)
            
            # Validate required fields
            scheduled_at = data.get('scheduled_at')
            if not scheduled_at:
                return JsonResponse({
                    'status': 'error',
                    'message': 'scheduled_at is required'
                }, status=400)
            
            # Parse the datetime
            from datetime import datetime
            scheduled_datetime = datetime.fromisoformat(scheduled_at.replace('Z', '+00:00'))
            
            # Create the session
            with transaction.atomic():
                session = CounsellingSessions.objects.create(
                    counsellor=counselling_request.counsellor,
                    student=counselling_request.student,
                    request=counselling_request,
                    topic=counselling_request.topic,
                    scheduled_at=scheduled_datetime,
                    duration_minutes=data.get('duration_minutes', 60),
                    session_type=counselling_request.session_type,
                    meeting_link=data.get('meeting_link', ''),
                    location=data.get('location', ''),
                    status='scheduled'
                )
                
                # Update request status
                counselling_request.status = 'scheduled'
                counselling_request.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Request accepted and session scheduled',
                'session_id': session.session_id
            })
            
        except CounsellingRequests.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Request not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to accept request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def decline_counselling_request(request, request_id):
    """Decline a counselling request"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            counselling_request = CounsellingRequests.objects.get(request_id=request_id)
            
            if counselling_request.status != 'pending':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Request is not in pending status'
                }, status=400)
            
            decline_reason = data.get('decline_reason', '')
            if not decline_reason.strip():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Decline reason is required'
                }, status=400)
            
            # Update request
            counselling_request.status = 'declined'
            counselling_request.decline_reason = decline_reason
            counselling_request.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Request declined successfully'
            })
            
        except CounsellingRequests.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Request not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to decline request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def cancel_counselling_session(request, session_id):
    """Cancel a counselling session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            session = CounsellingSessions.objects.get(session_id=session_id)
            
            if session.status not in ['scheduled', 'pending']:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Session cannot be cancelled'
                }, status=400)
            
            cancellation_reason = data.get('cancellation_reason', '')
            
            # Update session
            session.status = 'cancelled'
            session.cancellation_reason = cancellation_reason
            session.save()
            
            # If there's a linked request, set it back to pending
            if session.request:
                session.request.status = 'pending'
                session.request.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Session cancelled successfully'
            })
            
        except CounsellingSessions.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Session not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to cancel session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def reschedule_counselling_session(request, session_id):
    """Reschedule a counselling session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            session = CounsellingSessions.objects.get(session_id=session_id)
            
            if session.status not in ['scheduled', 'pending']:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Only scheduled or pending sessions can be rescheduled'
                }, status=400)
            
            # Validate required field
            new_scheduled_at = data.get('scheduled_at')
            if not new_scheduled_at:
                return JsonResponse({
                    'status': 'error',
                    'message': 'New scheduled_at is required'
                }, status=400)
            
            # Parse the datetime
            from datetime import datetime
            new_datetime = datetime.fromisoformat(new_scheduled_at.replace('Z', '+00:00'))
            
            # Update session
            session.scheduled_at = new_datetime
            session.meeting_link = data.get('meeting_link', session.meeting_link)
            session.location = data.get('location', session.location)
            session.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Session rescheduled successfully'
            })
            
        except CounsellingSessions.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Session not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to reschedule session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def complete_counselling_session(request, session_id):
    """Mark a counselling session as completed"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            session = CounsellingSessions.objects.get(session_id=session_id)
            
            if session.status != 'scheduled':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Only scheduled sessions can be completed'
                }, status=400)
            
            # Update session
            session.status = 'completed'
            session.completion_notes = data.get('completion_notes', '')
            session.save()
            
            # Update linked request if exists
            if session.request:
                session.request.status = 'completed'
                session.request.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Session completed successfully'
            })
            
        except CounsellingSessions.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Session not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to complete session: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    }, status=405)


@csrf_exempt
def get_counselling_stats(request, counsellor_id):
    """Get counselling statistics for a counsellor"""
    if request.method == 'GET':
        try:
            counsellor = Counsellors.objects.get(counsellor_id=counsellor_id)
            
            # Get counts
            total_requests = CounsellingRequests.objects.filter(counsellor=counsellor).count()
            pending_requests = CounsellingRequests.objects.filter(counsellor=counsellor, status='pending').count()
            scheduled_sessions = CounsellingSessions.objects.filter(counsellor=counsellor, status='scheduled').count()
            completed_sessions = CounsellingSessions.objects.filter(counsellor=counsellor, status='completed').count()
            
            # Calculate averages (mock for now - you can implement proper calculation)
            average_rating = 4.8  # TODO: Calculate from CounsellingFeedback
            response_rate = 95.0   # TODO: Calculate based on response times
            
            stats = {
                'totalRequests': total_requests,
                'pendingRequests': pending_requests,
                'scheduledSessions': scheduled_sessions,
                'completedSessions': completed_sessions,
                'averageRating': average_rating,
                'responseRate': response_rate,
            }
            
            return JsonResponse({
                'status': 'success',
                'stats': stats
            })
            
        except Counsellors.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Counsellor not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Failed to fetch stats: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Only GET method allowed'
    }, status=405)


def update_expired_requests():
    """Helper function to update expired counselling requests"""
    try:
        expired_requests = CounsellingRequests.objects.filter(
            status='pending',
            expiry_date__lt=timezone.now()
        )
        expired_requests.update(status='expired')
        return expired_requests.count()
    except Exception as e:
        print(f"Error updating expired requests: {e}")
        return 0