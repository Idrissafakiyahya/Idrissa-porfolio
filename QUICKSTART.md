# Quick Start Guide

Get your portfolio running locally in 5 minutes.

## 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Create database and super user
python manage.py migrate
python manage.py createsuperuser

# Load sample data
python manage.py loaddata fixtures/initial_data.json

# Start server
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000**
✅ Admin panel at: **http://localhost:8000/admin/**

## 2️⃣ Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

## 3️⃣ View Your Portfolio

Open http://localhost:5173 in your browser. You should see:
- Hero section with profile
- Skills with categories
- Featured projects
- Experience timeline
- Education entries
- Testimonials
- Contact form

## 4️⃣ Edit Content in Admin

1. Go to http://localhost:8000/admin/
2. Login with your superuser credentials created above
3. Click through each section to edit:
   - **Profile**: Your name, bio, photo, social links
   - **Skills**: Organize by category
   - **Projects**: Add your portfolio projects
   - **Experience**: Your work history
   - **Education**: Your degrees
   - **Testimonials**: Client feedback

Changes appear immediately on frontend!

## 5️⃣ Customize

### Change Colors
Edit `frontend/src/styles/globals.css` CSS variables:
- `--primary`: Main color (default: blue)
- `--accent`: Highlight color (default: orange)

### Add Your Info
Edit profile in Django admin:
- Full name
- Title/tagline
- Bio
- Profile photo
- Resume file
- Social links

### Disable Sample Data
Delete the loaded fixtures:
```bash
python manage.py shell
# Then run:
from portfolio.models import *
# Delete all objects manually, or:
python manage.py flush  # WARNING: Deletes entire database
```

## 📸 Add Media Files

### Profile Photo
1. Admin → Profile
2. Upload image in "Profile photo" field
3. Save

Images are stored locally in development (`media/` folder).

### Project Cover Image
1. Admin → Projects
2. Add cover image for each project
3. Add gallery images in ProjectImage section

### Company Logos & Testimonial Photos
Upload in respective admin sections.

## 🌙 Test Dark Mode

Click the sun/moon icon in top navbar to toggle dark mode. Your preference is saved!

## 📝 API Testing

Test the API directly:

```bash
# Get profile
curl http://localhost:8000/api/profile/

# Get all projects
curl http://localhost:8000/api/projects/

# Get skills by category
curl "http://localhost:8000/api/skills/?category=frontend"

# Submit contact form
curl -X POST http://localhost:8000/api/contact/create_message/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message with at least 10 characters"
  }'
```

## ✨ Common Tweaks

### Change API Timeout
Edit `frontend/src/services/api.js`:
```javascript
timeout: 10000,  // Change to your value (milliseconds)
```

### Rate Limit Contact Form
Edit `backend/portfolio/views.py`, line in `ContactThrottle`:
```python
THROTTLE_RATES = {'contact': '10/hour'}  # Change from 5/hour
```

### Add Custom Sections
1. Create new model in `backend/portfolio/models.py`
2. Add serializer in `backend/portfolio/serializers.py`
3. Add viewset in `backend/portfolio/views.py`
4. Register in admin in `backend/portfolio/admin.py`
5. Add URL in `backend/portfolio/urls.py`
6. Create React component in `frontend/src/components/`

## 🐛 Troubleshooting

### "No module named 'django'"
```bash
# Ensure venv is activated and dependencies installed
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### "Module not found" in React
```bash
# In frontend directory
npm install
```

### Port already in use
```bash
# Backend on different port
python manage.py runserver 8001

# Frontend on different port
npm run dev -- --port 5174
```

### Database errors
```bash
# Reset database (WARNING: Deletes all data)
python manage.py migrate --fake portfolio zero
python manage.py migrate
```

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](../DEPLOYMENT.md) for step-by-step Render + Vercel deployment.

## 📚 Need More Info?

- Backend: See [backend/README.md](backend/README.md)
- Frontend: See [frontend/README.md](frontend/README.md)
- Deployment: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Main: See [README.md](README.md)

---

**Have questions?** The admin panel (`/admin/`) has descriptions for every field!

**Ready for changes?** Everything is designed to be editable—no code changes needed!
