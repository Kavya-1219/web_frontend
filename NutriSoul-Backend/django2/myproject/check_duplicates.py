import os
import django
from django.db.models import Count

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

duplicates = User.objects.values('email').annotate(email_count=Count('email')).filter(email_count__gt=1)
print(f"Duplicates found: {len(duplicates)}")
for d in duplicates:
    email = d['email']
    ids = [u.id for u in User.objects.filter(email=email)]
    print(f"Email: {email}, Count: {d['email_count']}, IDs: {ids}")

# Also check for users with similar emails but different casing or trailing spaces
print("\nChecking for abc@gmail.com variations:")
users = User.objects.filter(email__icontains='abc@gmail.com')
for u in users:
    print(f"ID: {u.id}, Email: '{u.email}', Username: '{u.username}', HasPassword: {u.has_usable_password()}")
