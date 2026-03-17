import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

user = User.objects.filter(email='abc@gmail.com').first()
if user:
    user.set_password('Password123!')
    user.save()
    print(f"Successfully reset password for {user.email} to 'Password123!'")
else:
    print("User abc@gmail.com not found.")
