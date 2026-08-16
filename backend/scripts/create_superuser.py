from django.contrib.auth import get_user_model
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_site.settings')
django.setup()

# Read superuser credentials from environment variables so no secrets are committed
User = get_user_model()
username = os.environ.get('SUPERUSER_USERNAME')
email = os.environ.get('SUPERUSER_EMAIL', '')
password = os.environ.get('SUPERUSER_PASSWORD')

if not username or not password:
    print('SUPERUSER_USERNAME or SUPERUSER_PASSWORD not set; skipping create_superuser')
else:
    qs = User.objects.filter(username=username)
    if qs.exists():
        u = qs.first()
        if email:
            u.email = email
        u.is_superuser = True
        u.is_staff = True
        u.set_password(password)
        u.save()
        print('UPDATED_SUPERUSER', username)
    else:
        User.objects.create_superuser(username=username, email=email, password=password)
        print('CREATED_SUPERUSER', username)
