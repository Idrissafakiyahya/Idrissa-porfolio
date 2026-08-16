from rest_framework import serializers
from .models import (
    Profile, Skill, Project, ProjectImage, Experience, 
    Education, Testimonial, ContactMessage
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'title', 'bio', 'profile_photo',
            'resume_file', 'email', 'phone', 'location',
            'github_url', 'linkedin_url', 'twitter_url', 'website_url'
        ]
        read_only_fields = ['id']  # Only ID is read-only


class SkillSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    proficiency_display = serializers.CharField(source='get_proficiency_display', read_only=True)

    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'category', 'category_display', 'proficiency',
            'proficiency_display', 'icon', 'order'
        ]
        read_only_fields = ['id']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order']
        read_only_fields = ['id']


class ProjectSerializer(serializers.ModelSerializer):
    gallery_images = ProjectImageSerializer(many=True, read_only=True)
    tech_stack_list = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'category_display', 'short_description', 'description',
            'cover_image', 'tech_stack', 'tech_stack_list', 'live_url',
            'github_url', 'featured', 'gallery_images', 'order', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']

    def get_tech_stack_list(self, obj):
        return [tech.strip() for tech in obj.tech_stack.split(',')]


class ExperienceSerializer(serializers.ModelSerializer):
    is_current = serializers.BooleanField(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Experience
        fields = [
            'id', 'role', 'company', 'location', 'category', 'category_display', 'start_date', 'end_date',
            'description', 'company_logo', 'is_current', 'order'
        ]
        read_only_fields = ['id', 'is_current']


class EducationSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field', 'category', 'category_display', 'start_date',
            'end_date', 'description', 'order'
        ]
        read_only_fields = ['id']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'photo', 'message', 'rating', 'order'
        ]
        read_only_fields = ['id']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required")
        return value

    def validate_message(self, value):
        """Validate message is not empty"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long")
        return value
