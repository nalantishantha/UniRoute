from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/accounts/', include('apps.accounts.urls')),
    path('api/students/', include('apps.students.urls')),
    path('api/universities/', include('apps.universities.urls')),

    # path('api/student-results/', include('apps.student_results.urls')),
    # path('api/university-programs/', include('apps.university_programs.urls')),
    # path('api/university-students/', include('apps.university_students.urls')),

    path('api/tutoring/', include('apps.tutoring.urls')),
    path('api/mentoring/', include('apps.mentoring.urls')),
    # path('api/communications/', include('apps.communications.urls')),
    path('api/payments/', include('apps.payments.urls')),

    path('api/companies/', include('apps.companies.urls')),
    path('api/advertisements/', include('apps.advertisements.urls')),

    path('api/administration/', include('apps.administration.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
