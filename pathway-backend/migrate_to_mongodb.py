"""
Data Migration Script: SQLite to MongoDB
Migrates existing data from SQLite to MongoDB
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

from community.models import Community as DjangoCommunity, Post as DjangoPost, Comment as DjangoComment
from community.mongo_models import Community, Post, Comment
from tasks.models import Task as DjangoTask
from tasks.mongo_models import Task
from ai_companion.models import Conversation as DjangoConversation
from ai_companion.mongo_models import Conversation, Message
from django.core.files.storage import default_storage


def clear_mongodb():
    """Clear all MongoDB collections"""
    print("\n🗑️  Clearing MongoDB collections...")
    Community.objects.delete()
    Post.objects.delete()
    Comment.objects.delete()
    Task.objects.delete()
    Conversation.objects.delete()
    print("✓ MongoDB cleared")


def migrate_communities():
    """Migrate communities from SQLite to MongoDB"""
    print("\n📦 Migrating communities...")
    count = 0
    
    for dc in DjangoCommunity.objects.all():
        Community(
            slug=dc.slug,
            name=dc.name,
            description=dc.description,
            icon=dc.icon,
            member_count=dc.member_count,
            created_at=dc.created_at,
            updated_at=dc.updated_at
        ).save()
        count += 1
        print(f"  ✓ {dc.name}")
    
    print(f"✓ Migrated {count} communities")
    return count


def migrate_posts():
    """Migrate posts from SQLite to MongoDB"""
    print("\n📝 Migrating posts...")
    count = 0
    
    for dp in DjangoPost.objects.all():
        try:
            # Get MongoDB community
            community = Community.objects.get(slug=dp.community.slug)
            
            # Create post
            post = Post(
                community=community,
                author_id=dp.author.id if dp.author else 0,
                title=dp.title,
                content=dp.content,
                is_anonymous=dp.is_anonymous,
                upvotes=dp.upvotes,
                upvoted_by=list(dp.upvoted_by.values_list('id', flat=True)),
                created_at=dp.created_at,
                updated_at=dp.updated_at
            )
            
            # Handle media files
            if dp.image:
                post.image_url = dp.image.url
            if dp.video:
                post.video_url = dp.video.url
            
            post.save()
            count += 1
            print(f"  ✓ {dp.title[:50]}...")
            
        except Exception as e:
            print(f"  ✗ Error migrating post '{dp.title}': {e}")
    
    print(f"✓ Migrated {count} posts")
    return count


def migrate_comments():
    """Migrate comments from SQLite to MongoDB"""
    print("\n💬 Migrating comments...")
    count = 0
    
    for dc in DjangoComment.objects.all():
        try:
            # Find corresponding MongoDB post
            django_post = dc.post
            mongo_post = Post.objects.get(
                title=django_post.title,
                author_id=django_post.author.id if django_post.author else 0
            )
            
            Comment(
                post=mongo_post,
                author_id=dc.author.id if dc.author else 0,
                content=dc.content,
                is_anonymous=dc.is_anonymous,
                created_at=dc.created_at,
                updated_at=dc.updated_at
            ).save()
            count += 1
            
        except Exception as e:
            print(f"  ✗ Error migrating comment: {e}")
    
    print(f"✓ Migrated {count} comments")
    return count


def migrate_tasks():
    """Migrate tasks from SQLite to MongoDB"""
    print("\n✅ Migrating tasks...")
    count = 0
    
    for dt in DjangoTask.objects.all():
        Task(
            user_id=dt.user.id,
            title=dt.title,
            description=dt.description,
            category=dt.category,
            is_completed=dt.is_completed,
            completed_at=dt.completed_at,
            created_at=dt.created_at,
            date=dt.date
        ).save()
        count += 1
    
    print(f"✓ Migrated {count} tasks")
    return count


def migrate_conversations():
    """Migrate AI conversations from SQLite to MongoDB"""
    print("\n💭 Migrating AI conversations...")
    count = 0
    
    for dconv in DjangoConversation.objects.all():
        # Create conversation
        conv = Conversation(
            user_id=dconv.user.id,
            companion_name=dconv.companion_name,
            language=dconv.language,
            created_at=dconv.created_at,
            updated_at=dconv.updated_at
        )
        
        # Migrate messages
        for dmsg in dconv.messages.all():
            conv.messages.append(Message(
                role=dmsg.role,
                content=dmsg.content,
                created_at=dmsg.created_at
            ))
        
        conv.save()
        count += 1
    
    print(f"✓ Migrated {count} conversations")
    return count


def verify_migration():
    """Verify migration results"""
    print("\n" + "=" * 60)
    print("📊 Migration Summary")
    print("=" * 60)
    
    print(f"\nMongoDB Collections:")
    print(f"  Communities:   {Community.objects.count()}")
    print(f"  Posts:         {Post.objects.count()}")
    print(f"  Comments:      {Comment.objects.count()}")
    print(f"  Tasks:         {Task.objects.count()}")
    print(f"  Conversations: {Conversation.objects.count()}")
    
    print(f"\nSQLite Tables (original):")
    print(f"  Communities:   {DjangoCommunity.objects.count()}")
    print(f"  Posts:         {DjangoPost.objects.count()}")
    print(f"  Comments:      {DjangoComment.objects.count()}")
    print(f"  Tasks:         {DjangoTask.objects.count()}")
    print(f"  Conversations: {DjangoConversation.objects.count()}")
    
    print("\n" + "=" * 60)
    print("✓ Migration Complete!")
    print("=" * 60)
    print("\n📍 Next Steps:")
    print("  1. Open MongoDB Compass")
    print("  2. Connect to: mongodb://localhost:27017/pathway")
    print("  3. View your data in the collections")
    print("\n")


def main():
    print("=" * 60)
    print("MongoDB Migration Script")
    print("SQLite → MongoDB Data Migration")
    print("=" * 60)
    
    try:
        # Ask for confirmation
        response = input("\n⚠️  This will clear existing MongoDB data. Continue? (yes/no): ")
        if response.lower() != 'yes':
            print("Migration cancelled.")
            return
        
        # Clear MongoDB
        clear_mongodb()
        
        # Run migrations
        migrate_communities()
        migrate_posts()
        migrate_comments()
        migrate_tasks()
        migrate_conversations()
        
        # Verify
        verify_migration()
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
