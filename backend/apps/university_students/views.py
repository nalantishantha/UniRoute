from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.contrib.auth.hashers import check_password, make_password
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import json
import os
import uuid
from .models import (
    UniversityStudents, 
    UniversityStudentEducation,
    UniversityStudentExperience,
    UniversityStudentSocialLinks
)
from ..accounts.models import Users, UserDetails

@csrf_exempt
@require_http_methods(["GET"])
def get_profile(request):
    try:
        # Get user from session or token (implement your auth logic)
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID required'
            }, status=400)
 
        # Get user and university student data
        try:
            user = Users.objects.get(user_id=user_id)
            user_details = UserDetails.objects.get(user=user)
            university_student = UniversityStudents.objects.select_related(
                'university', 'faculty', 'degree_program'
            ).get(user=user)
            
        except (Users.DoesNotExist, UserDetails.DoesNotExist, UniversityStudents.DoesNotExist):
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
  
        # Get related data - fetch all education records
        education_history = list(university_student.education_history.values(
            'degree', 'institution', 'year', 'gpa'
        ))
        work_experience = list(university_student.work_experience.values(
            'title', 'company', 'period', 'description'
        ))
        
        # Get the most recent education record for main GPA display (optional)
        latest_education = university_student.education_history.order_by('-year').first()
        main_gpa = str(latest_education.gpa) if latest_education and latest_education.gpa else ''
        
        try:
            social_links = university_student.social_links
            social_links_data = {
                'github': social_links.github or '',
                'x': social_links.x or '',
                'linkedin': social_links.linkedin or '',
                'website': social_links.website or ''
            }
        except UniversityStudentSocialLinks.DoesNotExist:
            social_links_data = {
                'github': '',
                'x': '',
                'linkedin': '',
                'website': ''
            }
        
        # Generate proper avatar URL - return relative path
        avatar_url = ''
        if user_details.profile_picture:
            avatar_url = user_details.profile_picture
        
        profile_data = {
            'personal': {
                'name': user_details.full_name or '',
                'email': user.email,
                'phone': user_details.contact_number or '',
                'location': user_details.location or '',
                'bio': user_details.bio or '',
                'avatar': avatar_url,
                'joinDate': university_student.enrollment_date.strftime('%B %Y') if university_student.enrollment_date else '',
            },
            'university': {
                'university': university_student.university.name if university_student.university else '',
                'faculty': university_student.faculty.name if university_student.faculty else '',
                'degree_program': university_student.degree_program.title if university_student.degree_program else '',
                'year_of_study': university_student.year_of_study,
                'registration_number': university_student.registration_number or '',
                'gpa': main_gpa,
            },
            'education': education_history,
            'experience': work_experience,
            'social_links': social_links_data,
        }

        return JsonResponse({
            'success': True,
            'profile': profile_data
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error fetching profile: {str(e)}'
        }, status=500)
@csrf_exempt
@require_http_methods(["PUT"])
def update_profile(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID required'
            }, status=400)

        with transaction.atomic():
            # Get user and related objects
            user = Users.objects.get(user_id=user_id)
            user_details = UserDetails.objects.get(user=user)
            university_student = UniversityStudents.objects.get(user=user)
 # Update personal information
            if 'personal' in data:
                personal_data = data['personal']
                user_details.full_name = personal_data.get('name', user_details.full_name)
                user_details.contact_number = personal_data.get('phone', user_details.contact_number)
                user_details.location = personal_data.get('location', user_details.location)
                user_details.bio = personal_data.get('bio', user_details.bio)
                user_details.profile_picture = personal_data.get('avatar', user_details.profile_picture)
                user_details.save()

                # Update email if provided
                if 'email' in personal_data and personal_data['email'] != user.email:
                    user.email = personal_data['email']
                    user.save()# Update university information
            
 # Update education history
            if 'education' in data:
                # Clear existing education records
                university_student.education_history.all().delete()
                # Create new records
                for edu in data['education']:
                    UniversityStudentEducation.objects.create(
                        university_student=university_student,
                        degree=edu.get('degree', ''),
                        institution=edu.get('institution', ''),
                        year=edu.get('year', ''),
                        gpa=edu.get('gpa', '')
                    )
