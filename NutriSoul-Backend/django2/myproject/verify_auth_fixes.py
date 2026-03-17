import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User
from django.test import Client

def cleanup():
    User.objects.filter(email__iexact='test_case_insensitive@example.com').delete()

def post_json(client, url, data):
    return client.post(url, data=json.dumps(data), content_type='application/json')

def run_tests():
    cleanup()
    c = Client()

    print("--- Testing Registration ---")
    email = "  TeSt_CaSe_InSeNsItIvE@example.com  "
    password = "Password123!"
    
    # 1. Register with uppercase and spaces
    res = post_json(c, '/api/register/', {
        'email': email,
        'username': email,
        'password': password,
        'confirm_password': password
    })
    
    if res.status_code == 201:
        print("[PASS] Registration successful")
    else:
        print(f"[FAIL] Registration failed: {res.content}")
        return

    # 2. Register again should fail
    res2 = post_json(c, '/api/register/', {
        'email': 'test_case_insensitive@example.com',
        'username': 'test_case_insensitive@example.com',
        'password': password,
        'confirm_password': password
    })
    if res2.status_code == 400:
        print("[PASS] Duplicate registration caught (case-insensitive)")
    else:
        print(f"[FAIL] Duplicate registration NOT caught: {res.content}")
        
    print("\n--- Testing Login ---")
    # 3. Login with lowercase and spaces
    login_email = " test_case_insensitive@example.com "
    res3 = post_json(c, '/api/login/', {
        'email': login_email,
        'password': password
    })
    if res3.status_code == 200:
        print("[PASS] Login successful with lowercase and spaces")
    else:
        print(f"[FAIL] Login failed: {res3.content}")

    # 4. Login with uppercase
    login_email2 = "TEST_CASE_INSENSITIVE@EXAMPLE.COM"
    res4 = post_json(c, '/api/login/', {
        'email': login_email2,
        'password': password
    })
    if res4.status_code == 200:
        print("[PASS] Login successful with uppercase")
    else:
        print(f"[FAIL] Login failed: {res4.content}")

    print("\n--- Testing Forgot Password ---")
    # 5. Forgot password with lowercase
    res5 = post_json(c, '/api/forgot-password/', {
        'email': 'test_case_insensitive@example.com'
    })
    if res5.status_code == 200:
        print("[PASS] Forgot password request successful")
    else:
        print(f"[FAIL] Forgot password request failed: {res5.content}")
        
    # Get the OTP from DB
    from user.models import OTP
    otp_obj = OTP.objects.filter(email='test_case_insensitive@example.com').last()
    if otp_obj:
        print(f"   Found OTP: {otp_obj.code}")
    else:
        print("[FAIL] OTP not created")
        return

    print("\n--- Testing Reset Password ---")
    # 6. Reset password with uppercase
    new_password = "NewPassword123!"
    res6 = post_json(c, '/api/reset-password/', {
        'email': 'TEST_CASE_INSENSITIVE@EXAMPLE.COM',
        'otp': otp_obj.code,
        'password': new_password,
        'confirm_password': new_password
    })
    if res6.status_code == 200:
        print("[PASS] Reset password successful using uppercase email")
    else:
        print(f"[FAIL] Reset password failed: {res6.content}")

    # 7. Login with new password
    res7 = post_json(c, '/api/login/', {
        'email': 'TeSt_CaSe_InSeNsItIvE@example.com',
        'password': new_password
    })
    if res7.status_code == 200:
        print("[PASS] Login successful with new password")
    else:
        print(f"[FAIL] Login with new password failed: {res7.content}")
        
    cleanup()

if __name__ == "__main__":
    run_tests()
