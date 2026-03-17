import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from user.models import FoodItem

with open('food_list.txt', 'w') as f:
    for item in FoodItem.objects.all().order_by('name'):
        f.write(f"ID: {item.id} | Name: {item.name}\n")
