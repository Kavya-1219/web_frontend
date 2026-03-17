import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

def audit_users():
    print("--- User Audit ---")
    users = User.objects.all()
    print(f"Total Users: {len(users)}")
    
    for user in users:
        print(f"ID: {user.id}")
        print(f"  Username: '{user.username}'")
        print(f"  Email:    '{user.email}'")
        
        # Check for whitespace
        if user.email != user.email.strip():
            print(f"  WARNING: Email has leading/trailing whitespace!")
        if user.username != user.username.strip():
            print(f"  WARNING: Username has leading/trailing whitespace!")
            
        # Check password (generic check)
        print(f"  Has usable password: {user.has_usable_password()}")
    
    print("\n--- Potential Conflicts ---")
    emails = {}
    for user in users:
        lower_email = user.email.lower().strip()
        if lower_email in emails:
            emails[lower_email].append(user.email)
        else:
            emails[lower_email] = [user.email]
            
    for lower_email, original_emails in emails.items():
        if len(original_emails) > 1:
            print(f"Conflict: Multiple users for normalized email '{lower_email}': {original_emails}")

if __name__ == "__main__":
    audit_users()
