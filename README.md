# Professional Portfolio Website

A full-stack portfolio website built with Django + React, featuring a completely editable admin panel with no hardcoded content.

## 🎯 Overview

This is a production-ready portfolio website with:
- **Backend**: Django REST Framework (DRF) API
- **Frontend**: React + Vite (modern, fast, responsive)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Media Storage**: Cloudinary (no ephemeral filesystem issues)
- **Deployment**: Render (backend) + Vercel (frontend)
- **Admin Interface**: Full Django admin panel to manage all content

## ✨ Features

### Fully Editable Backend
- ✅ Profile (personal info, bio, social links)
- ✅ Skills (with categories and proficiency levels)
- ✅ Projects (with gallery images, tech stack, links)
- ✅ Work Experience (with current status)
- ✅ Education (degree, institution, dates)
- ✅ Testimonials (with star ratings)
- ✅ Contact Messages (incoming messages from visitors)

### Modern Frontend
- ✅ Fully responsive design (mobile-first)
- ✅ Dark/Light mode toggle with persistent preference
- ✅ Smooth animations and transitions
- ✅ Skeleton loaders for loading states
- ✅ Professional color scheme and typography
- ✅ All content fetched from API at runtime

### Professional Admin
- ✅ Django admin interface (`/admin/`)
- ✅ Image previews in admin lists
- ✅ Bulk actions (mark contact messages as read)
- ✅ Search, filter, and sort on all models
- ✅ Custom display formatting

## 📁 Project Structure

```
IDRISSA PF/
├── backend/                    # Django project
│   ├── portfolio_site/        # Django settings
│   ├── portfolio/             # Main app
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API views
│   │   ├── admin.py           # Admin configuration
│   │   └── urls.py            # API routes
│   ├── fixtures/              # Sample data
│   ├── manage.py              # Django cli
│   ├── requirements.txt        # Python dependencies
│   ├── build.sh               # Render build script
│   ├── render.yaml            # Render config
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
├── frontend/                   # React project
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service
│   │   ├── styles/            # CSS modules
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite config
│   ├── package.json           # Node dependencies
│   ├── vercel.json            # Vercel config
│   ├── .env.example           # Environment template
│   └── README.md              # Frontend documentation
│
├── DEPLOYMENT.md              # Complete deployment guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend: http://localhost:8000
Admin: http://localhost:8000/admin/

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env

npm run dev
```

Frontend: http://localhost:5173

### Loading Sample Data
```bash
# In backend directory
python manage.py loaddata fixtures/initial_data.json
```

Then log into admin and edit the content to make it yours!

## 📋 API Endpoints

All endpoints are read-only (GET) except contact:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile/` | GET | Portfolio owner info |
| `/api/skills/` | GET | Skills list (filterable) |
| `/api/projects/` | GET | Projects list (filterable) |
| `/api/projects/{slug}/` | GET | Single project details |
| `/api/experience/` | GET | Work experience |
| `/api/education/` | GET | Education entries |
| `/api/testimonials/` | GET | Testimonials |
| `/api/contact/create_message/` | POST | Submit contact form |

## 🔧 Environment Variables

### Backend (.env)
```
SECRET_KEY=               # Django secret (auto-generated on deploy)
DEBUG=False              # Always False in production
ALLOWED_HOSTS=           # Comma-separated domains
DATABASE_URL=            # PostgreSQL connection
CORS_ALLOWED_ORIGINS=    # Frontend URL for CORS
CLOUDINARY_URL=          # Image storage
EMAIL_*=                 # SMTP settings
```

### Frontend (.env)
```
VITE_API_BASE_URL=       # Backend API URL
```

See `.env.example` files in each directory for full templates.

## 📸 Managing Content

### Login to Admin
1. Backend running at `http://localhost:8000`
2. Visit `http://localhost:8000/admin/`
3. Login with superuser credentials

### Add Profile
1. Go to **Profile** section
2. Edit the single profile entry (click on "Alex Johnson")
3. Update name, title, bio, photo, social links
4. Save

