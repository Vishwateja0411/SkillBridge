# 🚀 SkillBridge Production Deployment Guide
## Deploying on Vercel (Frontend) + Render (Backend) for 100% Free

This guide walks you step-by-step through deploying SkillBridge to the cloud so you have a live public URL to share with clients, investors, or reviewers.

---

### Part 1: Deploy Backend to Render (Node.js API + Socket.io)

1. Go to **[https://render.com](https://render.com)** and sign in with your GitHub account.
2. In the Render Dashboard, click **New +** ➔ **Web Service**.
3. Choose **Build and deploy from a Git repository** and select your repository:
   * **`Vishwateja0411/SkillBridge`**
4. Configure the settings:
   * **Name:** `skillbridge-api`
   * **Region:** Any (e.g., *Oregon (US West)* or *Frankfurt (EU)*)
   * **Branch:** `main`
   * **Root Directory:** Leave blank
   * **Runtime:** `Node`
   * **Build Command:**
     ```bash
     npm install && npm run build --workspace=@skillbridge/shared && npm run build --workspace=@skillbridge/api
     ```
   * **Start Command:**
     ```bash
     node apps/api/dist/server.js
     ```
   * **Plan:** **Free**
5. Add **Environment Variables** (under *Environment Variables* section):
   * `NODE_ENV` = `production`
   * `PORT` = `5000`
   * `JWT_SECRET` = `skillbridge-production-secret-jwt-key-2026`
   * `GROQ_API_KEY` = `your_groq_api_key_here` (from your .env file)
   * `CLIENT_URL` = `https://your-vercel-app.vercel.app` *(update this after Step 2)*
6. Click **Create Web Service**.
7. Once deployed, Render will give you your backend URL, for example:
   👉 **`https://skillbridge-api.onrender.com`**

---

### Part 2: Deploy Frontend to Vercel (React + Vite)

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with your GitHub account.
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: **`Vishwateja0411/SkillBridge`**.
4. Configure the project settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Click *Edit* and select **`apps/web`**
   * **Build Command:** `npm run build` *(Vercel auto-detects this)*
   * **Output Directory:** `dist` *(Vercel auto-detects this)*
5. Under **Environment Variables**, add:
   * **`VITE_API_URL`** = Your Render backend URL from Part 1
     *(e.g., `https://skillbridge-api.onrender.com`)*
6. Click **Deploy**.
7. In ~45 seconds, Vercel will give you your live production URL:
   👉 **`https://skillbridge-yourname.vercel.app`**

---

### Part 3: Final Linkage

1. Go back to your **Render** dashboard ➔ **`skillbridge-api`** ➔ **Environment**.
2. Update the `CLIENT_URL` variable to your new Vercel URL:
   * `CLIENT_URL` = `https://skillbridge-yourname.vercel.app`
3. Click **Save Changes** (Render will automatically re-deploy in 20 seconds).

---

### 🎉 Your Platform is Live!
* **Frontend:** Running with global CDN caching on Vercel.
* **Backend:** Express API, Socket.io real-time chat, and Groq LPU + RAG Vector Scoping running on Render.
* **Continuous Deployment (CI/CD):** Every time you push to the `main` branch on GitHub, both Vercel and Render will automatically build and update your live site!
