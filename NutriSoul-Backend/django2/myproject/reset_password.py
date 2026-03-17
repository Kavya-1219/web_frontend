import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

email = 'abc@gmail.com'
pwd = 'Password123!'

user = User.objects.filter(email=email).first()
if user:
    user.set_password(pwd)
    user.save()
    print(f"Set password for {email}")
    # Verify
    user = User.objects.get(email=email)
    print(f"Check {pwd}: {user.check_password(pwd)}")
else:
    print(f"User {email} not found")
