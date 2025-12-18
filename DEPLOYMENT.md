# 🚀 Deployment Guide - Mechowarts

This guide will help you deploy Mechowarts to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- Node.js 20.x or higher installed
- npm 10.x or higher
- A Supabase account and project set up
- A hosting platform account (Vercel, Netlify, or similar)
- Backend API deployed and accessible

## 🔧 Environment Configuration

### 1. Create Production Environment File

Copy `.env.example` to `.env.production` and update the values:

```bash
cp .env.example .env.production
```

Update `.env.production` with your production values:

```env
VITE_API_URL=https://your-production-api.com/api
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

⚠️ **Important**: Never commit `.env.production` with real credentials to version control!

## 🏗️ Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format:check
```

### 3. Build for Production

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle and optimize assets with Vite
- Generate optimized chunks
- Create a `dist/` folder with production-ready files

### 4. Preview Production Build (Optional)

```bash
npm run preview
```

This starts a local server to preview the production build.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to your Vercel project settings
   - Add environment variables from `.env.production`
   - Redeploy if needed

4. **Configure Build Settings** (if needed):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Configure Environment Variables**:
   - Go to Site Settings → Build & Deploy → Environment
   - Add variables from `.env.production`

4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 3: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your web server

3. Configure your web server:
   - Serve `index.html` for all routes (SPA support)
   - Enable gzip compression
   - Set proper cache headers

#### Example Nginx Configuration:

```nginx
server {
    listen 80;
    server_name mechowarts.com;
    root /var/www/mechowarts/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] All environment variables are properly configured
- [ ] `.env` files with secrets are not committed to Git
- [ ] HTTPS is enabled on your domain
- [ ] CORS is properly configured on your backend
- [ ] Supabase RLS (Row Level Security) policies are set up
- [ ] Rate limiting is configured on sensitive endpoints
- [ ] Security headers are configured (CSP, HSTS, etc.)

## 🎯 Post-Deployment Checklist

After deployment:

- [ ] Test all authentication flows (login, signup, magic link)
- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile devices
- [ ] Check browser console for errors
- [ ] Verify API calls are working
- [ ] Test dark/light mode switching
- [ ] Verify WebSocket connections (Owlery chat)
- [ ] Check SEO meta tags are correct
- [ ] Test PWA functionality (if applicable)
- [ ] Monitor application performance

## 📊 Performance Optimization

The application is already optimized with:

- Code splitting and lazy loading
- Optimized chunk sizes
- Tree shaking
- Minification
- Gzip compression support

### Additional Optimizations:

1. **CDN**: Use a CDN for static assets
2. **Image Optimization**: Compress images before deploying
3. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)
4. **Analytics**: Add Google Analytics or similar

## 🐛 Troubleshooting

### Build Fails

- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node -v` (should be 20.x or higher)
- Run `npm run type-check` to find TypeScript errors

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Rebuild after changing environment variables
- Check variable names match exactly

### Routing Issues (404 on Refresh)

- Configure your hosting platform to serve `index.html` for all routes
- For Vercel/Netlify, this is automatic
- For custom servers, see Nginx example above

### WebSocket Connection Fails

- Verify backend URL is correct in `.env.production`
- Check CORS settings on backend
- Ensure WebSocket protocol is supported by hosting platform

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Review the deployment logs
3. Verify environment variables are set correctly
4. Consult the hosting platform's documentation

## 🔄 Continuous Deployment

For automated deployments:

1. Connect your Git repository to Vercel/Netlify
2. Configure build settings and environment variables
3. Enable automatic deployments on push to main branch
4. Set up preview deployments for pull requests

---

**Happy Deploying! 🎉**

Built with ❤️ by the Mechowarts Development Team
