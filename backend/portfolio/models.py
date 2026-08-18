from django.db import models
from django.core.validators import URLValidator
from django.utils.text import slugify


class Profile(models.Model):
    """Single instance model for portfolio owner's profile - SINGLETON"""
    full_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, help_text="Job title or tagline")
    hero_bio = models.TextField(blank=True, help_text="Bio text displayed in the hero section")
    about_bio = models.TextField(blank=True, help_text="Bio text displayed in the about section")
    profile_photo = models.ImageField(upload_to='profile/', blank=True, null=True)
    resume_file = models.FileField(upload_to='documents/', blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def save(self, *args, **kwargs):
        """Ensure only one Profile instance exists"""
        if self.pk is None:
            # New instance - set pk to 1 (singleton)
            self.pk = 1
        elif self.pk != 1:
            # Prevent creating new profiles with different IDs
            raise ValueError("Only one Profile instance (pk=1) is allowed")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Prevent deleting the profile - it's a singleton"""
        raise ValueError("Cannot delete the Profile. It's a required singleton.")

    def __str__(self):
        return self.full_name


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('data_science', 'Data Science'),
        ('ml_ai', 'Machine Learning & AI'),
        ('web_development', 'Web Development'),
        ('databases', 'Databases'),
        ('tools_platforms', 'Tools & Platforms'),
        ('cloud', 'Cloud'),
        ('social', 'Social'),
    ]

    PROFICIENCY_CHOICES = [
        (1, 'Beginner'),
        (2, 'Intermediate'),
        (3, 'Advanced'),
        (4, 'Expert'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(choices=PROFICIENCY_CHOICES, default=2)
    icon = models.ImageField(upload_to='skill_icons/', blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'category', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('data_analysis', 'Data Analysis'),
        ('machine_learning', 'Machine Learning'),
        ('deep_learning', 'Deep Learning'),
        ('ai_agent', 'AI Agent'),
        ('web_development', 'Web Development'),
        ('competitions', 'Competitions & Hackathons'),
        ('environmental', 'Environmental Project'),
    ]

    PROVIDER_CHOICES = [
        ('zindi', 'Zindi'),
        ('kaggle', 'Kaggle'),
        ('driven_data', 'Driven Data'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='web_development')
    competition_provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, blank=True, null=True, help_text="Provider for Competitions & Hackathons category")
    short_description = models.CharField(max_length=500)
    description = models.TextField(help_text="Full project description, can include HTML")
    cover_image = models.ImageField(upload_to='projects/covers/')
    tech_stack = models.CharField(max_length=500, help_text="Comma-separated list of technologies")
    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', 'category', 'order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    """Gallery images for projects"""
    project = models.ForeignKey(Project, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.title} - Gallery Image"


class Experience(models.Model):
    CATEGORY_CHOICES = [
        ('volunteer', 'Volunteer'),
        ('employed', 'Employed'),
        ('field_training', 'Field Training'),
    ]

    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='employed')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text="Leave blank for 'Present'")
    description = models.TextField()
    company_logo = models.ImageField(upload_to='companies/', blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"

    @property
    def is_current(self):
        return self.end_date is None


class Education(models.Model):
    CATEGORY_CHOICES = [
        ('education', 'Education'),
        ('certificates', 'Certificates'),
        ('event', 'Event'),
    ]

    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='education')
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-end_date']

    def __str__(self):
        return f"{self.degree} from {self.institution}"


class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, help_text="e.g., CEO at Company X")
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    message = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Testimonial from {self.name}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
