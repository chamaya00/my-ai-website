# Auto-Deployment Setup Guide

This guide shows you how to set up automatic deployment so that your app redeploys whenever you push code to GitHub.

## 🎯 Three Deployment Options

### Option 1: Google Cloud Build Triggers (Recommended)
**Best for:** Keeping everything in GCP, easiest from iPhone
**Cost:** Free (120 build-minutes/day)

### Option 2: GitHub Actions
**Best for:** GitHub-centric workflows, more control
**Cost:** Free for public repos

### Option 3: Manual Deployment (Current)
**Best for:** Learning, testing, simple projects
**Cost:** Free

---

## 📋 Option 1: Cloud Build Triggers (Recommended)

This is the easiest to set up from your iPhone using GCP Console.

### Step 1: Store API Keys as Secrets

From your iPhone, go to **console.cloud.google.com** → Your Project

**In Cloud Shell, run:**

```bash
# Store Anthropic API key as secret
echo -n "sk-ant-your-actual-key" | gcloud secrets create ANTHROPIC_API_KEY --data-file=-

# Store SerpAPI key as secret
echo -n "your-serpapi-key" | gcloud secrets create SERPAPI_KEY --data-file=-

# Grant Cloud Build access to secrets
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding ANTHROPIC_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding SERPAPI_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 2: Connect GitHub Repository

**Option A: Using Cloud Shell (Easier on iPhone)**

```bash
cd ~/my-ai-website

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Create the build trigger
gcloud builds triggers create github \
  --name="auto-deploy-clothing-recommender" \
  --repo-name="my-ai-website" \
  --repo-owner="chamaya00" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml"
```

**Option B: Using GCP Console UI**

1. Go to **console.cloud.google.com/cloud-build/triggers**
2. Tap **"CREATE TRIGGER"**
3. Configure:
   - **Name:** `auto-deploy-clothing-recommender`
   - **Event:** Push to a branch
   - **Source:** Connect your GitHub repo (authorize when prompted)
   - **Branch:** `^main$` or `^master$`
   - **Build configuration:** Cloud Build configuration file
   - **Location:** `cloudbuild.yaml`
4. Tap **CREATE**

### Step 3: Test It!

```bash
# Make a small change
cd ~/my-ai-website
echo "# Test auto-deploy" >> README.md

# Commit and push to main/master
git add .
git commit -m "Test auto-deployment"
git push origin main  # or master
```

**Watch it deploy:**
1. Go to **console.cloud.google.com/cloud-build/builds**
2. You'll see a build running
3. Takes ~5-8 minutes
4. Your app auto-updates!

### Step 4: Update Your Workflow

**From now on:**

```bash
# 1. Make changes in Cloud Shell Editor
cloudshell edit ~/my-ai-website

# 2. Commit and push
cd ~/my-ai-website
git add .
git commit -m "Describe your changes"
git push origin main

# 3. That's it! Deploys automatically 🚀
# Check progress at: console.cloud.google.com/cloud-build/builds
```

---

## 📋 Option 2: GitHub Actions

Requires storing GCP credentials in GitHub, but gives you more control.

### Step 1: Create Service Account

**In Cloud Shell:**

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key (save this!)
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

# Display the key (copy this entire output)
cat key.json
```

### Step 2: Add Secrets to GitHub

**On your iPhone:**

1. Go to **github.com/chamaya00/my-ai-website**
2. Tap **Settings** → **Secrets and variables** → **Actions**
3. Tap **"New repository secret"**
4. Add these secrets:

| Name | Value |
|------|-------|
| `GCP_SA_KEY` | Paste the entire key.json content |
| `GCP_PROJECT_ID` | Your GCP project ID |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SERPAPI_KEY` | Your SerpAPI key |

### Step 3: Push the Workflow File

The workflow file (`.github/workflows/deploy.yml`) is already created.

```bash
cd ~/my-ai-website
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions auto-deployment"
git push origin main
```

### Step 4: Test It!

Make any change and push:

```bash
# Make a change
echo "# Test" >> README.md
git add .
git commit -m "Test GitHub Actions"
git push origin main

# Watch deployment:
# Go to github.com/chamaya00/my-ai-website/actions
```

---

## 🔄 Comparison: Which Should You Use?

### Use **Cloud Build Triggers** if:
- ✅ You want everything in GCP
- ✅ You're comfortable with GCP Console
- ✅ You want the simplest iPhone setup
- ✅ You only deploy to GCP

### Use **GitHub Actions** if:
- ✅ You prefer GitHub-centric workflows
- ✅ You want more deployment flexibility
- ✅ You might deploy to other platforms later
- ✅ You want deployment status in GitHub

### Use **Manual Deployment** if:
- ✅ You're still learning/testing
- ✅ You deploy infrequently
- ✅ You want full control over when things deploy

---

## 🎯 My Recommendation for You

**Start with Cloud Build Triggers** because:
1. Easier to set up from iPhone
2. No GitHub secrets needed
3. Free and reliable
4. Native GCP integration
5. Good logs in GCP Console

**Your new workflow will be:**

```bash
# 1. Edit code in Cloud Shell
cloudshell edit ~/my-ai-website

# 2. Commit and push
cd ~/my-ai-website
git add .
git commit -m "Updated feature X"
git push origin main

# 3. Auto-deploys! ✨
# Check progress: console.cloud.google.com/cloud-build/builds
# App updates in ~5-8 minutes
```

---

## 📱 Setup from iPhone (Cloud Build - Quick Version)

**Copy/paste this entire block into Cloud Shell:**

```bash
cd ~/my-ai-website

# Store secrets
echo -n "YOUR_ANTHROPIC_KEY" | gcloud secrets create ANTHROPIC_API_KEY --data-file=-
echo -n "YOUR_SERPAPI_KEY" | gcloud secrets create SERPAPI_KEY --data-file=-

# Grant access
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding ANTHROPIC_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding SERPAPI_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud Run permissions to Cloud Build
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create trigger
gcloud builds triggers create github \
  --name="auto-deploy-clothing-recommender" \
  --repo-name="my-ai-website" \
  --repo-owner="chamaya00" \
  --branch-pattern="^(main|master)$" \
  --build-config="cloudbuild.yaml"

echo "✅ Auto-deployment configured!"
echo "Push to main/master to trigger deployment"
```

**Then test:**

```bash
echo "# Testing auto-deploy" >> README.md
git add .
git commit -m "Test auto-deployment"
git push origin main
```

Watch it build at: **console.cloud.google.com/cloud-build/builds**

---

## 🐛 Troubleshooting

### "Permission denied" on secrets
```bash
# Check secrets exist
gcloud secrets list

# Re-grant permissions
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding ANTHROPIC_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### "Trigger doesn't fire"
- Check branch name matches: `main` vs `master`
- Verify trigger exists: `gcloud builds triggers list`
- Check build history: console.cloud.google.com/cloud-build/builds

### "Build fails"
```bash
# View recent build logs
gcloud builds list --limit=1
gcloud builds log [BUILD_ID]
```

---

## 📊 Monitoring Auto-Deployments

### View build history:
**console.cloud.google.com/cloud-build/builds**

### View deployment logs:
```bash
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

### Email notifications:
Set up in **console.cloud.google.com/cloud-build/triggers** → Edit trigger → Add notification

---

Want me to help you set up one of these options? I can walk you through it step-by-step!
