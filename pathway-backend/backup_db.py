"""
Database Backup Utility
Creates timestamped backups of the SQLite database
"""
import shutil
from datetime import datetime
from pathlib import Path

def backup_database():
    """Create a timestamped backup of db.sqlite3"""
    db_path = Path('db.sqlite3')
    
    if not db_path.exists():
        print("✗ Database file not found: db.sqlite3")
        return False
    
    # Create backups directory
    backup_dir = Path('backups')
    backup_dir.mkdir(exist_ok=True)
    
    # Create backup with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = backup_dir / f'db_backup_{timestamp}.sqlite3'
    
    try:
        shutil.copy2(db_path, backup_path)
        file_size = backup_path.stat().st_size / 1024  # KB
        print(f"✓ Backup created successfully!")
        print(f"  Location: {backup_path}")
        print(f"  Size: {file_size:.2f} KB")
        return True
    except Exception as e:
        print(f"✗ Backup failed: {e}")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("Database Backup Utility")
    print("=" * 50)
    print()
    backup_database()
