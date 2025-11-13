from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max
import json
from .models import DegreePrograms, DegreeProgramZScores, DegreeProgramDurations
from apps.universities.models import Universities, Faculties


def analyze_zscore(request):
    """
    Analyze Z-score and return eligible degree programs based on district and stream
    """
    if request.method == 'GET':
        try:
            # Get query parameters
            user_zscore_str = request.GET.get('zscore')
            district = request.GET.get('district')
            stream = request.GET.get('stream')
            
            # Validation
            if not all([user_zscore_str, district, stream]):
                return JsonResponse({
                    'success': False,
                    'message': 'Z-score, district, and stream are required'
                }, status=400)
            
            try:
                user_zscore = float(user_zscore_str)
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid Z-score format'
                }, status=400)
            
            # Get the most recent year for each degree program in the specified district
            # Subquery to get the max year per degree_program and district
            recent_years = DegreeProgramZScores.objects.filter(
                district=district
            ).values('degree_program_id').annotate(
                max_year=Max('year')
            )
            
            # Build a list of (degree_program_id, max_year) tuples
            program_year_pairs = [(item['degree_program_id'], item['max_year']) for item in recent_years]
            
            # Get all z-score records for the most recent year of each program in this district
            eligible_programs = []
            
            for program_id, max_year in program_year_pairs:
                z_score_record = DegreeProgramZScores.objects.filter(
                    degree_program_id=program_id,
                    district=district,
                    year=max_year
                ).first()
                
                if not z_score_record:
                    continue
                
                # Get the degree program with related data
                try:
                    degree_program = DegreePrograms.objects.select_related(
                        'university', 'faculty'
                    ).get(
                        degree_program_id=program_id,
                        is_active=1
                    )
                except DegreePrograms.DoesNotExist:
                    continue
                
                # Filter by stream
                # Map frontend stream to database values
                stream_mapping = {
                    'Physical Science': 'Maths',
                    'Biological Science': 'Science',
                    'Mathematics': 'Maths',
                    'Commerce': 'Commerce',
                    'Arts': 'Arts',
                    'Technology': 'Technology',
                    'Other': 'Other'
                }
                
                db_stream = stream_mapping.get(stream, stream)
                
                # Check if program matches the stream or accepts "Other" (any stream)
                if degree_program.subject_stream_required not in [db_stream, 'Other', None]:
                    continue
                
                # Calculate probability
                program_zscore = float(z_score_record.z_score)
                
                if user_zscore >= program_zscore:
                    probability = 'High'
                elif user_zscore >= (program_zscore - 0.1):
                    probability = 'Medium'
                else:
                    probability = 'Low'
                
                # Build response object
                eligible_programs.append({
                    'degree_program_id': degree_program.degree_program_id,
                    'title': degree_program.title,
                    'code': degree_program.code,
                    'description': degree_program.description,
                    'career_paths': degree_program.career_paths,
                    'university_id': degree_program.university.university_id if degree_program.university else None,
                    'university_name': degree_program.university.name if degree_program.university else None,
                    'faculty_id': degree_program.faculty.faculty_id if degree_program.faculty else None,
                    'faculty_name': degree_program.faculty.name if degree_program.faculty else None,
                    'required_zscore': program_zscore,
                    'year': z_score_record.year,
                    'district': district,
                    'probability': probability
                })
            
            # Sort by probability (High first, then Medium, then Low) and then by required z-score
            probability_order = {'High': 0, 'Medium': 1, 'Low': 2}
            eligible_programs.sort(key=lambda x: (probability_order[x['probability']], -x['required_zscore']))
            
            return JsonResponse({
                'success': True,
                'user_zscore': user_zscore,
                'district': district,
                'stream': stream,
                'eligible_programs': eligible_programs,
                'total_programs': len(eligible_programs)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error analyzing Z-score: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)


def get_all_programs(request):
    """
    Get all degree programs with their details for program matching page
    """
    if request.method == 'GET':
        try:
            # Get query parameters for filtering
            search_term = request.GET.get('search', '').strip()
            category = request.GET.get('category', 'all')
            
            # Start with active programs
            programs_query = DegreePrograms.objects.filter(is_active=1).select_related(
                'university', 'faculty'
            )
            
            # Apply category filter based on subject_stream_required
            # Category now directly maps to subject_stream_required values
            if category != 'all':
                programs_query = programs_query.filter(subject_stream_required=category)
            
            # Apply search filter
            if search_term:
                from django.db.models import Q
                programs_query = programs_query.filter(
                    Q(title__icontains=search_term) |
                    Q(description__icontains=search_term) |
                    Q(university__name__icontains=search_term) |
                    Q(faculty__name__icontains=search_term)
                )
            
            # Build response
            programs_list = []
            
            for program in programs_query:
                # Get duration information
                duration_info = DegreeProgramDurations.objects.filter(
                    degree_program=program
                ).first()
                
                # Get the most recent z-score (from any district)
                recent_zscore = DegreeProgramZScores.objects.filter(
                    degree_program=program
                ).order_by('-year', '-z_score').first()
                
                # Use subject_stream_required directly as category
                program_category = program.subject_stream_required or 'Other'
                
                programs_list.append({
                    'id': program.degree_program_id,
                    'name': program.title,
                    'code': program.code,
                    'university': program.university.name if program.university else None,
                    'university_id': program.university.university_id if program.university else None,
                    'faculty': program.faculty.name if program.faculty else None,
                    'faculty_id': program.faculty.faculty_id if program.faculty else None,
                    'duration': f"{duration_info.duration_years} years" if duration_info else "N/A",
                    'duration_years': duration_info.duration_years if duration_info else None,
                    'degree_type': duration_info.degree_type if duration_info else None,
                    'zScoreRequired': float(recent_zscore.z_score) if recent_zscore else None,
                    'description': program.description,
                    'careerProspects': program.career_paths.split(',') if program.career_paths else [],
                    'syllabus_url': program.syllabus_url,
                    'category': program_category,
                    'subject_stream_required': program.subject_stream_required,
                })
            
            return JsonResponse({
                'success': True,
                'programs': programs_list,
                'total': len(programs_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error fetching programs: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Only GET method allowed'
    }, status=405)
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Q
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404
import json
from apps.universities.models import Universities, Faculties
from .models import (
    DegreePrograms,
    Courses,
    DegreeProgramCourses,
    DegreeProgramDurations,
    DegreeProgramZScores,
    FacultyDegreePrograms,
    SubjectOverview,
    SubjectFile,
    AcademicContent,
)


# ------- Helpers -------
def _program_dict(p: DegreePrograms):
    return {
        'id': p.degree_program_id,
        'title': p.title,
        'code': p.code,
        'description': p.description,
        'university_id': p.university_id,
    }


def _course_dict(c: Courses):
    return {
        'id': c.course_id,
        'name': c.title,
        'code': c.code,
        'credits': float(c.credits) if c.credits is not None else None,
        'description': c.description,
    }


def _faculty_dict(f: Faculties):
    return {
        'id': f.faculty_id,
        'name': f.name,
        'description': f.description or '',
        'university_id': f.university_id,
    }


def _subject_overview(course: Courses):
    ov = getattr(course, 'overview', None)
    return ov.data if ov else {}


def _files_list(course: Courses):
    return [
        {
            'id': f.file_id,
            'name': f.original_name,
            'url': f.file.url if f.file else None,
        }
        for f in course.files.all()
    ]


# ------- Summary counts -------
def academic_summary(request):
    """Return counts for a university (faculties, programs, courses)."""
    uid = request.GET.get('university_id')
    if not uid:
        return JsonResponse({'success': False, 'message': 'university_id required'}, status=400)
    try:
        uid = int(uid)
    except Exception:
        return JsonResponse({'success': False, 'message': 'invalid university_id'}, status=400)

    # live counts from tables (avoid stale cache for now)
    fac_count = Faculties.objects.filter(university_id=uid).count()
    prog_ids = list(DegreePrograms.objects.filter(
        university_id=uid).values_list('degree_program_id', flat=True))
    course_ids = list(DegreeProgramCourses.objects.filter(
        degree_program_id__in=prog_ids).values_list('course_id', flat=True).distinct())

    return JsonResponse({
        'success': True,
        'faculty_count': fac_count,
        'course_count': len(prog_ids),
        'subject_count': len(course_ids),
    })


# ------- Faculties and Programs -------
def faculties_by_university(request):
    uid = request.GET.get('university_id')
    if not uid:
        return JsonResponse({'success': False, 'message': 'university_id required'}, status=400)
    facs = Faculties.objects.filter(university_id=uid)
    return JsonResponse({'success': True, 'faculties': [_faculty_dict(f) for f in facs]})


def programs_by_faculty(request, faculty_id: int):
    # Support both mapping table and direct FK column on degree_programs
    prog_ids = list(FacultyDegreePrograms.objects.filter(
        faculty_id=faculty_id).values_list('degree_program_id', flat=True))
    progs = DegreePrograms.objects.filter(
        Q(degree_program_id__in=prog_ids) | Q(faculty_id=faculty_id)).distinct()
    return JsonResponse({'success': True, 'programs': [_program_dict(p) for p in progs]})


@csrf_exempt
def program_create_update_delete(request):
    """Create, update, delete DegreePrograms with optional faculty mapping.
    - POST create: {university_id,title,code,description,faculty_id?}
    - PUT update: {id, ...fields}
    - DELETE: {id}
    """
    if request.method == 'POST':
        data = json.loads(request.body or '{}')
        with transaction.atomic():
            p = DegreePrograms.objects.create(
                university_id=data['university_id'],
                title=data['title'],
                code=data.get('code') or '',
                description=data.get('description') or '',
                is_active=1,
                faculty_id=data.get('faculty_id') or None,
            )
            # Also ensure mapping row exists for compatibility with prior data
            if data.get('faculty_id'):
                FacultyDegreePrograms.objects.get_or_create(
                    faculty_id=data['faculty_id'], degree_program=p)
        return JsonResponse({'success': True, 'program': _program_dict(p)}, status=201)

    if request.method == 'PUT':
        data = json.loads(request.body or '{}')
        p = get_object_or_404(DegreePrograms, degree_program_id=data['id'])
        for field in ['title', 'code', 'description']:
            if field in data:
                setattr(p, field, data[field])
        # Sync faculty on the DegreePrograms row as well
        if 'faculty_id' in data:
            p.faculty_id = data['faculty_id'] or None
        p.save()
        # Update faculty mapping if provided
        if 'faculty_id' in data:
            FacultyDegreePrograms.objects.filter(degree_program=p).delete()
            if data['faculty_id']:
                FacultyDegreePrograms.objects.create(
                    faculty_id=data['faculty_id'], degree_program=p)
        return JsonResponse({'success': True, 'program': _program_dict(p)})

    if request.method == 'DELETE':
        data = json.loads(request.body or '{}')
        p = get_object_or_404(DegreePrograms, degree_program_id=data['id'])
        with transaction.atomic():
            FacultyDegreePrograms.objects.filter(degree_program=p).delete()
            DegreeProgramCourses.objects.filter(degree_program=p).delete()
            p.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


# ------- Subjects (Courses linked to a specific Program) -------
def subjects_by_program(request, program_id: int):
    course_ids = DegreeProgramCourses.objects.filter(
        degree_program_id=program_id).values_list('course_id', flat=True)
    courses = Courses.objects.filter(course_id__in=course_ids)
    return JsonResponse({'success': True, 'subjects': [{**_course_dict(c), 'overview': _subject_overview(c), 'files': _files_list(c)} for c in courses]})


@csrf_exempt
def subject_create_update_delete(request, program_id: int = None):
    """Manage subject (Course) and its mapping to a program.
    - POST create: {name(code/title), code, credits, description}
    - PUT update: {id, ...}
    - DELETE: {id}
    """
    if request.method == 'POST':
        data = json.loads(request.body or '{}')
        with transaction.atomic():
            c = Courses.objects.create(
                title=data['name'],
                code=data.get('code') or '',
                description=data.get('description') or '',
                credits=data.get('credits') or None,
                is_active=1,
            )
            if program_id:
                DegreeProgramCourses.objects.create(
                    degree_program_id=program_id, course=c)
        return JsonResponse({'success': True, 'subject': _course_dict(c)}, status=201)

    if request.method == 'PUT':
        data = json.loads(request.body or '{}')
        c = get_object_or_404(Courses, course_id=data['id'])
        for field_map in [('name', 'title'), ('code', 'code'), ('description', 'description'), ('credits', 'credits')]:
            src, dest = field_map
            if src in data:
                setattr(c, dest, data[src])
        c.save()
        return JsonResponse({'success': True, 'subject': _course_dict(c)})

    if request.method == 'DELETE':
        data = json.loads(request.body or '{}')
        c = get_object_or_404(Courses, course_id=data['id'])
        with transaction.atomic():
            DegreeProgramCourses.objects.filter(course=c).delete()
            SubjectFile.objects.filter(course=c).delete()
            SubjectOverview.objects.filter(course=c).delete()
            c.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


# ------- Subject overview -------
@csrf_exempt
def subject_overview_view(request, course_id: int):
    c = get_object_or_404(Courses, pk=course_id)
    if request.method == 'GET':
        return JsonResponse({'success': True, 'overview': _subject_overview(c)})
    if request.method in ('POST', 'PUT'):
        data = json.loads(request.body or '{}')
        ov, _ = SubjectOverview.objects.update_or_create(
            course=c, defaults={'data': data})
        return JsonResponse({'success': True, 'overview': ov.data})
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


# ------- Subject files -------
@csrf_exempt
def subject_files_view(request, course_id: int):
    c = get_object_or_404(Courses, pk=course_id)
    if request.method == 'GET':
        return JsonResponse({'success': True, 'files': _files_list(c)})
    if request.method == 'POST':
        # Expecting multipart/form-data
        f = request.FILES.get('file')
        if not f:
            return JsonResponse({'success': False, 'message': 'file required'}, status=400)
        sf = SubjectFile.objects.create(course=c, file=f, original_name=f.name)
        return JsonResponse({'success': True, 'file': {'id': sf.file_id, 'name': sf.original_name, 'url': sf.file.url}}, status=201)
    if request.method == 'DELETE':
        data = json.loads(request.body or '{}')
        file_id = data.get('id')
        sf = get_object_or_404(SubjectFile, pk=file_id, course=c)
        sf.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


def download_subject_file(request, file_id: int):
    sf = get_object_or_404(SubjectFile, pk=file_id)
    if not sf.file:
        raise Http404('File not found')
    response = FileResponse(sf.file.open(
        'rb'), as_attachment=True, filename=sf.original_name)
    return response
