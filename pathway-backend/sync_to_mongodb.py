"""
MongoDB Sync Script
Syncs data from SQLite to MongoDB so you can view it in MongoDB Compass
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

from community.models import Post, Community, Comment
from users.models import User
from tasks.models import Task
from mongoengine import Document, StringField, IntField, DateTimeField, BooleanField, EmailField

# Define MongoDB Models
class MongoUser(Document):
    meta = {'collection': 'users'}
    django_id = IntField(required=True, unique=True)
    username = StringField(max_length=150)
    email = EmailField()
    first_name = StringField(max_length=150)
    last_name = StringField(max_length=150)
    streak_count = IntField(default=0)
    last_login_date = DateTimeField()
    created_at = DateTimeField()

class MongoPost(Document):
    meta = {'collection': 'posts'}
    django_id = IntField(required=True, unique=True)
    community_name = StringField(max_length=200)
    author_username = StringField(max_length=150)
    title = StringField(max_length=300)
    content = StringField()
    is_anonymous = BooleanField(default=False)
    upvotes = IntField(default=0)
    has_image = BooleanField(default=False)
    has_video = BooleanField(default=False)
    created_at = DateTimeField()

class MongoCommunity(Document):
    meta = {'collection': 'communities'}
    django_id = IntField(required=True, unique=True)
    name = StringField(max_length=200)
    slug = StringField(max_length=200)
    description = StringField()
    member_count = IntField(default=0)
    created_at = DateTimeField()

class MongoTask(Document):
    meta = {'collection': 'tasks'}
    django_id = IntField(required=True, unique=True)
    user_username = StringField(max_length=150)
    title = StringField(max_length=200)
    description = StringField()
    is_completed = BooleanField(default=False)
    completed_at = DateTimeField()
    created_at = DateTimeField()

def sync_users():
    """Sync users from SQLite to MongoDB"""
    count = 0
    for user in User.objects.all():
        MongoUser.objects(django_id=user.id).update_one(
            set__username=user.username,
            set__email=user.email,
            set__first_name=user.first_name,
            set__last_name=user.last_name,
            set__streak_count=user.streak_count,
            set__last_login_date=user.last_login_date,
            set__created_at=user.date_joined,
            upsert=True
        )
        count += 1
    print(f"✓ Synced {count} users")

def sync_communities():
    """Sync communities from SQLite to MongoDB"""
    count = 0
    for community in Community.objects.all():
        MongoCommunity.objects(django_id=community.id).update_one(
            set__name=community.name,
            set__slug=community.slug,
            set__description=community.description,
            set__member_count=community.member_count,
            set__created_at=community.created_at,
            upsert=True
        )
        count += 1
    print(f"✓ Synced {count} communities")

def sync_posts():
    """Sync posts from SQLite to MongoDB"""
    count = 0
    for post in Post.objects.all():
        MongoPost.objects(django_id=post.id).update_one(
            set__community_name=post.community.name,
            set__author_username=post.author.username if post.author and not post.is_anonymous else 'Anonymous',
            set__title=post.title,
            set__content=post.content,
            set__is_anonymous=post.is_anonymous,
            set__upvotes=post.upvotes,
            set__has_image=bool(post.image),
            set__has_video=bool(post.video),
            set__created_at=post.created_at,
            upsert=True
        )
        count += 1
    print(f"✓ Synced {count} posts")

def sync_tasks():
    """Sync tasks from SQLite to MongoDB"""
    count = 0
    for task in Task.objects.all():
        MongoTask.objects(django_id=task.id).update_one(
            set__user_username=task.user.username,
            set__title=task.title,
            set__description=task.description,
            set__is_completed=task.is_completed,
            set__completed_at=task.completed_at,
            set__created_at=task.created_at,
            upsert=True
        )
        count += 1
    print(f"✓ Synced {count} tasks")

def main():
    print("=" * 50)
    print("MongoDB Sync Script")
    print("=" * 50)
    print("\nSyncing data from SQLite to MongoDB...\n")
    
    try:
        sync_users()
        sync_communities()
        sync_posts()
        sync_tasks()
        
        print("\n" + "=" * 50)
        print("✓ Sync Complete!")
        print("=" * 50)
        print("\nYou can now view your data in MongoDB Compass:")
        print("Connection String: mongodb://localhost:27017/pathway")
        print("\nCollections:")
        print("  - users")
        print("  - communities")
        print("  - posts")
        print("  - tasks")
        
    except Exception as e:
        print(f"\n✗ Error during sync: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
