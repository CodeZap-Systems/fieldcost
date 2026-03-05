# Vercel Deployment Guide for FieldCost MVP

## Prerequisites
- Vercel account (https://vercel.com)
- Supabase project set up (with credentials)
- This project cloned locally

## Steps

1. **Push your code to GitHub (or GitLab/Bitbucket)**
   - Make sure your latest code is committed and pushed to your remote repository.

2. **Create a new project on Vercel**
   - Go to https://vercel.com/new
   - Import your FieldCost repository

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project > Settings > Environment Variables
   - Add the following variables (from your `.env.local`):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Set Build & Output Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to finish. Your app will be live at the provided Vercel URL.

6. **(Optional) Set up a custom domain**
   - In Vercel, go to your project > Domains > Add
   - Follow the instructions to point your domain to Vercel

## Notes
- Any time you push to your main branch, Vercel will auto-deploy.
- For Supabase RLS and API access, make sure your policies are correct and your keys are secure.
- For file uploads, ensure your Supabase storage bucket is public or has the correct policies.

## Troubleshooting
- Check Vercel build logs for errors
- Ensure all environment variables are set
- Check Supabase project for API or RLS issues

---

For more, see: https://vercel.com/docs and https://supabase.com/docs
