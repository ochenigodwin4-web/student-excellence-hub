# Student Excellence Hub - Complete Setup Guide

## 🚀 Project Overview

Student Excellence Hub is a comprehensive platform designed to help students improve their academic skills and social development through:

- **📚 Comprehensive Learning Resources** - Curated courses and study materials
- **🤝 Social Skills Development** - Communication, leadership, and teamwork programs
- **📊 Progress Tracking** - Detailed analytics and performance monitoring
- **👥 Community Forum** - Connect with peers and share experiences
- **🎯 Goal Setting Tools** - Track academic and personal goals
- **🏆 Gamification System** - Earn points, badges, and climb leaderboards

## 📋 Tech Stack

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Token-based

### Frontend
- **Library**: React 18
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with Tailwind-ready setup

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 14+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp ../.env.example .env
   # Edit .env with your database credentials
   ```

5. **Create PostgreSQL database**
   ```bash
   createdb student_hub_db
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > .env
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/v1/auth/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Login**
```
POST /api/v1/auth/login/
{
  "username": "john_doe",
  "password": "securepassword"
}
```

### Course Endpoints

**Get All Courses**
```
GET /api/v1/courses/
?category=academic&difficulty=beginner
```

**Enroll in Course**
```
POST /api/v1/courses/{id}/enroll/
```

**Get Course Lessons**
```
GET /api/v1/courses/{id}/lessons/
```

### Forum Endpoints

**Get Posts**
```
GET /api/v1/forum/posts/
?category=general
```

**Create Post**
```
POST /api/v1/forum/posts/
{
  "title": "Study Tips for Exam",
  "content": "Here are some effective study methods...",
  "category": "study-tips"
}
```

**Like Post**
```
POST /api/v1/forum/posts/{id}/like/
```

**Add Comment**
```
POST /api/v1/forum/posts/{id}/add_comment/
{"content": "Great post!"}
```

### Goal Endpoints

**Get Goals**
```
GET /api/v1/goals/
```

**Create Goal**
```
POST /api/v1/goals/
{
  "title": "Complete Python Course",
  "description": "Master Python programming",
  "target_date": "2024-12-31",
  "progress": 0
}
```

**Update Goal Progress**
```
POST /api/v1/goals/{id}/update_progress/
{"progress": 50}
```

## 📁 Project Structure

```
student-excellence-hub/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API viewsets
│   │   ├── urls.py            # API routes
│   │   └── ...
│   ├── student_hub/
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Main URL config
│   │   └── ...
│   ├── requirements.txt       # Python dependencies
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   ├── App.js           # Main app component
│   │   └── ...
│   ├── package.json
│   └── ...
├── .env.example              # Environment variables
└── README.md
```

## 🔐 Security Features

- Token-based authentication
- CORS configuration for cross-origin requests
- Password validation and hashing
- SQL injection protection
- CSRF protection
- Secure environment variables

## 📊 Database Models

- **UserProfile**: Extended user information with roles and points
- **Course**: Learning courses with categories and difficulty levels
- **Lesson**: Individual lessons within courses
- **Enrollment**: User course enrollment tracking
- **Achievement**: Badges and rewards system
- **ForumPost**: Discussion posts
- **ForumComment**: Comments on posts
- **Goal**: User goals and targets
- **ProgressLog**: Learning progress tracking

## 🚀 Deployment

### Backend Deployment (Heroku, AWS, DigitalOcean)

1. Set environment variables on hosting platform
2. Run migrations: `python manage.py migrate`
3. Collect static files: `python manage.py collectstatic`
4. Start server with Gunicorn or similar

### Frontend Deployment (Vercel, Netlify)

1. Build production bundle: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Set API URL in environment variables

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for educational purposes.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@studentexcellence.com

## 🎯 Future Features

- Video streaming for courses
- Real-time notifications
- Mobile app (React Native)
- AI-powered recommendations
- Peer mentoring system
- Certificate generation
- Payment integration
- Advanced analytics dashboard

---

**Made with ❤️ to help students excel**
