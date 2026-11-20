"""
Run this script to remove duplicate communities from the database.
Usage: python fix_communities.py
"""
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

from community.models import Community

# The canonical 6 communities we want
CANONICAL = [
    {'slug': 'family-conflicts',    'name': 'Family Conflicts',         'icon': '🏠', 'description': 'Navigating difficult family dynamics and communication issues.'},
    {'slug': 'career-purpose',      'name': 'Career & Life Purpose',    'icon': '🎯', 'description': 'Finding meaning in your professional life and personal growth.'},
    {'slug': 'relationship-issues', 'name': 'Relationship Issues',      'icon': '❤️', 'description': 'Building healthier connections with partners and friends.'},
    {'slug': 'depression-loneliness','name': 'Depression & Loneliness', 'icon': '🫂', 'description': 'Find support and understanding in difficult times.'},
    {'slug': 'success-stories',     'name': 'Success Stories',          'icon': '✨', 'description': 'Celebrate your wins and inspire others with your journey.'},
    {'slug': 'safety-protection',   'name': 'Safety & Protection',      'icon': '🛡️', 'description': 'Legal advice and safety tips for challenging situations.'},
]

# Step 1: Keep only canonical slugs, delete others
canonical_slugs = [c['slug'] for c in CANONICAL]
deleted, _ = Community.objects.exclude(slug__in=canonical_slugs).delete()
print(f"Deleted {deleted} non-canonical communities.")

# Step 2: Ensure all canonical communities exist
for data in CANONICAL:
    obj, created = Community.objects.get_or_create(
        slug=data['slug'],
        defaults={'name': data['name'], 'icon': data['icon'], 'description': data['description'], 'member_count': 0}
    )
    if not created:
        # Update name/icon/description to canonical values
        obj.name = data['name']
        obj.icon = data['icon']
        obj.description = data['description']
        obj.save()
    print(f"{'Created' if created else 'Updated'}: {data['name']}")

print("\nAll done! Communities:")
for c in Community.objects.all().order_by('slug'):
    print(f"  [{c.slug}] {c.name} — {c.posts.count()} posts")
