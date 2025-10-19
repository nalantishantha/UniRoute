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
