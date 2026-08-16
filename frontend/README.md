# Portfolio Frontend - React + Vite

A modern, responsive React-based portfolio website that consumes data from the Django REST API backend.

## Features

- **Dynamic Content**: All content fetched from Django backend API
- **Dark/Light Mode**: User preference toggle with localStorage
- **Fully Responsive**: Mobile-first design, works on all devices
- **Modern Design**: Clean UI with smooth animations
- **Performance**: Built with Vite for optimal bundling

## Local Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create .env file from template:**
```bash
cp .env.example .env
```

3. **Ensure backend is running** on http://localhost:8000

4. **Start development server:**
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
  - Local: `http://localhost:8000/api`
  - Production: `https://your-render-url.onrender.com/api`

## Project Structure

```
src/
├── components/       # React components (Hero, Skills, Projects, etc.)
├── hooks/           # Custom React hooks (useFetch)
├── services/        # API service layer
├── styles/          # CSS files organized by section
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Building for Production

```bash
npm run build
```

This generates a `dist/` folder ready for deployment on Vercel.

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Components

### Layout
- **Navbar** - Navigation with dark mode toggle
- **Hero** - Introduction section with profile info
- **About** - About me section
- **Skills** - Skills with category filtering
- **Projects** - Featured projects grid
- **Experience** - Work history timeline
- **Education** - Educational background
- **Testimonials** - Client testimonials
- **Contact** - Contact form with validation
- **Footer** - Footer with links and social media

## API Integration

The frontend uses the `api.js` service to communicate with the Django backend:

- **Profile**: `GET /api/profile/` - Portfolio owner info
- **Skills**: `GET /api/skills/` - Skills list (filterable)
- **Projects**: `GET /api/projects/` - Projects (filterable)
- **Experience**: `GET /api/experience/` - Work history
- **Education**: `GET /api/education/` - Education history
- **Testimonials**: `GET /api/testimonials/` - Testimonials
- **Contact**: `POST /api/contact/create_message/` - Submit contact form

## Styling

The frontend uses a design system with:
- CSS custom properties (variables) for colors, spacing, typography
- Mobile-first responsive design
- Dark mode support via `body.dark-mode` class
- Consistent animations and transitions

## Features

### Dark Mode
- Toggle with sun/moon icon in navbar
- Preference saved in localStorage
- Respects system preferences on first visit

### Contact Form
- Real-time validation
- Rate limiting (5 requests/hour)
- Success/error message feedback
- Loading state with disabled button

### Loading States
- Skeleton loaders for each section
- Smooth transitions
- Graceful error handling

### Responsiveness
- Mobile-first approach
- Breakpoint: 768px
- Hamburger menu on mobile
- Touch-friendly interactions

## Deployment to Vercel

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory for step-by-step instructions.

Quick setup:
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel automatically deploys on push

## Troubleshooting

**Issue: API 404 errors**
- Ensure backend is running
- Check VITE_API_BASE_URL in .env
- Verify CORS is configured on backend

**Issue: Dark mode not working**
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

**Issue: Images not loading**
- Verify Cloudinary URL from backend
- Check browser network tab
- Ensure Cloudinary credentials are valid

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Uses code splitting via Vite
- Images optimized via Cloudinary
- Minimal dependencies for faster load times
- Production build size ~150KB gzipped

## Support

For issues:
1. Check browser console for errors
2. Verify backend API is responding
3. Check environment variables
4. Review network tab in DevTools
