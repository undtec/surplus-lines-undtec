# Publishing Guide - n8n Custom Node

## Publishing to npm Registry

### Prerequisites

1. **npm Account**: Create account at https://www.npmjs.com/signup
2. **npm CLI**: Ensure npm is installed (`npm --version`)
3. **Package Ready**: Node tested and working locally

---

## Step 1: Prepare Package for Publishing

### 1.1 Update package.json

Check current version and metadata:

```bash
cd "/Volumes/Work/Git/underwriters/SurplusLines - 28Jan/n8n-nodes/n8n-nodes-surpluslines"
cat package.json
```

Key fields to verify:

```json
{
  "name": "n8n-nodes-surplus-lines-undtec",
  "version": "1.1.0",
  "description": "n8n node for Surplus Lines Tax API with automatic fallback",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "surplus lines",
    "tax calculator",
    "insurance",
    "underwriters"
  ],
  "license": "MIT",
  "homepage": "https://www.surpluslinesapi.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/undtec/surplus-lines-undtec.git"
  },
  "author": {
    "name": "Underwriters Technologies",
    "email": "support@undtec.com"
  },
  "main": "index.js",
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "credentials/SurplusLinesApi.credentials.js"
    ],
    "nodes": [
      "nodes/SurplusLinesApi/SurplusLinesApi.node.js"
    ]
  }
}
```

### 1.2 Build the Package

```bash
cd "/Volumes/Work/Git/underwriters/SurplusLines - 28Jan/n8n-nodes/n8n-nodes-surpluslines"

# Clean previous builds
rm -rf dist/

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Verify build output
ls -la dist/
```

Expected output in `dist/`:
- `nodes/SurplusLinesApi/SurplusLinesApi.node.js`
- `credentials/SurplusLinesApi.credentials.js`

### 1.3 Test Local Build

```bash
# Test the built files
node -e "require('./dist/nodes/SurplusLinesApi/SurplusLinesApi.node.js')"

# Should not throw errors
```

---

## Step 2: Create npm Account (If Needed)

### 2.1 Sign Up

Visit: https://www.npmjs.com/signup

Or via CLI:
```bash
npm adduser
```

### 2.2 Login

```bash
npm login
```

Enter:
- Username
- Password
- Email
- One-time password (if 2FA enabled)

### 2.3 Verify Login

```bash
npm whoami
```

Should show your npm username.

---

## Step 3: Prepare for First Publish

### 3.1 Check Package Name Availability

```bash
npm view n8n-nodes-surplus-lines-undtec
```

If returns 404 or "npm ERR! code E404" → Name is available ✅

If returns package info → Name is taken ❌ (need to change name)

### 3.2 Create .npmignore (Optional)

Create `.npmignore` to exclude unnecessary files:

```bash
cat > .npmignore << 'EOF'
# Source files
*.ts
tsconfig.json

# Development files
.git
.gitignore
node_modules/
*.log

# Documentation (keep README.md)
CHANGELOG_V2.md
UPGRADE_SUMMARY.md
WORKFLOW_MAPPING.md
TESTING_GUIDE.md
PUBLISHING_GUIDE.md

# Testing
quick-test.sh
*.test.js

# Backup
OLD/
*.backup

# OS files
.DS_Store
Thumbs.db
EOF
```

### 3.3 Test Package Contents

See what will be published:

```bash
npm pack --dry-run
```

Review the file list to ensure only necessary files are included.

---

## Step 4: Publish to npm

### 4.1 First Time Publish

```bash
cd "/Volumes/Work/Git/underwriters/SurplusLines - 28Jan/n8n-nodes/n8n-nodes-surpluslines"

# Publish as public package
npm publish --access public
```

**Output should show:**
```
+ n8n-nodes-surplus-lines-undtec@1.1.0
```

### 4.2 Verify Publication

Check on npm:
```bash
npm view n8n-nodes-surplus-lines-undtec
```

Or visit: https://www.npmjs.com/package/n8n-nodes-surplus-lines-undtec

---

## Step 5: Tag in Git (Optional but Recommended)

```bash
cd "/Volumes/Work/Git/underwriters/SurplusLines - 28Jan/n8n-nodes/n8n-nodes-surpluslines"

# Create git tag
git tag -a v1.1.0 -m "Release v1.1.0 - Unified SLAPI endpoints with automatic fallback"

# Push tag to remote
git push origin v1.1.0
```

---

## Step 6: Submit to n8n Community Nodes

### 6.1 Requirements

n8n requires community nodes to:
- ✅ Be published on npm
- ✅ Have name starting with `n8n-nodes-`
- ✅ Have `n8n-community-node-package` in keywords
- ✅ Follow n8n node conventions
- ✅ Include README with usage instructions

