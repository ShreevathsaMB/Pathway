# Pathway - Mental Wellness Web Application

A comprehensive mental wellness platform built with Django (backend) and React (frontend), designed to help people dealing with depression, loneliness, family conflicts, and relationship issues find peace through daily tasks, AI companionship, community support, and personalized resources.

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure registration and login with JWT tokens
- **Daily Tasks & Streak System** - Track daily wellness activities and maintain streaks
- **Community Forums** - Topic-based communities for support and discussion
- **AI Companion** - Personalized AI chat support using Claude API
- **Resources Library** - Curated videos, articles, music, and meditation guides
- **Safety & Protection** - Emergency contacts, legal information, and safety tips
- **Multi-language Support** - Telugu, Hindi, Tamil, Kannada, Malayalam, English

### User Features
- Personalized AI companion with custom name
- Anonymous posting in communities
- Mood tracking and history
- Streak achievements
- Issue-specific content recommendations
- Profile customization

## 🛠️ Technology Stack

### Backend
- **Django 4.2.27** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (for Django auth and relational data)
- **Mongoengine** - MongoDB ODM (for flexible data)
- **Anthropic Claude API** - AI companion
- **JWT Authentication** - Secure token-based auth
- **Pillow** - Image processing

### Frontend (To be built)
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **React i18next** - Multi-language

## 📋 Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher (for frontend)
- MongoDB (local or Atlas cloud)
- Anthropic API key (for AI companion)

## 🚀 Backend Setup

### 1. Clone the Repository
```bash
cd pathway/pathway-backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Windows
.\\venv\\Scripts\\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the `pathway-backend` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# MongoDB Configuration
MONGODB_HOST=mongodb://localhost:27017/pathway
MONGODB_DB=pathway

# Anthropic API (for AI Companion)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 5. Run Migrations
```bash
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## 📡 API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `POST /api/token/refresh/` - Refresh JWT token

### User Profile
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile

### Mood Tracking
- `POST /api/users/mood/` - Log mood
- `GET /api/users/mood/history/` - Get mood history

### Streak
- `POST /api/users/streak/update/` - Update streak

### Admin
- `GET /admin/` - Django admin panel

## 🗄️ Database Models

### Users App
- **User** - Custom user model with language preference, AI companion name, issues, streak tracking
- **UserMoodLog** - Daily mood check-ins

### Tasks App
- **DailyTask** - User's daily wellness tasks
- **TaskTemplate** - Templates for generating tasks

### Community App
- **Community** - Topic-based communities
- **Post** - User posts with anonymous option
- **Comment** - Comments on posts

### AI Companion App
- **Conversation** - AI chat sessions
- **Message** - Individual messages

### Resources App
- **Resource** - Videos, articles, music, books

### Safety App
- **EmergencyContact** - Helpline numbers
- **LegalInfo** - Legal rights information
- **SafetyTip** - Safety precautions

## 🔐 Security Features

- JWT token authentication
- Password hashing
- CORS protection
- CSRF protection
- XSS prevention
- Anonymous posting option
- Secure media file handling

## 🌍 Multi-language Support

Supported languages:
- English (en)
- Telugu (te)
- Hindi (hi)
- Tamil (ta)
- Kannada (kn)
- Malayalam (ml)

## 📱 MongoDB Setup

### Option 1: Local MongoDB
1. Download and install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/pathway`

### Option 2: MongoDB Atlas (Recommended)
1. Create free account at mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP address
5. Get connection string and add to `.env`

See `MONGODB_SETUP.md` for detailed instructions.

## 🤖 AI Companion Setup

1. Get API key from Anthropic: https://console.anthropic.com/
2. Add to `.env` file: `ANTHROPIC_API_KEY=your-key-here`
3. AI will respond in user's selected language
4. Personalized with user's chosen companion name

## 📊 Admin Panel

Access Django admin at `http://localhost:8000/admin/`

Features:
- User management
- Content moderation
- Community management
- Resource management
- Safety information management

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users
python manage.py test tasks
```

## 📦 Project Structure

```
pathway-backend/
├── pathway/              # Main project settings
│   ├── settings.py      # Django configuration
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI configuration
├── users/               # User authentication & profiles
├── tasks/               # Daily tasks & streaks
├── community/           # Forums & discussions
├── ai_companion/        # AI chat functionality
├── resources/           # Content library
├── safety/              # Emergency & legal info
├── media/               # User uploads
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

## 🚧 Development Roadmap

### Phase 1: Backend (Current)
- ✅ User authentication
- ✅ Database models
- ✅ Basic API endpoints
- ⏳ Complete API views and serializers
- ⏳ AI companion integration
- ⏳ Initial data population

### Phase 2: Frontend
- ⏳ React app setup
- ⏳ Authentication pages
- ⏳ Home feed
- ⏳ Tasks interface
- ⏳ Community forums
- ⏳ AI chat interface
- ⏳ Resources library
- ⏳ Safety section

### Phase 3: Integration & Testing
- ⏳ API integration
- ⏳ Multi-language implementation
- ⏳ Testing
- ⏳ Bug fixes

### Phase 4: Deployment
- ⏳ Production configuration
- ⏳ Deployment setup
- ⏳ Performance optimization

## 🤝 Contributing

This is a mental wellness application. Please be mindful of:
- User privacy and data security
- Sensitive content moderation
- Accessibility features
- Cultural sensitivity in translations

## 📄 License

This project is for educational and wellness purposes.

## 🆘 Support

For issues or questions:
- Check the documentation
- Review API endpoints
- Contact the development team

## 🙏 Acknowledgments

Built with care to help people find peace and support during difficult times.

---

**Note**: This application is not a substitute for professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health professional.
