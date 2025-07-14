# from django.contrib import admin
# from .models import Universities, Faculties

# @admin.register(Universities)
# class UniversitiesAdmin(admin.ModelAdmin):
#     list_display = ['name', 'location', 'district', 'ugc_ranking', 'is_active']
#     search_fields = ['name', 'location', 'district']
#     list_filter = ['district', 'is_active', 'ugc_ranking']
#     ordering = ['ugc_ranking']

# @admin.register(Faculties)
# class FacultiesAdmin(admin.ModelAdmin):
#     list_display = ['faculty_name', 'university', 'established_year']
#     search_fields = ['faculty_name', 'university__name']
#     list_filter = ['university']