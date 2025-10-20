from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone
from .models import Counsellors, CounsellorAvailability
from apps.accounts.models import Users, UserDetails, UserTypes


class CounsellorCreationForm:
    """Helper class for counsellor creation form"""
    
    @staticmethod
    def create_counsellor(form_data):
        """Create a new counsellor account"""
        try:
            with transaction.atomic():
                # Get counsellor user type
                counsellor_user_type = UserTypes.objects.get(type_name='counsellor')
                
                # Create username from first and last name
                first_name = form_data.get('first_name', '')
                last_name = form_data.get('last_name', '')
                username = f"{first_name.lower()}.{last_name.lower()}".replace(' ', '')
                
                # Check if username already exists, if so add numbers
                original_username = username
                counter = 1
                while Users.objects.filter(username=username).exists():
                    username = f"{original_username}{counter}"
                    counter += 1
                
                # Create user
                user = Users.objects.create(
                    username=username,
                    email=form_data.get('email'),
                    password_hash=make_password(form_data.get('password')),
                    user_type=counsellor_user_type,
                    is_active=1,
                    created_at=timezone.now()
                )
                
                # Create user details
                user_details = UserDetails.objects.create(
                    user=user,
                    full_name=f"{first_name} {last_name}",
                    contact_number=form_data.get('contact_number', ''),
                    bio=form_data.get('bio', ''),
                    is_verified=1,  # Admin-created accounts are pre-verified
                    updated_at=timezone.now()
                )
                
                # Create counsellor record
                counsellor = Counsellors.objects.create(
                    user=user,
                    expertise=form_data.get('expertise', ''),
                    bio=form_data.get('bio', ''),
                    experience_years=int(form_data.get('experience_years')) if form_data.get('experience_years') else None,
                    qualifications=form_data.get('qualifications', ''),
                    specializations=form_data.get('specializations', ''),
                    available_for_sessions=form_data.get('available_for_sessions') == 'on',
                    hourly_rate=float(form_data.get('hourly_rate')) if form_data.get('hourly_rate') else None,
                )
                
                return counsellor, None
                
        except Exception as e:
            return None, str(e)


@admin.register(Counsellors)
class CounsellorsAdmin(admin.ModelAdmin):
    list_display = ['counsellor_id', 'get_full_name', 'get_email', 'experience_years', 'available_for_sessions', 'get_is_active', 'created_at']
    list_filter = ['available_for_sessions', 'experience_years', 'created_at', 'user__is_active']
    search_fields = ['user__email', 'user__userdetails__full_name', 'expertise', 'specializations']
    readonly_fields = ['counsellor_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'available_for_sessions')
        }),
        ('Professional Details', {
            'fields': ('expertise', 'bio', 'experience_years', 'qualifications', 'specializations', 'hourly_rate')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['activate_counsellors', 'deactivate_counsellors']
    
    def get_full_name(self, obj):
        try:
            return obj.user.userdetails.full_name
        except:
            return "N/A"
    get_full_name.short_description = 'Full Name'
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    
    def get_is_active(self, obj):
        return bool(obj.user.is_active)
    get_is_active.short_description = 'Active'
    get_is_active.boolean = True
    
    def activate_counsellors(self, request, queryset):
        count = 0
        for counsellor in queryset:
            counsellor.user.is_active = 1
            counsellor.user.save()
            count += 1
        messages.success(request, f'Successfully activated {count} counsellor(s)')
    activate_counsellors.short_description = "Activate selected counsellors"
    
    def deactivate_counsellors(self, request, queryset):
        count = 0
        for counsellor in queryset:
            counsellor.user.is_active = 0
            counsellor.user.save()
            count += 1
        messages.success(request, f'Successfully deactivated {count} counsellor(s)')
    deactivate_counsellors.short_description = "Deactivate selected counsellors"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('create-counsellor/', self.create_counsellor_view, name='create_counsellor'),
        ]
        return custom_urls + urls
    
    def create_counsellor_view(self, request):
        """Custom view for creating counsellors"""
        if request.method == 'POST':
            form_data = request.POST.dict()
            
            # Validate required fields
            required_fields = ['first_name', 'last_name', 'email', 'password']
            missing_fields = [field for field in required_fields if not form_data.get(field)]
            
            if missing_fields:
                messages.error(request, f'Missing required fields: {", ".join(missing_fields)}')
            else:
                # Check if email already exists
                if Users.objects.filter(email=form_data.get('email')).exists():
                    messages.error(request, 'Email already exists')
                else:
                    counsellor, error = CounsellorCreationForm.create_counsellor(form_data)
                    if counsellor:
                        messages.success(request, f'Counsellor "{counsellor.user.userdetails.full_name}" created successfully!')
                        return HttpResponseRedirect(reverse('admin:counsellors_counsellors_changelist'))
                    else:
                        messages.error(request, f'Error creating counsellor: {error}')
        
        context = {
            'title': 'Create New Counsellor',
            'opts': self.model._meta,
            'has_view_permission': True,
            'has_change_permission': True,
        }
        return TemplateResponse(request, 'admin/counsellors/create_counsellor.html', context)
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['create_counsellor_url'] = reverse('admin:create_counsellor')
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(CounsellorAvailability)
class CounsellorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['counsellor', 'get_counsellor_name', 'day_of_week', 'start_time', 'end_time', 'is_active']
    list_filter = ['day_of_week', 'is_active']
    search_fields = ['counsellor__user__email', 'counsellor__user__userdetails__full_name']
    
    def get_counsellor_name(self, obj):
        try:
            return obj.counsellor.user.userdetails.full_name
        except:
            return "N/A"
    get_counsellor_name.short_description = 'Counsellor Name'