### 6.2 Submit to n8n

1. Go to n8n community nodes repository:
   https://github.com/n8n-io/n8n/tree/master/packages/nodes-base

2. Create issue or PR to add your node to the community list

3. Fill out submission form with:
   - Package name: `n8n-nodes-surplus-lines-undtec`
   - npm URL: https://www.npmjs.com/package/n8n-nodes-surplus-lines-undtec
   - Description: "Calculate surplus lines taxes for all U.S. states with automatic fallback"
   - Category: Finance/Insurance

---

## Step 7: Install and Test Published Package

### 7.1 Install in Clean n8n Instance

```bash
# In n8n installation directory
npm install n8n-nodes-surplus-lines-undtec

# Restart n8n
pm2 restart n8n
# or
docker restart n8n
```

### 7.2 Verify Installation

1. Open n8n web UI
2. Create new workflow
3. Search for "Surplus Lines API" in node palette
4. Node should appear with icon
5. Test creating Tax and Rate operations

---

## Step 8: Future Updates

### 8.1 Update Version

When making changes:

```bash
# Update version in package.json
npm version patch   # 1.1.0 -> 1.1.1 (bug fixes)
npm version minor   # 1.1.0 -> 1.2.0 (new features)
npm version major   # 1.1.0 -> 2.0.0 (breaking changes)
```

### 8.2 Rebuild and Republish

```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Publish update
npm publish
```

### 8.3 Update Git Tag

```bash
# Create new tag
git tag -a v1.1.1 -m "Release v1.1.1 - Bug fixes"
git push origin v1.1.1
```

---

## Publishing Checklist

Before publishing, verify:

- [ ] Version number updated in package.json
- [ ] All TypeScript files compile without errors
- [ ] dist/ folder contains built .js files
- [ ] README.md is complete and accurate
- [ ] LICENSE file is present
- [ ] package.json metadata is correct (keywords, description, repository)
- [ ] Tested locally in n8n
- [ ] No sensitive data in code (API keys, passwords)
- [ ] .npmignore configured to exclude unnecessary files
- [ ] npm account logged in
- [ ] Package name available on npm
- [ ] Git repository up to date

---

## Troubleshooting

### Error: Package name already exists

**Solution:** Change package name in package.json:
```json
{
  "name": "n8n-nodes-surplus-lines-yourcompany"
}
```

### Error: You must be logged in to publish

**Solution:**
```bash
npm login
```

### Error: TypeScript compilation fails

**Solution:**
```bash
npm install
npm run build
# Fix any TypeScript errors shown
```

### Error: Module not found after install

**Solution:** Check n8n configuration in package.json matches dist/ structure

### Node doesn't appear in n8n

**Solution:**
1. Verify package.json has `n8n-community-node-package` keyword
2. Restart n8n completely
3. Check n8n logs for errors
4. Verify dist/ folder structure matches n8n expectations

---

## npm Commands Reference

```bash
# Login to npm
npm login

# Check who you're logged in as
npm whoami

# Check if package name is available
npm view PACKAGE_NAME

# See what will be published
npm pack --dry-run

# Publish public package
npm publish --access public

# Update package version
npm version patch|minor|major

# Unpublish (within 72 hours only)
npm unpublish PACKAGE_NAME@VERSION

# Deprecate a version
npm deprecate PACKAGE_NAME@VERSION "reason"
```

---

## Package URLs After Publishing

- **npm Package:** https://www.npmjs.com/package/n8n-nodes-surplus-lines-undtec
- **Documentation:** https://docs.surpluslinesapi.com
- **Support:** support@undtec.com
- **GitHub:** (Add your repository URL)

---

## Marketing the Node

After publishing:

1. **Update Website**
   - Add to integrations page
   - Link to npm package
   - Provide installation instructions

2. **Announce on Social Media**
   - Twitter/X
   - LinkedIn
   - n8n Community Forum

3. **Create Documentation**
   - Setup guide
   - Video tutorial
   - Example workflows

4. **Monitor Usage**
   - npm download stats
   - GitHub stars/issues
   - Support requests

---

## Support

For publishing help:
- npm docs: https://docs.npmjs.com/
- n8n docs: https://docs.n8n.io/integrations/creating-nodes/
- n8n community: https://community.n8n.io/

---

## Version History

- **v1.1.0** (2026-02-12) - Initial release with unified SLAPI endpoints and automatic fallback
- Future versions will be documented here

---

**Status:** Ready to publish! ✅

Follow the steps above to publish your node to npm and the n8n community.
