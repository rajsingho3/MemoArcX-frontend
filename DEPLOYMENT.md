# Vercel Deployment Guide

## Prerequisites
- Make sure your backend URL is correctly configured in `src/config.ts`
- Ensure all environment variables are set up correctly

## Deployment Steps

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables (if needed)**
   - Add any environment variables in the Vercel dashboard
   - Navigate to Project Settings → Environment Variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Important Files for Vercel Deployment

- `vercel.json` - Handles client-side routing rewrites
- `package.json` - Contains build scripts
- `vite.config.ts` - Vite configuration

## Troubleshooting

### Blank Page Issues
- The `vercel.json` file ensures all routes redirect to `index.html` for client-side routing
- Added a catch-all route in `App.tsx` to handle unknown paths
- Improved auth state management to prevent loading issues

### Routing Issues
- All navigation now uses React Router's `Link` and `navigate` instead of `window.location`
- Signout functionality updated to use proper React Router navigation

### CORS Issues
- Make sure your backend allows requests from your Vercel domain
- Update backend CORS configuration to include your Vercel URL

## Post-Deployment Checklist

1. Test all routes (signin, signup, dashboard)
2. Test signout functionality
3. Test signup/signin navigation
4. Verify backend API calls work correctly
5. Test refresh on different routes

## Domain Configuration

Once deployed, you can:
1. Use the default Vercel domain
2. Add a custom domain in Project Settings → Domains

Remember to update your backend CORS settings to include your new domain!