import os
import django
from django.db.models import Count

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

print("All Users in Database:")
print("-" * 50)
for u in User.objects.all():
    print(f"ID: {u.id:3} | Email: '{u.email:30}' | Username: '{u.username:30}' | Active: {u.is_active}")
print("-" * 50)

# Check for potential issues
print("\nChecking for case-insensitive email duplicates:")
emails = [u.email.lower() for u in User.objects.all()]
seen = set()
dupes = set()
for e in emails:
    if e in seen:
        dupes.add(e)
    seen.add(e)

if dupes:
    for d in dupes:
        print(f"Potential Duplicate (case-insensitive): {d}")
else:
    print("No case-insensitive email duplicates found.")

print("\nChecking for trailing/leading spaces:")
for u in User.objects.all():
    if u.email != u.email.strip():
        print(f"User {u.id} has spaces in email: '{u.email}'")
    if u.username != u.username.strip():
        print(f"User {u.id} has spaces in username: '{u.username}'")
