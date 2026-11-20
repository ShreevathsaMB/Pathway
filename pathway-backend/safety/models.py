from django.db import models


class EmergencyContact(models.Model):
    """
    Emergency helpline numbers.
    """
    name = models.CharField(max_length=200)
    number = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    country_code = models.CharField(max_length=2, default='IN')
    
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pathway_emergency_contacts'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.number}"


class LegalInfo(models.Model):
    """
    Legal information and rights.
    """
    title = models.CharField(max_length=300)
    section_code = models.CharField(max_length=100)  # e.g., "Section 354 IPC"
    description = models.TextField()
    
    CATEGORY_CHOICES = [
        ('harassment', 'Harassment'),
        ('domestic_violence', 'Domestic Violence'),
        ('child_protection', 'Child Protection'),
        ('cyber_crime', 'Cyber Crime'),
        ('property_rights', 'Property Rights'),
        ('general', 'General'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    country_code = models.CharField(max_length=2, default='IN')
    language = models.CharField(max_length=2, default='en')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_legal_info'
        ordering = ['category', 'section_code']
    
    def __str__(self):
        return f"{self.section_code} - {self.title}"


class SafetyTip(models.Model):
    """
    Safety tips and precautionary measures.
    """
    title = models.CharField(max_length=300)
    content = models.TextField()
    
    CATEGORY_CHOICES = [
        ('online_safety', 'Online Safety'),
        ('personal_safety', 'Personal Safety'),
        ('red_flags', 'Red Flags'),
        ('evidence_collection', 'Evidence Collection'),
        ('reporting', 'How to Report'),
        ('general', 'General'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    language = models.CharField(max_length=2, default='en')
    display_order = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_safety_tips'
        ordering = ['display_order', 'title']
    
    def __str__(self):
        return self.title
