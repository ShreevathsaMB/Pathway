"""
Simple MongoDB Migration Script
Migrates communities and posts from SQLite to MongoDB
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

# Now import models after Django is set up
from community.models import Community as DjangoCommunity, Post as DjangoPost
from community.mongo_models import Community, Post


def migrate_communities():
    """Migrate communities from SQLite to MongoDB"""
    print("\n📦 Migrating communities...")
    
    # Clear existing
    Community.objects.delete()
    
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
    
    # Clear existing
    Post.objects.delete()
    
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


def verify_migration():
    """Verify migration results"""
    print("\n" + "=" * 60)
    print("📊 Migration Summary")
    print("=" * 60)
    
    print(f"\nMongoDB Collections:")
    print(f"  Communities:   {Community.objects.count()}")
    print(f"  Posts:         {Post.objects.count()}")
    
    print(f"\nSQLite Tables (original):")
    print(f"  Communities:   {DjangoCommunity.objects.count()}")
    print(f"  Posts:         {DjangoPost.objects.count()}")
    
    print("\n" + "=" * 60)
    print("✓ Migration Complete!")
    print("=" * 60)
    print("\n📍 Next Steps:")
    print("  1. Open MongoDB Compass")
    print("  2. Connect to: mongodb://localhost:27017/pathway")
    print("  3. View your data in 'communities' and 'posts' collections")
    print("  4. Restart Django server: venv\\Scripts\\python.exe manage.py runserver 8000")
    print("\n")


def main():
    print("=" * 60)
    print("MongoDB Migration Script")
    print("SQLite → MongoDB Data Migration")
    print("=" * 60)
    
    try:
        print("\n⚠️  This will clear existing MongoDB data and migrate from SQLite.")
        print("Press Ctrl+C to cancel, or Enter to continue...")
        input()
        
        # Run migrations
        migrate_communities()
        migrate_posts()
        
        # Verify
        verify_migration()
        
    except KeyboardInterrupt:
        print("\n\nMigration cancelled.")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