# Update work experience
            if 'experience' in data:
                # Clear existing experience records
                university_student.work_experience.all().delete()
                # Create new records
                for exp in data['experience']:
                    UniversityStudentExperience.objects.create(
                        university_student=university_student,
                        title=exp.get('title', ''),
                        company=exp.get('company', ''),
                        period=exp.get('period', ''),
                        description=exp.get('description', '')
                    )

            # Update social links
            if 'social_links' in data:
                social_data = data['social_links']
                social_links, created = UniversityStudentSocialLinks.objects.get_or_create(
                    university_student=university_student
                )
                social_links.github = social_data.get('github', social_links.github)
                social_links.x = social_data.get('x', social_links.x)
                social_links.linkedin = social_data.get('linkedin', social_links.linkedin)
                social_links.website = social_data.get('website', social_links.website)
                social_links.save()


        return JsonResponse({
            'success': True,
            'message': 'Profile updated successfully'
        })

    except Users.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'User not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error updating profile: {str(e)}'
        }, status=500)
@csrf_exempt
@require_http_methods(["POST"])
def upload_avatar(request):
    try:
        user_id = request.POST.get('user_id')
        
        if not user_id:
            return JsonResponse({
                'success': False,
                'message': 'User ID required'
            }, status=400)

        if 'profile_picture' not in request.FILES:
            return JsonResponse({
                'success': False,
                'message': 'No file uploaded'
            }, status=400)

        file = request.FILES['profile_picture']
        
        # Validate file type
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        file_extension = os.path.splitext(file.name)[1].lower()
        
        if file_extension not in allowed_extensions:
            return JsonResponse({
                'success': False,
                'message': 'Invalid file type. Only JPG, PNG, GIF, and WebP files are allowed.'
            }, status=400)

        # Validate file size (5MB limit)
        if file.size > 5 * 1024 * 1024:
            return JsonResponse({
                'success': False,
                'message': 'File size too large. Maximum size is 5MB.'
            }, status=400)

        try:
            user = Users.objects.get(user_id=user_id)
            user_details = UserDetails.objects.get(user=user)
        except (Users.DoesNotExist, UserDetails.DoesNotExist):
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)

        # Delete old profile picture if it exists
        if user_details.profile_picture:
            try:
                # Remove the old file
                old_file_path = user_details.profile_picture
                if default_storage.exists(old_file_path):
                    default_storage.delete(old_file_path)
            except Exception as e:
                print(f"Error deleting old profile picture: {e}")

        # Generate unique filename
        file_extension = os.path.splitext(file.name)[1].lower()
        unique_filename = f"profile_pictures/{user_id}_{uuid.uuid4().hex}{file_extension}"
        
        # Save the new file
        file_path = default_storage.save(unique_filename, ContentFile(file.read()))
        
        # Update user details
        user_details.profile_picture = file_path
        user_details.save()

        # Return the relative file path, let frontend handle URL construction
        return JsonResponse({
            'success': True,
            'message': 'Profile picture updated successfully',
            'avatar_url': file_path
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error uploading profile picture: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_university_student_by_user(request, user_id):
    """Get university student information by user ID"""
    try:
        university_student = UniversityStudents.objects.get(user__user_id=user_id)
        
        return JsonResponse({
            'success': True,
            'university_student_id': university_student.university_student_id,
            'user_id': university_student.user.user_id,
            'university_id': university_student.university.university_id,
            'degree_program_id': university_student.degree_program.degree_program_id,
            'year_of_study': university_student.year_of_study,
            'registration_number': university_student.registration_number,
            'status': university_student.status,
        })
    
    except UniversityStudents.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'No university student record found for this user'
        }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
