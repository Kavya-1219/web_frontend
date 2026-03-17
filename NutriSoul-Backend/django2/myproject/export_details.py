import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from user.models import FoodItem

with open('food_details.txt', 'w') as f:
    f.write("Detailed Macro Info:\n")
    f.write("-" * 80 + "\n")
    for item in FoodItem.objects.all().order_by('name'):
        if item.name.lower() in ['apple', 'banana', 'orange', 'pizza', 'rice']:
            f.write(f"ID: {item.id:3} | Name: {item.name:15} | Cal: {item.calories_per_100g:6} | P: {item.protein_per_100g:5} | C: {item.carbs_per_100g:5} | F: {item.fats_per_100g:5}\n")
    f.write("-" * 80 + "\n")