### Add Skills
1. Go to **Skills** section
2. Click **Add Skill**
3. Fill name, category, proficiency, icon
4. Set order for display sequence
5. Save

### Add Projects
1. Go to **Projects** section
2. Click **Add Project**
3. Fill title, slug, description, cover image
4. Add tech stack (comma-separated)
5. Add gallery images (ProjectImage section)
6. Set featured and order
7. Save

### Similar for Experience, Education, Testimonials

All changes appear immediately on frontend!

## 🎨 Design System

### Colors
- Primary: #2563eb (Blue)
- Accent: #f97316 (Orange)
- Neutrals: Gray scale
- Dark Mode: Supported

### Typography
- Headings: Segoe UI, 700 weight
- Body: Segoe UI, 400 weight
- Responsive sizing

### Spacing
- Consistent scale from 0.25rem to 4rem
- Grid-based layout

### Animations
- Smooth transitions (300ms)
- Scroll-reveal animations
- Loading skeletons

## 🚀 Deployment

Complete step-by-step deployment guide in [DEPLOYMENT.md](DEPLOYMENT.md):

1. **Cloudinary Setup** (image storage for production)
2. **Render Backend** (Django + PostgreSQL)
3. **Vercel Frontend** (React build)
4. **Environment Variables** (connect everything)
5. **Testing & Verification**

**TL;DR**: 
- Push to GitHub → Auto-deploys to Render & Vercel
- Update `.env` → Backend settings update
- Edit Django admin → Content updates on frontend

## 🔐 Security Checklist

- ✅ No secrets in code
- ✅ Environment variables for all configuration
- ✅ HTTPS enforced on production
- ✅ CORS configured (not allow-all)
- ✅ Rate limiting on contact form (5/hour)
- ✅ Database encryption ready
- ✅ Static files through WhiteNoise

## 📊 Admin Features

### Profile Admin
- Image preview
- Search by name, email
- Contact info display

### Skills Admin
- Category filtering
- Proficiency level display
- Custom ordering

### Projects Admin
- Cover image preview
- Featured toggle
- Live URL quick access
- Tech stack editor

### Experience Admin
- Company logo preview
- Current status indicator
- Date range management

### Contact Messages Admin
- Unread indicator
- Bulk mark as read/unread
- Search by name, email, message

## 🛠️ Tech Stack

### Backend
- Django 5.1
- Django REST Framework
- PostgreSQL / SQLite
- Cloudinary (images)
- Gunicorn (WSGI)
- WhiteNoise (static files)

### Frontend
- React 18
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (custom properties)
- No additional frameworks (lightweight!)

### Infrastructure
- Render (backend hosting)
- Vercel (frontend hosting)
- Cloudinary (media storage)

## 📚 Documentation

- [Backend README](backend/README.md) - Django setup & API details
- [Frontend README](frontend/README.md) - React setup & component guide
- [Deployment Guide](DEPLOYMENT.md) - Step-by-step deployment

## 🐛 Troubleshooting

**Backend not accessible?**
- Check Render logs
- Verify ALLOWED_HOSTS setting
- Confirm database is running

**Frontend can't reach backend?**
- Check VITE_API_BASE_URL is correct
- Verify CORS_ALLOWED_ORIGINS on backend
- Check network tab in browser DevTools

**Images not loading?**
- Verify Cloudinary credentials
- Check upload in Django admin
- Ensure Cloudinary storage is configured

**Admin not showing content?**
- Load fixtures: `python manage.py loaddata fixtures/initial_data.json`
- Run migrations: `python manage.py migrate`

## 📝 License

This project is provided as-is for portfolio purposes.

## 🎓 Learning Resources

The codebase demonstrates:
- Django REST Framework best practices
- React hooks and component patterns
- Responsive CSS design
- Environment-based configuration
- Professional deployment workflow
- Admin interface customization

---

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

**Questions?** Check the README files in `/backend` and `/frontend` directories.
