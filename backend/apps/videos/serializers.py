from rest_framework import serializers
from .models import CourseVideo, VideoComment, VideoPlaylist, PlaylistVideo
from apps.tutoring.models import Tutors
from apps.student_results.models import AlSubjects
from apps.accounts.models import Users


class CourseVideoSerializer(serializers.ModelSerializer):
    """Serializer for course videos"""
    
    tutor_name = serializers.CharField(source='tutor.user.username', read_only=True)
    tutor_bio = serializers.CharField(source='tutor.bio', read_only=True)
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    file_size_mb = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseVideo
        fields = [
            'video_id', 'title', 'description', 'category', 'video_file',
            'file_size', 'file_size_mb', 'duration', 'thumbnail',
            'subject', 'subject_name', 'status', 'view_count', 'likes',
            'uploaded_at', 'updated_at', 'tags', 'is_featured', 'is_public',
            'tutor', 'tutor_name', 'tutor_bio', 'video_url', 'thumbnail_url'
        ]
        read_only_fields = [
            'video_id', 'uploaded_at', 'updated_at', 'view_count', 
            'likes', 'file_size', 'status', 'tutor_name', 'tutor_bio',
            'subject_name', 'file_size_mb', 'video_url', 'thumbnail_url'
        ]
    
    def get_file_size_mb(self, obj):
        return obj.get_file_size_mb()
    
    def get_video_url(self, obj):
        if obj.video_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video_file.url)
        return None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
        return None
    
    def validate_video_file(self, value):
        """Validate video file format and size"""
        if value:
            # Check file extension
            allowed_extensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
            file_extension = '.' + value.name.split('.')[-1].lower()
            
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}"
                )
            
            # Check file size (limit to 500MB)
            max_size = 500 * 1024 * 1024  # 500MB in bytes
            if value.size > max_size:
                raise serializers.ValidationError(
                    f"File size too large. Maximum allowed size is 500MB. Current size: {round(value.size / (1024*1024), 2)}MB"
                )
        
        return value
    
    def create(self, validated_data):
        """Create video with file size calculation"""
        video = super().create(validated_data)
        if video.video_file:
            video.file_size = video.video_file.size
            video.save(update_fields=['file_size'])
        return video


class VideoUploadSerializer(serializers.ModelSerializer):
    """Simplified serializer for video upload"""
    
    class Meta:
        model = CourseVideo
        fields = [
            'title', 'description', 'category', 'video_file',
            'subject', 'tags', 'is_public'
        ]
    
    def validate_video_file(self, value):
        """Validate video file format and size"""
        if value:
            # Check file extension
            allowed_extensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
            file_extension = '.' + value.name.split('.')[-1].lower()
            
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}"
                )
            
            # Check file size (limit to 500MB)
            max_size = 500 * 1024 * 1024  # 500MB in bytes
            if value.size > max_size:
                raise serializers.ValidationError(
                    f"File size too large. Maximum allowed size is 500MB."
                )
        
        return value


class VideoCommentSerializer(serializers.ModelSerializer):
    """Serializer for video comments"""
    
    user_name = serializers.CharField(source='user.username', read_only=True)
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VideoComment
        fields = [
            'comment_id', 'video', 'user', 'user_name', 'comment',
            'parent_comment', 'created_at', 'updated_at', 'is_edited',
            'replies_count'
        ]
        read_only_fields = ['comment_id', 'created_at', 'updated_at', 'user_name', 'replies_count']
    
    def get_replies_count(self, obj):
        return obj.replies.count()


class VideoPlaylistSerializer(serializers.ModelSerializer):
    """Serializer for video playlists"""
    
    tutor_name = serializers.CharField(source='tutor.user.username', read_only=True)
    videos_count = serializers.SerializerMethodField()
    videos = CourseVideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = VideoPlaylist
        fields = [
            'playlist_id', 'tutor', 'tutor_name', 'title', 'description',
            'videos', 'videos_count', 'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'playlist_id', 'created_at', 'updated_at', 'tutor_name', 'videos_count'
        ]
    
    def get_videos_count(self, obj):
        return obj.videos.count()


class SubjectSerializer(serializers.ModelSerializer):
    """Simple serializer for subjects"""
    
    class Meta:
        model = AlSubjects
        fields = ['subject_id', 'subject_name']
