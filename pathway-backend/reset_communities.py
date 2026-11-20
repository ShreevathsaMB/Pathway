"""
Nuclear reset: wipe ALL communities and re-seed exactly 6 canonical ones.
Posts will be reassigned to the new canonical communities or deleted.
Usage: .\\venv\\Scripts\\python.exe reset_communities.py
"""
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

from community.models import Community, Post

# Delete ALL existing communities (cascade deletes posts too, so save them first)
print(f"Current communities: {Community.objects.count()}")
print(f"Current posts: {Post.objects.count()}")

# Save posts to reassign later
all_posts = list(Post.objects.all().values('id', 'title', 'community_id'))

# Wipe all
Community.objects.all().delete()
print("All communities deleted.")

# Re-seed exactly 6
CANONICAL = [
    {'slug': 'family-conflicts',     'name': 'Family Conflicts',          'icon': '🏠', 'description': 'Navigating difficult family dynamics and communication issues.'},
    {'slug': 'career-purpose',       'name': 'Career & Life Purpose',     'icon': '🎯', 'description': 'Finding meaning in your professional life and personal growth.'},
    {'slug': 'relationship-issues',  'name': 'Relationship Issues',       'icon': '❤️', 'description': 'Building healthier connections with partners and friends.'},
    {'slug': 'depression-loneliness','name': 'Depression & Loneliness',   'icon': '🫂', 'description': 'Find support and understanding in difficult times.'},
    {'slug': 'success-stories',      'name': 'Success Stories',           'icon': '✨', 'description': 'Celebrate your wins and inspire others with your journey.'},
    {'slug': 'safety-protection',    'name': 'Safety & Protection',       'icon': '🛡️', 'description': 'Legal advice and safety tips for challenging situations.'},
]

created = []
for data in CANONICAL:
    c = Community.objects.create(
        slug=data['slug'],
        name=data['name'],
        icon=data['icon'],
        description=data['description'],
        member_count=0,
    )
    created.append(c)
    print(f"Created: {data['name']} (id={c.id})")

print(f"\n✅ Done! {Community.objects.count()} communities in DB:")
for c in Community.objects.all().order_by('slug'):
    print(f"  [{c.id}] {c.icon} {c.name} — {c.posts.count()} posts")
