from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Profile, Skill, Project, ProjectImage, Experience,
    Education, Testimonial, ContactMessage
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'title', 'email', 'location', 'profile_photo_preview']
    search_fields = ['full_name', 'email', 'location']
    fieldsets = (
        ('Basic Information', {
            'fields': ('full_name', 'title', 'bio', 'location', 'email', 'phone')
        }),
        ('Media', {
            'fields': ('profile_photo', 'resume_file')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'website_url')
        }),
    )

    def profile_photo_preview(self, obj):
        if obj.profile_photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.profile_photo.url
            )
        return "No image"
    profile_photo_preview.short_description = "Photo Preview"

    def has_add_permission(self, request):
        """Prevent adding new Profile instances (singleton pattern)"""
        return False

    def has_delete_permission(self, request, obj=None):
        """Prevent deleting the Profile instance"""
        return False

    def changelist_view(self, request, extra_context=None):
        """Ensure only one profile exists - redirect to edit if exists"""
        extra_context = extra_context or {}
        try:
            profile = Profile.objects.get(pk=1)
            # Show message that there's only one profile
            extra_context['title'] = 'Profile Management'
        except Profile.DoesNotExist:
            # Create the singleton profile if it doesn't exist
            Profile.objects.create(pk=1, full_name='Your Name', email='your@email.com')
        return super().changelist_view(request, extra_context)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'icon_preview', 'order']
    list_filter = ['category', 'proficiency']
    search_fields = ['name']
    ordering = ['order', 'category']

    def icon_preview(self, obj):
        if obj.icon:
            return format_html(
                '<img src="{}" width="30" height="30" />',
                obj.icon.url
            )
        return "No icon"
    icon_preview.short_description = "Icon"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'featured', 'cover_image_preview', 'live_url_display', 'order']
    list_filter = ['category', 'featured', 'created_at']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'slug', 'category', 'short_description', 'description')
        }),
        ('Media', {
            'fields': ('cover_image',)
        }),
        ('Details', {
            'fields': ('tech_stack', 'live_url', 'github_url', 'featured', 'order')
        }),
    )

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover;" />',
                obj.cover_image.url
            )
        return "No image"
    cover_image_preview.short_description = "Cover"

    def live_url_display(self, obj):
        if obj.live_url:
            return format_html('<a href="{}" target="_blank">View Live</a>', obj.live_url)
        return "No URL"
    live_url_display.short_description = "Live URL"


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'image_preview', 'caption', 'order']
    list_filter = ['project']
    ordering = ['project', 'order']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image"


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['role', 'company', 'category', 'location', 'current_status', 'company_logo_preview', 'order']
    list_filter = ['category', 'start_date', 'end_date']
    search_fields = ['role', 'company', 'location']
    fieldsets = (
        ('Position Information', {
            'fields': ('role', 'company', 'location', 'category', 'description')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Media', {
            'fields': ('company_logo',)
        }),
        ('Display', {
            'fields': ('order',)
        }),
    )

    def current_status(self, obj):
        if obj.end_date is None:
            return format_html('<span style="color: green;">◉ Current</span>')
        return format_html('<span style="color: gray;">◯ Past</span>')
    current_status.short_description = "Status"

    def company_logo_preview(self, obj):
        if obj.company_logo:
            return format_html(
                '<img src="{}" width="40" height="40" style="object-fit: contain;" />',
                obj.company_logo.url
            )
        return "No logo"
    company_logo_preview.short_description = "Logo"


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'institution', 'field', 'category', 'end_date', 'order']
    list_filter = ['category', 'end_date', 'field']
    search_fields = ['institution', 'degree', 'field']
    fieldsets = (
        ('Education Details', {
            'fields': ('institution', 'degree', 'field', 'category', 'description')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Display', {
            'fields': ('order',)
        }),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'photo_preview', 'rating', 'order']
    list_filter = ['rating', 'created_at']
    search_fields = ['name', 'role', 'message']

    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius: 50%; object-fit: cover;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'received_date', 'is_read_display']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']

    def received_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M')
    received_date.short_description = "Received"

    def is_read_display(self, obj):
        if obj.is_read:
            return format_html('<span style="color: gray;">✓ Read</span>')
        return format_html('<span style="color: blue; font-weight: bold;">● Unread</span>')
    is_read_display.short_description = "Status"

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected as unread"
