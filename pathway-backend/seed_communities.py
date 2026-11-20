import os
import django
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

from community.models import Community

def seed():
    communities = [
        {
            'slug': 'family-conflicts',
            'name': 'Family Conflicts',
            'description': 'Navigating difficult family dynamics and communication issues.',
            'icon': '🏠',
            'member_count': 120
        },
        {
            'slug': 'career-purpose',
            'name': 'Career & Life Purpose',
            'description': 'Finding meaning in your professional life and personal growth.',
            'icon': '🎯',
            'member_count': 250
        },
        {
            'slug': 'relationship-issues',
            'name': 'Relationship Issues',
            'description': 'Building healthier connections with partners and friends.',
            'icon': '❤️',
            'member_count': 180
        },
        {
            'slug': 'depression-loneliness',
            'name': 'Depression & Loneliness',
            'description': 'Find support and understanding in difficult times.',
            'icon': '🫂',
            'member_count': 320
        },
        {
            'slug': 'success-stories',
            'name': 'Success Stories',
            'description': 'Celebrate your wins and inspire others with your journey.',
            'icon': '✨',
            'member_count': 150
        },
        {
            'slug': 'safety-protection',
            'name': 'Safety & Protection',
            'description': 'Legal advice and safety tips for challenging situations.',
            'icon': '🛡️',
            'member_count': 95
        }
    ]

    for comm_data in communities:
        Community.objects.update_or_create(
            slug=comm_data['slug'],
            defaults=comm_data
        )
        print(f"Seeded: {comm_data['name']}")

if __name__ == '__main__':
    seed()
