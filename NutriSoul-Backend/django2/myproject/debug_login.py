import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

email = 'abc@gmail.com'
password = 'Password123!'

user = User.objects.filter(email=email).first()
if user:
    print(f"User found: {user.email}")
    is_correct = user.check_password(password)
    print(f"Password check: {is_correct}")
else:
    print(f"User {email} not found.")

# Try hitting the API locally
try:
    response = requests.post('http://localhost:8000/api/login/', json={'email': email, 'password': password})
    print(f"API Response Status: {response.status_code}")
    print(f"API Response Body: {response.json()}")
except Exception as e:
    print(f"API Request failed: {e}")
