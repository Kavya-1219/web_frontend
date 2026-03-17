import os
import django
import sys

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()
from django.contrib.auth.models import User
from django.db.models.functions import Lower

def check():
    print("Detailed User Audit")
    print("=" * 100)
    users = User.objects.all().order_by('id')
    print(f"Total Users: {users.count()}")
    
    for u in users:
        print(f"ID: {u.id:3} | U: {repr(u.username):40} | E: {repr(u.email):40} | Active: {u.is_active}")
        
        # Checks
        if u.username != u.email:
             print(f"  [!] MISMATCH: Username != Email")
        if u.email and u.email != u.email.strip():
             print(f"  [!] WHITESPACE: Email has leading/trailing spaces")
        if u.username != u.username.strip():
             print(f"  [!] WHITESPACE: Username has leading/trailing spaces")
        
        # Check for case duplicates
        if u.email:
            other_u = User.objects.annotate(email_lower=Lower('email')).filter(email_lower=u.email.lower()).exclude(id=u.id)
            if other_u.exists():
                print(f"  [!] CASE DUPE: Another user has same email (case-insensitive): {[ou.id for ou in other_u]}")

    print("=" * 100)
    print("End of Audit")

if __name__ == "__main__":
    check()
