#!/usr/bin/env python
"""
Clean up duplicate profiles and ensure only pk=1 exists (singleton pattern)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_site.settings')
django.setup()

from portfolio.models import Profile

# Get all profiles
all_profiles = Profile.objects.all().order_by('id')
print(f"Total profiles found: {all_profiles.count()}\n")

for profile in all_profiles:
    print(f"Profile ID: {profile.id} | Name: {profile.full_name} | Email: {profile.email}")

# Handle cleanup
if all_profiles.count() > 1:
    print("\n⚠️  Multiple profiles detected. Cleaning up...\n")
    
    # Find the profile with the most complete data
    best_profile = max(all_profiles, key=lambda p: len(p.full_name or ''))
    print(f"✓ Keeping profile: ID {best_profile.id} - {best_profile.full_name}\n")
    
    # Prepare the data
    profile_data = {
        'full_name': best_profile.full_name,
        'title': best_profile.title,
        'bio': best_profile.bio,
        'profile_photo': best_profile.profile_photo,
        'resume_file': best_profile.resume_file,
        'email': best_profile.email,
        'phone': best_profile.phone,
        'location': best_profile.location,
        'github_url': best_profile.github_url,
        'linkedin_url': best_profile.linkedin_url,
        'instagram_url': best_profile.instagram_url,
        'whatsapp_url': best_profile.whatsapp_url,
    }
    
    # Delete all profiles
    for profile in all_profiles:
        print(f"✗ Deleting profile ID: {profile.id}")
        profile.delete()
    
    # Create single profile with pk=1
    new_profile = Profile.objects.create(pk=1, **profile_data)
    print(f"\n✓ Created singleton profile: ID {new_profile.id} - {new_profile.full_name}\n")

else:
    print("\n✓ Only one profile exists - no cleanup needed")

# Verify final state
final_count = Profile.objects.count()
final_profile = Profile.objects.first()

print("=" * 60)
print("FINAL STATE:")
print("=" * 60)
print(f"Total profiles: {final_count}")
if final_profile:
    print(f"Profile ID: {final_profile.id}")
    print(f"Name: {final_profile.full_name}")
    print(f"Email: {final_profile.email}")
    print(f"Location: {final_profile.location}")
    print("=" * 60)
    if final_profile.id == 1 and final_count == 1:
        print("✓ SUCCESS: Singleton profile enforced!")
    else:
        print("⚠️  WARNING: Profile not properly configured")
else:
    print("⚠️  ERROR: No profile found!")
