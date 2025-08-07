from rest_framework import serializers
from .models import PreUniCourse, CourseContent, CourseEnrollment


class CourseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'


class PreUniCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreUniCourse
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Format dates to match frontend expectations
        if instance.updated_at:
            data['lastUpdated'] = instance.updated_at.strftime('%Y-%m-%d')
        elif instance.created_at:
            data['lastUpdated'] = instance.created_at.strftime('%Y-%m-%d')
        
        # Rename course_id to id for frontend compatibility
        data['id'] = data.pop('course_id')
        return data


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = '__all__'


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreUniCourse
        fields = [
            'title', 'description', 'category', 'price', 'duration', 
            'thumbnail', 'status'
        ]

    def validate_price(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
