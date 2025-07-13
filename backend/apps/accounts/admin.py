# from django.contrib import admin
# from .models import Users, UserDetails, UserTypes

# @admin.register(Users)
# class UsersAdmin(admin.ModelAdmin):
#     list_display = ['username', 'email', 'user_type', 'is_active', 'created_at']
#     search_fields = ['username', 'email']
#     list_filter = ['user_type', 'is_active']

# @admin.register(UserTypes)
# class UserTypesAdmin(admin.ModelAdmin):
#     list_display = ['type_name']

# @admin.register(UserDetails)
# class UserDetailsAdmin(admin.ModelAdmin):
#     list_display = ['first_name', 'last_name', 'user']
#     search_fields = ['first_name', 'last_name']