from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max
import json
from .models import DegreePrograms, DegreeProgramZScores
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
