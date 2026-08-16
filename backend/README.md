# Portfolio Backend - Django + DRF

A professional Django REST Framework backend for a portfolio website with full admin panel control.

## Features

- **Django Admin Panel**: Manage all content (Profile, Skills, Projects, Experience, Education, Testimonials)
- **REST API**: Read-only endpoints for frontend consumption
- **Contact Form**: Submit contact messages with spam protection and email notifications
- **Cloudinary Integration**: Secure media storage (no ephemeral filesystem)
- **PostgreSQL**: Production database (SQLite for local dev)
- **CORS Configured**: Secure cross-origin requests from Vercel frontend
- **Environment Variables**: All secrets managed via environment configuration

## Local Development Setup

### Prerequisites
- Python 3.9+
- pip
- PostgreSQL (optional for local dev - SQLite is used by default)

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
# or: source venv/bin/activate  # On macOS/Linux
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create .env file from template:**
```bash
cp .env.example .env
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create superuser (admin account):**
```bash
python manage.py createsuperuser
# Follow the prompts to create admin account
```

6. **Run development server:**
```bash
python manage.py runserver
```

Access the application:
- Django Admin: http://localhost:8000/admin
- API: http://localhost:8000/api/

## API Endpoints

All endpoints are read-only (GET/HEAD/OPTIONS):

- `GET /api/profile/` - Portfolio owner's profile
- `GET /api/skills/` - All skills (filterable by category: ?category=frontend)
- `GET /api/projects/` - All projects (filterable by featured: ?featured=true)
- `GET /api/projects/{slug}/` - Single project by slug
- `GET /api/experience/` - Work experience history
- `GET /api/education/` - Education history
- `GET /api/testimonials/` - Testimonials

Write endpoints:
- `POST /api/contact/create_message/` - Submit contact form (rate-limited to 5/hour per IP)

## Django Admin Panel

Access admin at: `http://localhost:8000/admin/`

### Manageable Sections

1. **Profile** - Single profile instance with photo, resume, and social links
2. **Skills** - Skills organized by category (Frontend/Backend/Tools/etc)
3. **Projects** - Projects with cover images, gallery, tech stack, and links
4. **Experience** - Work history with company logos
5. **Education** - Educational background
6. **Testimonials** - Client/colleague testimonials
7. **Contact Messages** - Incoming contact form submissions (read-only in API)

All sections have:
- Image previews in the admin list
- Search functionality
- Filtering options
- Custom ordering

## Environment Variables

Key variables (see .env.example for all):

```
SECRET_KEY              # Django secret key (generate a secure one)
DEBUG                   # Set to False in production
ALLOWED_HOSTS          # Comma-separated list of allowed domains
DATABASE_URL           # PostgreSQL connection string
CORS_ALLOWED_ORIGINS   # Comma-separated CORS origins
CLOUDINARY_URL         # Cloudinary storage (required for production)
EMAIL_*                # SMTP configuration for contact notifications
CONTACT_EMAIL_RECIPIENT # Where to send contact messages
```

## Running Migrations

After making model changes:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment to Render

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory for step-by-step Render deployment instructions.

## API Response Format

Example Profile Response:
```json
{
  "id": 1,
  "full_name": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Passionate about building...",
  "profile_photo": "https://res.cloudinary.com/.../image.jpg",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "website_url": "https://johndoe.com"
}
```

## Testing Contact Form

```bash
curl -X POST http://localhost:8000/api/contact/create_message/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message with more than 10 characters"
  }'
```

## Troubleshooting

**Issue: Cloudinary images not loading in development**
- Ensure CLOUDINARY_URL is set in .env
- Check Cloudinary API credentials

**Issue: Email not sending**
- For Gmail: Use "App Password" not regular password
- Enable "Less secure app access" if using regular password
- Check EMAIL_BACKEND setting in .env

**Issue: CORS errors**
- Verify CORS_ALLOWED_ORIGINS includes your frontend URL
- Restart the development server after .env changes

## Database

### Local Development
Uses SQLite by default (db.sqlite3). No additional setup needed.

### Production (Render)
Uses PostgreSQL. Connection string provided via DATABASE_URL environment variable.

To migrate from SQLite to PostgreSQL:
1. Dump data: `python manage.py dumpdata > data.json`
2. Update DATABASE_URL to PostgreSQL
3. Run migrations: `python manage.py migrate`
4. Load data: `python manage.py loaddata data.json`

## Support

For issues, check:
1. Environment variables are set correctly
2. Database migrations are applied
3. Cloudinary credentials are valid (for production)
4. CORS origins include your frontend domain
