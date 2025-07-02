from django.http import JsonResponse
from .models import Universities

def universities_list(request):
    universities = Universities.objects.all()[:10]
    data = []
    for uni in universities:
        data.append({
            'id': uni.university_id,
            'name': uni.name,
            'location': uni.location,
            'district': uni.district
        })
    return JsonResponse({'universities': data, 'count': len(data)})