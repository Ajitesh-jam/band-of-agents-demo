# Quick Setup Guide - Band of Agents Demo

## 🚀 Deploy in 5 Minutes

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `band-of-agents` (or any name you prefer)
3. Choose "Public" (required for GitHub Pages)
4. Click "Create repository"

### Step 2: Get the Files

**Option A: Direct Download**
1. Download the source files from this demo
2. Extract to a folder

**Option B: Clone & Copy**
```bash
git clone https://github.com/YOUR_USERNAME/band-of-agents.git
cd band-of-agents
```

### Step 3: Add Files to Repository

1. Copy these files into your repository folder:
   ```
   index.html
   README.md
   SETUP.md
   styles/main.css
   js/api.js
   js/agents.js
   js/app.js
   .github/workflows/deploy.yml
   ```

### Step 4: Push to GitHub

```bash
cd band-of-agents
git add .
git commit -m "Initial Band of Agents demo setup"
git push origin main
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 6: Access Your Demo

Your site will be available at:
```
https://YOUR_USERNAME.github.io/band-of-agents
```

It may take 1-2 minutes to deploy. Refresh the page if it shows 404.

---

## 🎮 Try It Out

### In the Browser:

1. Click **Check Health** - See system metrics
2. Click **View Logs** - See activity logs
3. Click **Inject Error** - Simulate a system error
4. Click on any agent card - See agent details

### In the Browser Console (F12):

```javascript
// Get system health
bandAPI.getHealth()

// View logs
bandAPI.getLogs()

// Inject an error
bandAPI.injectError()

// Get specific agent details
bandAPI.getAgentDetails(1)

// Add custom log
bandAPI.addLog('Hello from console!', 'INFO', 'DEMO')

// Get system overview
bandAPI.getSystemOverview()
```

---

## 🔧 Project Structure

```
band-of-agents/
├── index.html                 # Main page (loaded by GitHub Pages)
├── README.md                  # Full documentation
├── SETUP.md                   # This file
├── styles/
│   └── main.css              # All CSS and animations
├── js/
│   ├── api.js                # API Layer (Health, Logs, Errors)
│   ├── agents.js             # Animation & Visualization
│   └── app.js                # UI & Event Handling
└── .github/
    └── workflows/
        └── deploy.yml        # Auto-deployment config
```

---

## 📝 API Quick Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `getHealth()` | Get system metrics | `bandAPI.getHealth()` |
| `getLogs()` | Get activity logs | `bandAPI.getLogs('ALL', 50)` |
| `injectError()` | Simulate errors | `bandAPI.injectError()` |
| `getAgentDetails(id)` | Get agent info | `bandAPI.getAgentDetails(1)` |
| `getSystemOverview()` | Get overview | `bandAPI.getSystemOverview()` |
| `addLog(msg, level, src)` | Add custom log | `bandAPI.addLog('test', 'INFO', 'APP')` |
| `clearLogs()` | Clear all logs | `bandAPI.clearLogs()` |
| `resetSystem()` | Reset system | `bandAPI.resetSystem()` |

---

## 🎨 Customization

### Change Agents
Edit `js/api.js` line ~12:
```javascript
this.agents = [
    { id: 1, name: 'Agent Alpha', emoji: '🤖', status: 'running' },
    // Add or modify agents here
];
```

### Change Colors
Edit `styles/main.css` lines 1-10:
```css
:root {
    --primary: #6366f1;        /* Blue - Change this */
    --secondary: #8b5cf6;      /* Purple - Change this */
    --danger: #ef4444;         /* Red - Change this */
    /* ... etc ... */
}
```

### Change Heading Text
Edit `index.html` line ~26:
```html
<h1 class="title">
    A demo app for <span class="highlight">BAND OF AGENTS</span> hackathon
</h1>
```

---

## ⚡ Troubleshooting

### Site shows 404
- Wait 1-2 minutes for GitHub to deploy
- Check that Settings → Pages shows your branch and folder
- Refresh the page

### No animations showing
- Make sure CSS file is loading (check Network tab in DevTools)
- Try a different browser
- Clear browser cache

### API not working
- Open browser console (F12)
- Check for JavaScript errors (red messages)
- Make sure `js/api.js` is loading
- Try `console.log(bandAPI)` - should show the API object

### Deploy doesn't update
- Make sure you pushed to `main` or `master` branch
- Check GitHub Actions (Actions tab) for deployment status
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📚 Additional Resources

- **GitHub Pages Docs**: https://pages.github.com/
- **HTML/CSS/JS Reference**: https://developer.mozilla.org/
- **Git Guide**: https://git-scm.com/book/

---

## 💡 Tips

1. **Make it yours**: Customize agents, colors, and error types
2. **Use the console**: The browser console is your playground for APIs
3. **Share easily**: Just send the GitHub Pages URL to anyone
4. **Version control**: Every push to GitHub is tracked and can be reverted
5. **No cost**: GitHub Pages hosting is completely free!

---

## 🎯 Next Steps

1. ✅ Deploy the demo (you're doing this now!)
2. ✅ Test the UI and APIs
3. 🔄 Customize for your hackathon needs
4. 🔄 Add more agents or error types
5. 🎉 Show it off to everyone!

---

**Questions?** Check the README.md for full API documentation or browse the code comments!

Good luck with the hackathon! 🚀
