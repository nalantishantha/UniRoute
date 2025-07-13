from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
import json

from apps.accounts.models import Users, UserDetails, UserTypes
from django.contrib.auth.hashers import check_password, make_password

# # Create your views here.

@csrf_exempt
def get_admin_details(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        try:
            user = Users.objects.get(user_id=user_id, user_type_name='admin')
            user_details = UserDetails.objects.get(user=user)
            return JsonResponse({
                'success': True,
                'user': {
                    'user_id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user_details.full_name,
                    'profile_picture': user_details.profile_picture,
                    'bio': user_details.bio,
                    'contact_number': user_details.contact_number,
                    'location': user_details.location,
                    'gender': user_details.gender,
                    'is_verified': user_details.is_verified,
                }
            })
        except Users.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Admin not found'}, status=404)
        except UserDetails.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Admin details not found'}, status=404)
    return JsonResponse({'success': False, 'message': 'Only GET method allowed'}, status=405)

@csrf_exempt
def update_admin_profile(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            
            # Validate admin user
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
            # Update user details
            with transaction.atomic():
                # Update Users table
                if 'email' in data:
                    # Check if email already exists for other users
                    if Users.objects.filter(email=data['email']).exclude(user_id=user_id).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Email already exists'
                        }, status=400)
                    user.email = data['email']
                
                if 'username' in data:
                    # Check if username already exists for other users
                    if Users.objects.filter(username=data['username']).exclude(user_id=user_id).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Username already exists'
                        }, status=400)
                    user.username = data['username']
                
                user.save()
                
                # Update UserDetails table
                user_details, created = UserDetails.objects.get_or_create(user=user)
                if 'first_name' in data:
                    user_details.first_name = data['first_name']
                if 'last_name' in data:
                    user_details.last_name = data['last_name']
                if 'phone_number' in data:
                    user_details.contact_number = data['phone_number']
                
                user_details.updated_at = timezone.now()
                user_details.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'user': {
                        'id': user.user_id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user_details.first_name,
                        'last_name': user_details.last_name,
                        'phone_number': user_details.contact_number
                    }
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Profile update error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Profile update failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)

@csrf_exempt
def change_admin_password(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            # Validate required fields
            if not all([user_id, current_password, new_password]):
                return JsonResponse({
                    'success': False,
                    'message': 'User ID, current password, and new password are required'
                }, status=400)
            
            # Get user and validate
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
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
            
            # Update password
            user.password_hash = make_password(new_password)
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Password changed successfully'
            })
            
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Password change error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Password change failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only PUT method allowed'
    }, status=405)

@csrf_exempt
def delete_admin_account(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            confirmation_text = data.get('confirmation_text')
            
            # Validate confirmation
            if confirmation_text != 'DELETE MY ACCOUNT':
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid confirmation text'
                }, status=400)
            
            # Get user and validate
            user = Users.objects.get(user_id=user_id)
            if user.user_type.type_name != 'admin':
                return JsonResponse({
                    'success': False,
                    'message': 'Unauthorized access'
                }, status=403)
            
            # Check if this is the last admin
            admin_count = Users.objects.filter(user_type__type_name='admin', is_active=1).count()
            if admin_count <= 1:
                return JsonResponse({
                    'success': False,
                    'message': 'Cannot delete the last admin account. Please assign another admin first.'
                }, status=400)
            
            # Delete user account and related data
            with transaction.atomic():
                # Delete user details
                UserDetails.objects.filter(user=user).delete()
                
                # Delete user
                user.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Admin account deleted successfully'
                })
                
        except Users.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print(f"Account deletion error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f'Account deletion failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only DELETE method allowed'
    }, status=405)