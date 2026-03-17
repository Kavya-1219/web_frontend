import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

print("--- START USER LIST ---")
users = User.objects.all()
if not users:
    print("NO USERS FOUND")
for u in users:
    print(f"ID: {u.id}")
    print(f"Username: '{u.username}'")
    print(f"Email: '{u.email}'")
    print(f"Is Active: {u.is_active}")
    print(f"Password Hash: {u.password[:20]}...")
    print("-" * 20)
print("--- END USER LIST ---")
