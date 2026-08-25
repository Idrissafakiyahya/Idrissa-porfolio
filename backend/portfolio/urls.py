from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, SkillViewSet, ProjectViewSet,
    ExperienceViewSet, EducationViewSet, TestimonialViewSet,
    ContactViewSet
)

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'visits', VisitViewSet, basename='visit')

urlpatterns = [
    path('', include(router.urls)),
]
