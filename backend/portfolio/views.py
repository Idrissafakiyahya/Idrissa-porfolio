from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    Profile, Skill, Project, Experience, 
    Education, Testimonial, ContactMessage
)
from .serializers import (
    ProfileSerializer, SkillSerializer, ProjectSerializer,
    ExperienceSerializer, EducationSerializer, TestimonialSerializer,
    ContactMessageSerializer
)
from .models import Visit
from .serializers import VisitSerializer


class ContactThrottle(AnonRateThrottle):
    """Rate limit contact form submissions to 5 per hour per IP"""
    scope = 'contact'
    THROTTLE_RATES = {'contact': '5/hour'}


class ProfileViewSet(viewsets.ModelViewSet):
    """Endpoint for portfolio owner's profile (singleton pattern)"""
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    throttle_classes = []

    def get_object(self):
        """Return the single Profile instance (pk=1)"""
        obj, created = Profile.objects.get_or_create(pk=1)
        return obj

    def list(self, request, *args, **kwargs):
        """Return the single profile instance"""
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve the single profile instance"""
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update the single profile instance"""
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """Override create to ensure only pk=1 profile exists"""
        obj = self.get_object()
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Endpoint to get the profile"""
        obj = self.get_object()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for skills"""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    throttle_classes = []

    def get_queryset(self):
        queryset = Skill.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for projects with category filtering"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    throttle_classes = []

    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)

        if category:
            queryset = queryset.filter(category=category)
        if featured and featured.lower() in ('true', '1', 'yes'):
            queryset = queryset.filter(featured=True)

        return queryset


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for work experience with category filtering"""
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    throttle_classes = []

    def get_queryset(self):
        queryset = Experience.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for education with category filtering"""
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    throttle_classes = []

    def get_queryset(self):
        queryset = Education.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for testimonials"""
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    throttle_classes = []


class ContactViewSet(viewsets.ViewSet):
    """Endpoint for submitting contact messages"""
    throttle_classes = [ContactThrottle]

    @action(detail=False, methods=['post'], throttle_classes=[ContactThrottle])
    def create_message(self, request):
        """Create a contact message and send email notification"""
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            contact_message = serializer.save()
            self._send_notification_email(contact_message)
            return Response(
                {
                    'status': 'success',
                    'message': 'Your message has been received. We will get back to you soon.',
                    'id': contact_message.id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                'status': 'error',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def _send_notification_email(self, contact_message):
        """Send email notification for new contact message"""
        try:
            subject = f"New Contact Message: {contact_message.subject}"
            message = f"""
New contact message received:

Name: {contact_message.name}
Email: {contact_message.email}
Subject: {contact_message.subject}

Message:
{contact_message.message}

---
Received at: {contact_message.created_at}
            """
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL_RECIPIENT],
                fail_silently=True,
            )
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error sending email: {e}")


class VisitViewSet(viewsets.ModelViewSet):
    """Simple endpoint to record visits and return basic stats"""
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    http_method_names = ['get', 'post', 'head']

    def create(self, request, *args, **kwargs):
        path = request.data.get('path', request.META.get('PATH_INFO', '/'))
        ua = request.META.get('HTTP_USER_AGENT', '')
        visit = Visit.objects.create(path=path[:255], user_agent=ua[:512])
        serializer = self.get_serializer(visit)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Return simple aggregated counts: last 7 days, 30 days, 365 days"""
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        year_ago = now - timedelta(days=365)

        week_count = Visit.objects.filter(created_at__gte=week_ago).count()
        month_count = Visit.objects.filter(created_at__gte=month_ago).count()
        year_count = Visit.objects.filter(created_at__gte=year_ago).count()

        return Response({
            'week': week_count,
            'month': month_count,
            'year': year_count,
        })
