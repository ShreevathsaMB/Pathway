import os
from django.core.management.base import BaseCommand
from community.models import Community
from tasks.models import TaskTemplate
from safety.models import EmergencyContact, LegalInfo, SafetyTip
from resources.models import Resource

class Command(BaseCommand):
    help = 'Populate initial data for Pathway'

    def handle(self, *args, **options):
        self.stdout.write('Populating initial data...')

        # 1. Communities
        communities = [
            {'slug': 'family_conflicts', 'name': 'Family Conflicts', 'description': 'Discuss and find peace in family-related issues.', 'icon': '👨‍👩‍👧‍👦'},
            {'slug': 'intercaste_marriage', 'name': 'Intercaste Marriage', 'description': 'Support for couples and families dealing with intercaste marriage challenges.', 'icon': '💑'},
            {'slug': 'career', 'name': 'Career & Life Purpose', 'description': 'Finding your path in work and life.', 'icon': '💼'},
            {'slug': 'relationship', 'name': 'Relationship Issues', 'description': 'Navigating the complexities of modern and traditional relationships.', 'icon': '💔'},
            {'slug': 'property_dispute', 'name': 'Property Disputes', 'description': 'Advice and support for family property challenges.', 'icon': '🏡'},
            {'slug': 'depression', 'name': 'Depression & Loneliness', 'description': 'A safe space to share and find support for mental health.', 'icon': '🌧️'},
            {'slug': 'safety', 'name': 'Safety & Protection', 'description': 'Information and support for personal safety.', 'icon': '🛡️'},
            {'slug': 'success_stories', 'name': 'Success Stories', 'description': 'Read and share journeys of overcoming challenges.', 'icon': '🌟'},
        ]

        for comm_data in communities:
            Community.objects.get_or_create(slug=comm_data['slug'], defaults=comm_data)

        # 2. Task Templates
        task_templates = [
            {'task_type': 'reading', 'title': 'Morning Reading', 'description': 'Read Bhagavad Gita - Chapter 2, Verse 47', 'language': 'en'},
            {'task_type': 'meditation', 'title': 'Meditation', 'description': '5 minutes of mindful breathing exercise.', 'language': 'en'},
            {'task_type': 'music', 'title': 'Calming Music', 'description': 'Listen to calming flute or nature sounds for 10 minutes.', 'language': 'en'},
            {'task_type': 'reflection', 'title': 'Evening Reflection', 'description': 'Write down three things you are grateful for today.', 'language': 'en'},
        ]

        for template_data in task_templates:
            TaskTemplate.objects.get_or_create(
                task_type=template_data['task_type'], 
                title=template_data['title'], 
                language=template_data['language'],
                defaults=template_data
            )

        # 3. Emergency Contacts
        emergency_contacts = [
            {'name': 'Women Helpline', 'number': '181', 'description': 'All India helpline for women in distress.'},
            {'name': 'Childline', 'number': '1098', 'description': 'National 24-hour emergency phone service for children.'},
            {'name': 'Police', 'number': '100', 'description': 'General police emergency assistance.'},
            {'name': 'Cyber Crime', 'number': '1930', 'description': 'National helpline for reporting cyber crimes.'},
        ]

        for contact_data in emergency_contacts:
            EmergencyContact.objects.get_or_create(number=contact_data['number'], defaults=contact_data)

        # 4. Legal Info
        legal_infos = [
            {'title': 'Protection Against Harassment', 'section_code': 'Section 354 IPC', 'description': 'Assault or criminal force to woman with intent to outrage her modesty.', 'category': 'harassment'},
            {'title': 'Child Protection', 'section_code': 'POCSO Act', 'description': 'Comprehensive law to provide for the protection of children from the offences of sexual assault.', 'category': 'child_protection'},
        ]

        for legal_data in legal_infos:
            LegalInfo.objects.get_or_create(section_code=legal_data['section_code'], defaults=legal_data)

        self.stdout.write(self.style.SUCCESS('Successfully populated initial data!'))
