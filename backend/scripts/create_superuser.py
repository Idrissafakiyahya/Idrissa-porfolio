from django.contrib.auth import get_user_model
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_site.settings')
django.setup()

User = get_user_model()
username = 'admin'
email = 'admin@example.com'
password = 'AdminPass123!'

qs = User.objects.filter(username=username)
if qs.exists():
    u = qs.first()
    u.email = email
    u.is_superuser = True
    u.is_staff = True
    u.set_password(password)
    u.save()
    print('UPDATED_SUPERUSER', username)
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print('CREATED_SUPERUSER', username)
