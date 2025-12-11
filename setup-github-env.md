# GitHub Repository Setup Guide

## Required GitHub Secrets

### Repository Secrets (Settings → Secrets and variables → Actions → Secrets)

```bash
# Cloudflare Configuration
CLOUDFLARE_API_KEY=your_cloudflare_global_api_key_here
CLOUDFLARE_EMAIL=your_cloudflare_account_email_here

# Optional: Code Coverage
CODECOV_TOKEN=your_codecov_token_here  # Optional for test coverage reports
```

## Required GitHub Variables

### Development Environment (Settings → Environments → development → Variables)

```bash
# API Configuration
REACT_APP_API_URL=https://dev-api.fitsync.online/api
REACT_APP_WS_URL=wss://dev-api.fitsync.online

# Domain Configuration  
DOMAIN=dev.fitsync.online
```

### Production Environment (Settings → Environments → production → Variables)

```bash
# API Configuration
REACT_APP_API_URL=https://api.fitsync.online/api
REACT_APP_WS_URL=wss://api.fitsync.online

# Domain Configuration
DOMAIN=fitsync.online
```

## Cloudflare Setup Steps

### 1. Get Cloudflare Global API Key

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Scroll down to "API Keys" section
3. Click "View" next to "Global API Key"
4. Enter your password to reveal the key
5. Copy the Global API Key
6. Also note your Cloudflare account email

### 2. No Account ID Needed

When using Global API Key + Email, you don't need the Account ID.

### 3. Create Cloudflare Pages Project

```bash
# Install Wrangler CLI (optional, for manual setup)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create Pages project (will be done automatically by GitHub Actions)
wrangler pages project create fitsync-frontend
wrangler pages project create fitsync-frontend-prod
```

## GitHub Environment Setup

### 1. Create Environments

1. Go to repository **Settings → Environments**
2. Click **New environment**
3. Create two environments:
   - `development` 
   - `production`

### 2. Configure Environment Protection Rules

**Development Environment:**
- ✅ Required reviewers: (none for dev)
- ✅ Wait timer: 0 minutes
- ✅ Deployment branches: `dev` branch only

**Production Environment:**
- ✅ Required reviewers: Add team members
- ✅ Wait timer: 5 minutes (optional)
- ✅ Deployment branches: `main` branch only

## Workflow Triggers

### Automatic Deployments

- **Push to `dev`** → Deploy to development (dev.fitsync.online)
- **Push to `main`** → Deploy to production (fitsync.online)
- **Pull Request to `dev`** → Deploy preview + run tests
- **Pull Request to `main`** → Deploy preview + run tests

### Manual Deployment

```bash
# Trigger workflow manually from GitHub Actions tab
# Or use GitHub CLI
gh workflow run deploy-enhanced.yml --ref dev
```

## Testing the Setup

### 1. Test Pipeline

```bash
# Create a test branch
git checkout -b test-deployment

# Make a small change
echo "// Test deployment" >> src/App.js

# Commit and push
git add .
git commit -m "test: trigger deployment pipeline"
git push origin test-deployment

# Create PR to dev branch
gh pr create --title "Test deployment pipeline" --body "Testing CI/CD setup"
```

### 2. Verify Deployment

1. Check GitHub Actions tab for workflow status
2. Verify preview URL in PR comment
3. Test the deployed application
4. Merge PR to trigger dev deployment

## Troubleshooting

### Common Issues

**1. Cloudflare Global API Key Authentication**
```bash
# Test Global API Key
curl -X GET "https://api.cloudflare.com/client/v4/user" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-global-api-key"
```

**2. Domain Not Resolving**
- Ensure domain is added to Cloudflare Pages project
- Check DNS records in Cloudflare dashboard
- Wait for DNS propagation (up to 24 hours)

**3. Build Failures**
- Check environment variables are set correctly
- Verify Node.js version compatibility
- Check for missing dependencies

### Useful Commands

```bash
# Check Cloudflare Pages deployments
wrangler pages deployment list --project-name=fitsync-frontend

# View deployment logs
wrangler pages deployment tail --project-name=fitsync-frontend

# Check custom domains
wrangler pages domain list --project-name=fitsync-frontend
```

## Security Notes

- ✅ API tokens have minimal required permissions
- ✅ Secrets are encrypted in GitHub
- ✅ Environment variables are scoped to environments
- ✅ Production deployments require approval
- ✅ Preview deployments are isolated

## Next Steps

1. Set up all secrets and variables as documented above
2. Create the GitHub environments
3. Push to `dev` branch to test the pipeline
4. Verify deployment at dev.fitsync.online
5. Create PR to test preview deployments
6. Set up production branch protection rules
