# Band of Agents - Hackathon Demo

A beautiful, animated landing page showcasing a multi-agent system with real-time health monitoring, logging, and error injection capabilities. Perfect for hackathon demonstrations and understanding agent orchestration.

![Band of Agents Demo](https://img.shields.io/badge/License-MIT-blue)
![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-Ready-green)

## 🚀 Features

- **Animated Agent Visualization**: Beautiful real-time animation of 6 intelligent agents with wave connection effects
- **Health Monitoring API**: Real-time system health metrics for all agents
- **Comprehensive Logging System**: Full logging with multiple severity levels
- **Error Injection Tool**: Simulate various system errors for testing and demo purposes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **GitHub Pages Compatible**: Deploy instantly without any build process
- **Console-Based API**: Easy access to all APIs through browser console

## 📁 Project Structure

```
band-of-agents/
├── index.html              # Main landing page
├── README.md              # This file
├── styles/
│   └── main.css           # All styling and animations
├── js/
│   ├── api.js             # Core API module (Health, Logs, Errors)
│   ├── agents.js          # Agent visualization and animation
│   └── app.js             # Main application logic and UI handlers
└── .github/
    └── workflows/         # (Optional) GitHub Actions for deployment
```

## 🔧 API Reference

All APIs are available globally as `bandAPI` in the browser console.

### 1. Get System Health
```javascript
const health = bandAPI.getHealth();
```
Returns system health metrics including:
- Overall system status
- Individual agent metrics (CPU, Memory, Tasks)
- System-wide metrics (success rate, response time)

### 2. Get System Logs
```javascript
const logs = bandAPI.getLogs('ALL', 50);
// Filter options: 'ALL', 'INFO', 'WARNING', 'ERROR', 'DEBUG'
```
Returns:
- All system logs with timestamps
- Filtered by severity level
- Customizable limit (default: 50)

### 3. Inject Error
```javascript
const error = bandAPI.injectError();
// Or specific error type: bandAPI.injectError('MEMORY_OVERFLOW');
```
Available error types:
- `AGENT_FAILURE` - Agent crashes
- `MEMORY_OVERFLOW` - Memory threshold exceeded
- `NETWORK_TIMEOUT` - Connection lost
- `TASK_QUEUE_OVERFLOW` - Queue overload
- `DATABASE_ERROR` - DB connection failure
- `AUTHENTICATION_ERROR` - Auth token expired
- `RATE_LIMIT_EXCEEDED` - Rate limit breached
- `CACHE_CORRUPTION` - Cache corruption detected

System automatically recovers after 5 seconds.

### 4. Get Agent Details
```javascript
const agent = bandAPI.getAgentDetails(1);
```
Returns detailed information about a specific agent including:
- Agent metadata
- Current status
- Performance metrics
- Capabilities

### 5. Add Custom Log
```javascript
bandAPI.addLog('Your message', 'INFO', 'YOUR_SOURCE');
// Levels: 'INFO', 'WARNING', 'ERROR', 'DEBUG'
```

### 6. Get System Overview
```javascript
const overview = bandAPI.getSystemOverview();
```
Returns high-level system information and features.

### 7. Clear Logs
```javascript
bandAPI.clearLogs();
```

### 8. Reset System
```javascript
bandAPI.resetSystem();
```
Resets system to initial state and clears all logs.

## 📦 Deployment to GitHub Pages

### Method 1: Direct Upload (Easiest)

1. Create a new GitHub repository named `band-of-agents`
2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/band-of-agents.git
   cd band-of-agents
   ```

3. Copy all files from this project to the repository:
   - `index.html`
   - `styles/` folder
   - `js/` folder
   - `README.md`

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial Band of Agents demo"
   git push origin main
   ```

5. Go to repository settings → Pages
6. Set source to `main` branch, root folder
7. Your site will be live at: `https://YOUR_USERNAME.github.io/band-of-agents`

### Method 2: Using GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

## 🎨 Customization

### Modify Agents
Edit `js/api.js` to customize agents:
```javascript
this.agents = [
    { id: 1, name: 'Your Agent', emoji: '🤖', status: 'running' },
    // Add more...
];
```

### Change Colors
Edit CSS variables in `styles/main.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    --danger: #ef4444;
    /* etc */
}
```

### Add New Error Types
In `js/api.js`, add to the `errorTypes` array in `injectError()` method:
```javascript
{
    type: 'YOUR_ERROR',
    message: 'Your error message',
    severity: 'HIGH',
}
```

## 🎬 Live Demo Usage

1. Open your deployed site
2. Click buttons to:
   - **Check Health**: View all system metrics
   - **View Logs**: See system activity logs
   - **Inject Error**: Simulate system errors
3. Open browser console (F12) for direct API access
4. Try these commands in console:
   ```javascript
   bandAPI.getHealth()
   bandAPI.getLogs()
   bandAPI.injectError('MEMORY_OVERFLOW')
   bandAPI.getAgentDetails(1)
   ```

## 🎯 Animations

The demo includes several animations:

- **Agent Icons**: Pulsing glow effect
- **Connecting Lines**: Wave animation between agents
- **Pulsing Dots**: Data flow visualization
- **Button Feedback**: Click animations
- **Slide In Effects**: Component entrance animations

All animations are GPU-accelerated for smooth 60fps performance.

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 💡 Tips for Hackers

1. **Console Playground**: Open F12 and experiment with the API
2. **Custom Logs**: Add logging to track your agent behavior
3. **Error Scenarios**: Test error handling with injection
4. **Performance**: Monitor health metrics for bottlenecks
5. **Extend**: Fork and add your own agent types and error scenarios

## 🔗 Console Shortcuts

When you open the browser console, you'll see helpful tips. Quick commands:

```javascript
// Get everything
bandAPI.getHealth()
bandAPI.getLogs()
bandAPI.getSystemOverview()

// Monitor agent
bandAPI.getAgentDetails(1)

// Create chaos
bandAPI.injectError()

// Track custom events
bandAPI.addLog('Event happened', 'WARNING', 'MY_APP')
```

## 📝 License

MIT License - Feel free to use for your hackathon!

## 🤝 Contributing

Found a bug or want to add a feature? Create an issue or pull request!

## 🎉 Perfect For

- **Hackathons**: Ready-to-demo multi-agent system
- **Presentations**: Beautiful visuals and real-time monitoring
- **Learning**: Understand agent orchestration and monitoring
- **Prototyping**: Base for building your own multi-agent demo
- **Portfolio**: Show off your system design skills

---

Made with ❤️ for the Band of Agents Hackathon

**Questions?** Check the console output or review the code comments!
