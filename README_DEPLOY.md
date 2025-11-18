# 🚀 UPISensei - Free 24/7 Deployment

Deploy your UPISensei app for free with 24/7 uptime!

## ⚡ Quick Start (5 Minutes)

### Recommended: Vercel + Railway

**Why this combo?**
- ✅ Both completely free
- ✅ No spin-down (always running)
- ✅ Auto-deploy from GitHub
- ✅ Fast and reliable

---

## 📋 Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/hacknovate-2025.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend (Railway)

1. **Sign up**: [railway.app](https://railway.app) (use GitHub)
2. **New Project** → "Deploy from GitHub repo"
3. **Select repository** → Choose `backend` as root directory
4. **Add Environment Variables**:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_SERVICE_KEY=your_service_key
   GEMINI_API_KEY=your_gemini_key
   GEMINI_ENABLED=true
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
5. **Deploy** → Railway auto-deploys
6. **Copy URL**: `https://your-app.up.railway.app`

### 3. Deploy Frontend (Vercel)

1. **Sign up**: [vercel.com](https://vercel.com) (use GitHub)
2. **New Project** → Import from GitHub
3. **Select repository** → Choose `frontend_web` as root directory
4. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
   ```
5. **Deploy** → Vercel auto-deploys
6. **Copy URL**: `https://your-app.vercel.app`

### 4. Update CORS

Go back to Railway → Variables → Update:
```
CORS_ORIGINS=https://your-app.vercel.app
```

---

## 🎯 Alternative Options

### Option 2: Netlify + Render
- **Netlify**: Frontend (free, no spin-down)
- **Render**: Backend (free, but spins down after 15min)

### Option 3: Fly.io (Both)
- Deploy both on Fly.io
- Free tier: 3 shared VMs
- See `DEPLOYMENT.md` for details

---

## 📊 Free Tier Comparison

| Platform | Free Tier | Always On? | Best For |
|----------|-----------|------------|----------|
| **Vercel** | ✅ Yes | ✅ Yes | Frontend |
| **Railway** | ✅ $5/month credit | ✅ Yes | Backend |
| **Render** | ✅ Yes | ❌ Spins down | Backend (budget) |
| **Netlify** | ✅ Yes | ✅ Yes | Frontend |
| **Fly.io** | ✅ Yes | ✅ Yes | Both |

**Best Combo**: Vercel + Railway = Always on, completely free!

---

## 🔧 Environment Variables

### Backend (Railway/Render/Fly.io)
```
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_KEY=...
GEMINI_API_KEY=...
GEMINI_ENABLED=true
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel/Netlify)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running (check Railway dashboard)
- [ ] Frontend is live (check Vercel dashboard)
- [ ] CORS origins updated
- [ ] Test file upload
- [ ] Test chat functionality
- [ ] Check logs for errors

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check all env vars are set in Railway
- View logs in Railway dashboard
- Verify Python version

**CORS errors?**
- Update `CORS_ORIGINS` with exact frontend URL
- Include `https://` prefix
- Redeploy backend

**Frontend can't connect?**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Test backend URL: `https://your-backend.railway.app/health`
- Check browser console for errors

---

## 📚 Full Documentation

- **Detailed Guide**: See `DEPLOYMENT.md`
- **Quick Guide**: See `QUICK_DEPLOY.md`
- **Architecture**: See `ARCHITECTURE.md`

---

## 💡 Pro Tips

1. **Use Railway for backend** - Most reliable free option
2. **Enable auto-deploy** - Push to main = auto deploy
3. **Monitor logs** - Check both platforms regularly
4. **Set up alerts** - Get notified of issues
5. **Use custom domains** - Both platforms support free SSL

---

**Your app will be live 24/7 for free!** 🎉

