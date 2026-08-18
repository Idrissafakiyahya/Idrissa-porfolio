from django.core.management.base import BaseCommand
from portfolio.models import Profile
from django.db import connection


class Command(BaseCommand):
    help = 'Clean up duplicate profiles and enforce singleton pattern (pk=1 only)'

    def handle(self, *args, **options):
        all_profiles = Profile.objects.all().order_by('id')
        count = all_profiles.count()
        
        self.stdout.write(f"\nTotal profiles found: {count}\n")
        
        for profile in all_profiles:
            self.stdout.write(f"Profile ID: {profile.id} | Name: {profile.full_name} | Email: {profile.email}")

        if count > 1:
            self.stdout.write(self.style.WARNING("\n⚠️  Multiple profiles detected. Cleaning up...\n"))
            
            # Find the profile with the most complete data
            best_profile = max(all_profiles, key=lambda p: len(p.full_name or ''))
            self.stdout.write(self.style.SUCCESS(f"✓ Keeping profile: ID {best_profile.id} - {best_profile.full_name}\n"))
            
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
            
            # Delete all profiles using raw SQL to bypass model protection
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM portfolio_profile")
            self.stdout.write(self.style.WARNING("✗ Deleted all profiles\n"))
            
            # Create single profile with pk=1
            new_profile = Profile.objects.create(pk=1, **profile_data)
            self.stdout.write(self.style.SUCCESS(f"✓ Created singleton profile: ID {new_profile.id} - {new_profile.full_name}\n"))

        else:
            self.stdout.write(self.style.SUCCESS("\n✓ Only one profile exists - no cleanup needed\n"))

        # Verify final state
        final_count = Profile.objects.count()
        final_profile = Profile.objects.first()

        self.stdout.write("=" * 60)
        self.stdout.write("FINAL STATE:")
        self.stdout.write("=" * 60)
        self.stdout.write(f"Total profiles: {final_count}")
        
        if final_profile:
            self.stdout.write(f"Profile ID: {final_profile.id}")
            self.stdout.write(f"Name: {final_profile.full_name}")
            self.stdout.write(f"Email: {final_profile.email}")
            self.stdout.write(f"Location: {final_profile.location}")
            self.stdout.write("=" * 60)
            
            if final_profile.id == 1 and final_count == 1:
                self.stdout.write(self.style.SUCCESS("✓ SUCCESS: Singleton profile enforced!"))
            else:
                self.stdout.write(self.style.ERROR("⚠️  WARNING: Profile not properly configured"))
        else:
            self.stdout.write(self.style.ERROR("⚠️  ERROR: No profile found!"))
