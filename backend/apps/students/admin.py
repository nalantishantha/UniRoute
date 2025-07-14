# from django.contrib import admin
# from .models import Students, AlStudents, PostAlStudents, OlStudentResults

# @admin.register(Students)
# class StudentsAdmin(admin.ModelAdmin):
#     list_display = ['student_id', 'user', 'school', 'student_stage', 'created_at']
#     search_fields = ['student_id', 'user__username', 'school']
#     list_filter = ['school', 'student_stage', 'created_at']

# @admin.register(AlStudents)
# class AlStudentsAdmin(admin.ModelAdmin):
#     list_display = ['al_student_id', 'student', 'stream', 'al_year', 'z_score', 'district_rank']
#     search_fields = ['student__student_id', 'al_index_number']
#     list_filter = ['stream', 'al_year']

# @admin.register(PostAlStudents)
# class PostAlStudentsAdmin(admin.ModelAdmin):
#     list_display = ['post_al_student_id', 'al_student', 'current_status', 'gap_year_count', 'is_employed']
#     search_fields = ['al_student__student__student_id']
#     list_filter = ['current_status', 'is_employed', 'employment_field']

# @admin.register(OlStudentResults)
# class OlStudentResultsAdmin(admin.ModelAdmin):
#     list_display = ['ol_result_id', 'student', 'subject', 'grade', 'ol_year']
#     search_fields = ['student__student_id']
#     list_filter = ['grade', 'ol_year', 'subject']