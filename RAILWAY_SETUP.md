# Railway Deployment Setup

## Important: Set Root Directory in Railway

When deploying on Railway, you **must** set the root directory to `backend`:

### Steps:

1. **After connecting your GitHub repo:**
   - Railway will show "Configure Service"
   - Click on the service name

2. **Go to Settings tab:**
   - Scroll down to "Root Directory"
   - Set it to: `backend`
   - Click "Update"

3. **Or during initial setup:**
   - When Railway asks "Which directory?"
   - Select: `backend`

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add all your `.env` variables

5. **Deploy:**
   - Railway will auto-detect Python
   - It will run: `pip install -r requirements.txt`
   - Then start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Alternative: Use Railway CLI

If you prefer command line:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize in backend folder
cd backend
railway init

# Link to project
railway link

# Set variables
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_KEY=your_key
# ... etc

# Deploy
railway up
```

---

## Troubleshooting

**"Railpack could not determine how to build"**
- ✅ Make sure root directory is set to `backend`
- ✅ Verify `requirements.txt` exists in `backend/`
- ✅ Check that `app/main.py` exists

**"Module not found"**
- ✅ Check all dependencies in `requirements.txt`
- ✅ Verify Python version (3.11 recommended)

**"Port already in use"**
- ✅ Railway sets `$PORT` automatically
- ✅ Make sure you're using `--port $PORT` in start command

---

## Quick Fix for Current Error

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** tab
4. Find **"Root Directory"**
5. Set it to: `backend`
6. Click **"Update"**
7. Railway will redeploy automatically

This should fix the detection issue!

