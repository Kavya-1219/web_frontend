import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from user.serializers import LoginSerializer
from django.contrib.auth.models import User

def test_login(email, password):
    print(f"\nTesting login for: '{email}'")
    data = {'email': email, 'password': password}
    serializer = LoginSerializer(data=data)
    try:
        if serializer.is_valid():
            print("SUCCESS: Login valid")
            user = serializer.validated_data['user']
            print(f"User: {user.email}, ID: {user.id}")
        else:
            print(f"FAILED: {serializer.errors}")
    except Exception as e:
        print(f"EXCEPTION: {str(e)}")

# Get a user from DB to test with
user = User.objects.first()
if user:
    print(f"Found user in DB: ID={user.id}, Email='{user.email}', Username='{user.username}'")
    # Test with exact email
    test_login(user.email, "any_password") # We expect "Incorrect password" or Success
    
    # Test with stripped email if it has spaces
    if user.email != user.email.strip():
        print(f"User email has spaces!")
        test_login(user.email.strip(), "any_password")
else:
    print("No users in DB")
