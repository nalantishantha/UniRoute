from django.http import JsonResponse
from django.db import connection

def students_list(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT student_id, user_id, current_stage, district, school FROM students LIMIT 10")
        students = cursor.fetchall()
    
    data = []
    for student in students:
        data.append({
            'id': student[0],           # student_id
            'user_id': student[1],      # user_id  
            'stage': student[2],        # current_stage
            'district': student[3],     # district
            'school': student[4]        # school
        })
    
    return JsonResponse({'students': data, 'count': len(data)})