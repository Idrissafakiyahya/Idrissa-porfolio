# Deployment Guide

Complete step-by-step instructions for deploying the portfolio website to Render (backend) and Vercel (frontend).

## Architecture Overview

- **Backend**: Django REST API on Render (with PostgreSQL)
- **Frontend**: React SPA on Vercel (static build)
- **Media Storage**: Cloudinary (for all images)
- **Database**: Render PostgreSQL (production)

## Prerequisites

Before starting, ensure you have:
1. GitHub account (for version control)
2. Render account (free tier works)
3. Vercel account (free tier works)
4. Cloudinary account (free tier works)

## Step 1: Set Up Cloudinary (Image Storage)

Cloudinary is **required** for production because Render's filesystem is ephemeral (deletes files on redeploy).

### 1.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify email

### 1.2 Get Your Credentials
1. In Cloudinary dashboard, go to **Settings** (gear icon)
2. Find the **API Environment variable**
3. It looks like: `cloudinary://api_key:api_secret@cloud_name`
4. Copy the entire string

### 1.3 Store Credentials
Save these three values (you'll need them later):
- CLOUDINARY_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## Step 2: Deploy Backend to Render

### 2.1 Prepare Backend for Deployment

1. Update backend `.env` with secure values:
```bash
cd backend
cp .env.example .env
```

2. Generate a secure SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

3. Update `.env`:
```
SECRET_KEY=<paste-the-key-you-just-generated>
DEBUG=False
ALLOWED_HOSTS=<your-app-name>.onrender.com
DATABASE_URL=postgresql://...  # Will set on Render
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://<your-vercel-domain>.vercel.app
CLOUDINARY_URL=<paste-from-cloudinary>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-gmail>
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=<your-email>
CONTACT_EMAIL_RECIPIENT=<your-email>
```

### 2.2 Push Code to GitHub

```bash
# From project root
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### 2.3 Create Render Web Service

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click **New +** → **Web Service**
4. Connect GitHub (authorize Render)
5. Select your portfolio repository
6. Fill in deployment settings:
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `bash ./build.sh`
   - **Start Command**: `gunicorn portfolio_site.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: Free

7. Click **Create Web Service**

### 2.4 Create Render PostgreSQL Database

1. In Render dashboard, click **New +** → **PostgreSQL**
2. Fill in settings:
   - **Name**: `portfolio-db`
   - **Database**: `portfolio`
   - **User**: `portfolio_user`
   - **Plan**: Free
   - **Region**: Choose closest to you

3. Click **Create Database**

### 2.5 Link Database and Set Environment Variables

Back in Web Service settings:

1. Go to **Environment** tab
2. Add these environment variables (copy from database page):
   ```
   DATABASE_URL = <database internal connection string>
   SECRET_KEY = <generated secret key from step 2.1>
   DEBUG = False
   ALLOWED_HOSTS = <your-app-name>.onrender.com
   CORS_ALLOWED_ORIGINS = http://localhost:5173,https://<your-vercel-domain>.vercel.app
   CLOUDINARY_URL = <from cloudinary>
   CLOUDINARY_CLOUD_NAME = <from cloudinary>
   CLOUDINARY_API_KEY = <from cloudinary>
   CLOUDINARY_API_SECRET = <from cloudinary>
   EMAIL_BACKEND = django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   EMAIL_HOST_USER = <your-gmail>
   EMAIL_HOST_PASSWORD = <your-app-password>
   DEFAULT_FROM_EMAIL = <your-email>
   CONTACT_EMAIL_RECIPIENT = <your-email>
   ```

3. Click **Save**

### 2.6 Deploy and Initialize Database

1. Render will auto-deploy. Check build logs in **Logs** tab
2. Once deployed, the database is automatically migrated by `build.sh`
3. Note your backend URL: `https://<your-app-name>.onrender.com`

### 2.7 Load Sample Data (Optional)

SSH into Render and load fixtures:

```bash
# In Render web service terminal
python manage.py loaddata fixtures/initial_data.json
```

Visit `https://<your-app-name>.onrender.com/admin/` and log in with your superuser credentials.

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

Update `frontend/.env.example`:
```
VITE_API_BASE_URL=https://<your-backend-url>/api
```

Push to GitHub (it's already there from step 2.2).

### 3.2 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click **Add New** → **Project**
4. Select your portfolio repository
5. Import settings:
   - **Framework**: Vite
   - **Root Directory**: `./frontend`
   - Click **Deploy**

### 3.3 Set Environment Variables on Vercel

1. Go to project **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_BASE_URL = https://<your-render-backend-url>/api
   ```
3. Save

### 3.4 Trigger Redeploy

1. Click **Deployments**
2. Click **Redeploy** on latest deployment
3. Wait for build to complete
4. Your frontend URL will be shown in dashboard (e.g., `https://portfolio.vercel.app`)

## Step 4: Update CORS on Backend

Now that you have the Vercel domain, update your backend CORS:

1. Go to Render Web Service **Environment** tab
2. Edit `CORS_ALLOWED_ORIGINS`:
   ```
   http://localhost:5173,https://<your-vercel-domain>.vercel.app
   ```
3. Save and Render will auto-redeploy

## Step 5: Test Everything

### 5.1 Test Backend
```bash
# Replace with your Render URL
curl https://<your-render-url>/api/profile/
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Verify all sections load
3. Check that images load from Cloudinary
4. Test contact form

### 5.3 Test Admin Panel
1. Visit `https://<your-render-url>/admin/`
2. Log in with Django superuser
3. Add/edit content (profile, projects, skills, etc.)
4. Verify changes appear on frontend within a few seconds

### 5.4 Test Email Notifications
1. Submit contact form on frontend
2. Check email for contact message notification

## Troubleshooting

### Issue: Images not loading
- Verify CLOUDINARY_URL is set correctly
- Check Cloudinary dashboard for storage quota
- Ensure upload is successful in Django admin

### Issue: CORS errors
- Verify CORS_ALLOWED_ORIGINS includes your Vercel domain
- Check frontend VITE_API_BASE_URL matches backend URL
- Wait 2-3 minutes after changing CORS settings

### Issue: Frontend can't reach backend
- Verify backend is running (check Render logs)
- Confirm VITE_API_BASE_URL in Vercel environment
- Test backend URL directly in browser
- Check network tab in browser DevTools

### Issue: Static files not loading
- Clear browser cache
- Verify whitenoise is installed (check requirements.txt)
- Check Render logs for collection errors

### Issue: PostgreSQL connection error
- Verify DATABASE_URL is correct
- Check database hasn't exceeded free tier limits
- Restart Render web service

## Monitoring & Maintenance

### Monitor Backend
1. View logs: Render **Logs** tab
2. Monitor performance: Render **Metrics** tab
3. Check email sending: CloudMailin or Sendgrid (if using)

### Monitor Frontend
1. View logs: Vercel **Logs** tab
2. Monitor speed: Vercel **Analytics** tab
3. Check errors: Vercel **Monitoring**

### Regular Updates
1. Update dependencies: `pip install --upgrade -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Commit and push to GitHub (auto-deploys on both Render and Vercel)

## Important Notes

### Security
- Never commit `.env` files with secrets
- Rotate API keys regularly
- Use environment variables everywhere
- Enable HTTPS (Render/Vercel do this by default)

### Database Backups
- Render free tier doesn't auto-backup
- Use `python manage.py dumpdata > backup.json` regularly
- Store backups in safe location

### Cost Optimization
- Free tier limits:
  - Render: 750 hours/month (1 free service running 24/7 works)
  - Vercel: 100GB/month bandwidth
  - Cloudinary: 25 GB storage

### Going to Production Domain
1. Register domain (GoDaddy, Namecheap, etc.)
2. Point DNS to Vercel (Vercel dashboard has instructions)
3. Add domain to both Vercel and Render
4. Update CORS_ALLOWED_ORIGINS with production domain
5. Update VITE_API_BASE_URL on Vercel

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. Add your profile content in Django admin
4. Add projects, experience, education, skills
5. Test contact form
6. Share your portfolio!

## Support

Refer to READMEs in `/backend` and `/frontend` for more detailed info on each component.

For issues:
1. Check Render and Vercel logs
2. Review environment variables
3. Test API endpoints with curl
4. Check browser console for frontend errors
