from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from apps.accounts.models import Users
from .models import PreUniCourse, CourseEnrollment
import json


class PreUniCourseTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        
        # Create a test user
        self.user = Users.objects.create(
            user_id=1,
            email='test@example.com',
            user_type='instructor'
        )
        
        # Create a test course
        self.course = PreUniCourse.objects.create(
            title='Test Mathematics Course',
            description='A test course for mathematics',
            category='Mathematics',
            price=100.00,
            duration='8 weeks',
            status='Published',
            created_by=self.user
        )

    def test_create_course(self):
        """Test creating a new course"""
        course_data = {
            'title': 'New Physics Course',
            'description': 'A comprehensive physics course',
            'category': 'Physics',
            'price': 150.00,
            'duration': '10 weeks',
            'status': 'Draft',
            'created_by_id': self.user.user_id
        }
        
        response = self.client.post(
            '/api/pre-uni-courses/create/',
            data=json.dumps(course_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['course']['title'], 'New Physics Course')

    def test_get_courses(self):
        """Test retrieving courses"""
        response = self.client.get('/api/pre-uni-courses/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['courses']), 1)
        self.assertEqual(response_data['courses'][0]['title'], 'Test Mathematics Course')

    def test_get_course_detail(self):
        """Test retrieving a specific course"""
        response = self.client.get(f'/api/pre-uni-courses/{self.course.id}/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['course']['title'], 'Test Mathematics Course')

    def test_update_course(self):
        """Test updating a course"""
        update_data = {
            'title': 'Updated Mathematics Course',
            'price': 120.00
        }
        
        response = self.client.put(
            f'/api/pre-uni-courses/{self.course.id}/update/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['course']['title'], 'Updated Mathematics Course')

    def test_delete_course(self):
        """Test deleting a course"""
        response = self.client.delete(f'/api/pre-uni-courses/{self.course.id}/delete/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        
        # Verify course is deleted
        self.assertFalse(PreUniCourse.objects.filter(id=self.course.id).exists())

    def test_get_stats(self):
        """Test getting course statistics"""
        response = self.client.get('/api/pre-uni-courses/stats/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['stats']['total_courses'], 1)
        self.assertEqual(response_data['stats']['published'], 1)
