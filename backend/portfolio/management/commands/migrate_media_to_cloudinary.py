from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings

import requests
import traceback

from portfolio.models import (
    Profile, Skill, Project, ProjectImage, Experience, Testimonial
)


MODEL_FIELD_MAP = {
    'profile': (Profile, ['profile_photo', 'resume_file']),
    'skill': (Skill, ['icon']),
    'project': (Project, ['cover_image']),
    'projectimage': (ProjectImage, ['image']),
    'experience': (Experience, ['company_logo']),
    'testimonial': (Testimonial, ['photo']),
}


class Command(BaseCommand):
    help = 'Migrate media files referenced in Image/File fields to configured storage (e.g., Cloudinary) by re-uploading them.'

    def add_arguments(self, parser):
        parser.add_argument('--models', type=str, default='all', help='Comma-separated model keys to process (default: all)')
        parser.add_argument('--dry-run', action='store_true', help='Do not save changes, only report what would be done')
        parser.add_argument('--limit', type=int, default=0, help='Limit number of objects per model (0 = no limit)')

    def handle(self, *args, **options):
        if not getattr(settings, 'DEFAULT_FILE_STORAGE', None):
            self.stdout.write(self.style.WARNING('DEFAULT_FILE_STORAGE is not configured. Ensure Cloudinary storage is configured before running.'))

        models_arg = options['models']
        dry_run = options['dry_run']
        limit = options['limit']

        keys = list(MODEL_FIELD_MAP.keys()) if models_arg == 'all' else [k.strip().lower() for k in models_arg.split(',')]

        for key in keys:
            if key not in MODEL_FIELD_MAP:
                self.stdout.write(self.style.WARNING(f'Skipping unknown model key: {key}'))
                continue

            Model, fields = MODEL_FIELD_MAP[key]
            qs = Model.objects.all()
            if limit and limit > 0:
                qs = qs[:limit]

            total = qs.count() if hasattr(qs, 'count') else len(list(qs))
            self.stdout.write(self.style.NOTICE(f'Processing {total} objects for model {Model.__name__}'))

            processed = 0
            for obj in qs:
                updated = False
                for field in fields:
                    try:
                        val = getattr(obj, field)
                        # field may be a FileField or ImageField
                        if not val:
                            continue

                        url = val.url if hasattr(val, 'url') else str(val)
                        # Skip if URL is already a cloudinary URL
                        if url and ('res.cloudinary.com' in url or 'cloudinary.com' in url):
                            continue

                        # Only try to fetch http/https urls
                        if not url.startswith('http'):
                            # Maybe it's a relative path like /media/...
                            # Try to build absolute URL from settings if possible
                            base = getattr(settings, 'SITE_BASE_URL', None)
                            if base:
                                url = base.rstrip('/') + '/' + str(url).lstrip('/')
                            else:
                                # Attempt to skip if we cannot resolve absolute URL
                                self.stdout.write(self.style.WARNING(f'Cannot resolve absolute URL for {Model.__name__}.{field} on object {obj} -> {url}'))
                                continue

                        self.stdout.write(f'Fetching {url}...')
                        resp = requests.get(url, timeout=30)
                        if resp.status_code != 200:
                            self.stdout.write(self.style.WARNING(f'Failed to download {url} (status {resp.status_code})'))
                            continue

                        filename = url.split('/')[-1]
                        content = ContentFile(resp.content)

                        if dry_run:
                            self.stdout.write(self.style.SUCCESS(f'[dry-run] Would upload and replace {Model.__name__}.{field} for object id={getattr(obj, "id", "?")} -> {filename}'))
                        else:
                            # save to the field; this triggers the configured storage to store (e.g., Cloudinary)
                            getattr(obj, field).save(filename, content, save=False)
                            updated = True
                            self.stdout.write(self.style.SUCCESS(f'Uploaded and updated {Model.__name__}.{field} for object id={getattr(obj, "id", "?")} -> {filename}'))

                    except Exception:
                        self.stdout.write(self.style.ERROR(f'Error processing {Model.__name__}.{field} for object id={getattr(obj, "id", "?")}'))
                        traceback.print_exc()

                if updated and not dry_run:
                    try:
                        obj.save()
                        processed += 1
                    except Exception:
                        self.stdout.write(self.style.ERROR(f'Failed to save object {Model.__name__} id={getattr(obj, "id", "?")}'))
                        traceback.print_exc()

            self.stdout.write(self.style.NOTICE(f'Finished model {Model.__name__}. Objects updated: {processed}'))

        self.stdout.write(self.style.SUCCESS('Media migration run complete.'))
