/**
 * Band of Agents - Main Application Module
 * Handles UI interactions and event management
 */

// DOM Elements
let healthBtn;
let logsBtn;
let injectErrorBtn;
let statusPanel;
let statusTitle;
let statusContent;

/**
 * Initialize app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

/**
 * Initialize the application
 */
function initializeApp() {
    healthBtn = document.getElementById('healthBtn');
    logsBtn = document.getElementById('logsBtn');
    injectErrorBtn = document.getElementById('injectErrorBtn');
    statusPanel = document.getElementById('statusPanel');
    statusTitle = document.getElementById('statusTitle');
    statusContent = document.getElementById('statusContent');

    // Log initial messages
    console.log('Band of Agents - Hackathon Demo Initialized');
    console.log('API available at: bandAPI (global object)');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    if (healthBtn) {
        healthBtn.addEventListener('click', onHealthCheck);
    }

    if (logsBtn) {
        logsBtn.addEventListener('click', onViewLogs);
    }

    if (injectErrorBtn) {
        injectErrorBtn.addEventListener('click', onInjectError);
    }

    // Close panel on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && statusPanel.style.display !== 'none') {
            closeStatus();
        }
    });

    // Close panel on background click
    document.addEventListener('click', (e) => {
        if (e.target === statusPanel && statusPanel.style.display !== 'none') {
            closeStatus();
        }
    });
}

/**
 * Handle health check button click
 */
function onHealthCheck() {
    const health = bandAPI.getHealth();
    const overview = bandAPI.getSystemOverview();

    const formattedContent = `
${'-'.repeat(60)}
SYSTEM HEALTH REPORT
${'-'.repeat(60)}

Timestamp: ${health.timestamp}
System Status: ${health.systemStatus}
Uptime: ${health.uptime}s

${'-'.repeat(60)}
OVERVIEW
${'-'.repeat(60)}
Name: ${overview.name}
Version: ${overview.version}
Status: ${overview.status}
System Health: ${overview.systemHealth}%
Active Agents: ${health.metrics.activeAgents}/${health.agents.length}

${'-'.repeat(60)}
AGENT HEALTH METRICS
${'-'.repeat(60)}
${health.agents
    .map(
        (agent) => `
${agent.name.toUpperCase()}
  Status: ${agent.status}
  CPU Usage: ${agent.cpuUsage}%
  Memory Usage: ${agent.memoryUsage}%
  Tasks Completed: ${agent.tasksCompleted}
  Last Update: ${agent.lastUpdate}
`
    )
    .join('')}
${'-'.repeat(60)}
SYSTEM METRICS
${'-'.repeat(60)}
Active Agents: ${health.metrics.activeAgents}
Total Tasks: ${health.metrics.totalTasks}
Success Rate: ${health.metrics.successRate}%
Avg Response Time: ${health.metrics.averageResponseTime}ms

${'-'.repeat(60)}
FEATURES
${'-'.repeat(60)}
${overview.features.map((f) => `  ✓ ${f}`).join('\n')}
`;

    showStatus('System Health Check', formattedContent);
    flashButton(healthBtn);
}

/**
 * Handle view logs button click
 */
function onViewLogs() {
    const logs = bandAPI.getLogs();

    const formattedContent = `
${'-'.repeat(60)}
SYSTEM LOGS
${'-'.repeat(60)}

Total Logs: ${logs.totalLogs}
Filtered Count: ${logs.filteredCount}
Filter: ${logs.filter}
Timestamp: ${logs.timestamp}

${'-'.repeat(60)}
${logs.logs
    .map(
        (log) => `
[${log.timestamp}] [${log.level}] [${log.source}]
${log.message}
`
    )
    .join('---\n')}
${'-'.repeat(60)}

💡 TIP: Open browser console to see real-time logs
    Use: bandAPI.addLog('message', 'level', 'source')
`;

    showStatus('System Logs', formattedContent);
    flashButton(logsBtn);

    // Also log to console
    console.log('=== SYSTEM LOGS ===');
    logs.logs.forEach((log) => {
        const style = `color: ${getLogColor(log.level)}; font-weight: bold;`;
        console.log(`%c[${log.level}] ${log.source}: ${log.message}`, style);
    });
}

/**
 * Handle inject error button click
 */
function onInjectError() {
    const error = bandAPI.injectError();

    const formattedContent = `
${'-'.repeat(60)}
ERROR INJECTION REPORT
${'-'.repeat(60)}

Error Type: ${error.errorType}
Severity: ${error.severity}
Timestamp: ${error.timestamp}

${'-'.repeat(60)}
ERROR MESSAGE
${'-'.repeat(60)}
${error.message}

${'-'.repeat(60)}
STACK TRACE
${'-'.repeat(60)}
${error.stackTrace}

${'-'.repeat(60)}
STATUS
${'-'.repeat(60)}
Error injected successfully. System will attempt recovery in 5 seconds.

Affected Agents: Multiple
Recovery Strategy: Automatic failover and restart
Retry Mechanism: Enabled

${'-'.repeat(60)}
ACTIONS TAKEN
${'-'.repeat(60)}
✓ Error logged to system
✓ Monitoring activated
✓ Recovery protocol initiated
✓ User notification sent
`;

    showStatus('Error Injection Report', formattedContent);
    flashButton(injectErrorBtn);

    // Update button style to indicate error
    injectErrorBtn.style.background = 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)';
    setTimeout(() => {
        injectErrorBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }, 5000);

    // Log error to console
    console.error('%cERROR INJECTED', 'color: red; font-weight: bold; font-size: 14px;');
    console.error(error);
}

/**
 * Show status panel with content
 */
function showStatus(title, content) {
    if (!statusPanel || !statusTitle || !statusContent) return;

    statusTitle.textContent = title;
    statusContent.textContent = content;
    statusPanel.style.display = 'block';

    // Fade in animation
    statusPanel.style.animation = 'none';
    setTimeout(() => {
        statusPanel.style.animation = 'slideUp 0.3s ease-out';
    }, 10);
}

/**
 * Close status panel
 */
function closeStatus() {
    if (statusPanel) {
        statusPanel.style.display = 'none';
    }
}

/**
 * Flash button to provide visual feedback
 */
function flashButton(btn) {
    const originalBg = btn.style.background;
    btn.style.transform = 'scale(0.95)';

    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 50);
}

/**
 * Get log color for console output
 */
function getLogColor(level) {
    const colors = {
        INFO: '#10b981',
        WARNING: '#f59e0b',
        ERROR: '#ef4444',
        DEBUG: '#6366f1',
    };
    return colors[level] || '#cbd5e1';
}

/**
 * API USAGE GUIDE
 * ================
 *
 * The Band of Agents API is available globally as `bandAPI`
 *
 * 1. GET HEALTH:
 *    const health = bandAPI.getHealth();
 *    Returns: System health metrics for all agents
 *
 * 2. GET LOGS:
 *    const logs = bandAPI.getLogs('ALL', 50);
 *    Returns: System logs, optionally filtered by level
 *    Levels: 'ALL', 'INFO', 'WARNING', 'ERROR', 'DEBUG'
 *
 * 3. INJECT ERROR:
 *    const error = bandAPI.injectError();
 *    Returns: Error object with details
 *
 * 4. GET AGENT DETAILS:
 *    const agent = bandAPI.getAgentDetails(1);
 *    Returns: Detailed information about specific agent
 *
 * 5. GET SYSTEM OVERVIEW:
 *    const overview = bandAPI.getSystemOverview();
 *    Returns: High-level system information
 *
 * 6. ADD LOG:
 *    bandAPI.addLog('Your message', 'INFO', 'YOUR_SOURCE');
 *
 * 7. CLEAR LOGS:
 *    bandAPI.clearLogs();
 *
 * 8. RESET SYSTEM:
 *    bandAPI.resetSystem();
 *
 * Open browser console (F12) to try these commands!
 */

// Expose API for easy access in console
console.log(
    `
%c╔═══════════════════════════════════════════════════════╗
║   Band of Agents - Hackathon Demo                      ║
║   Global API available: bandAPI                        ║
║   Try: bandAPI.getHealth()                             ║
║        bandAPI.getLogs()                               ║
║        bandAPI.injectError()                           ║
╚═══════════════════════════════════════════════════════╝`,
    'color: #6366f1; font-weight: bold; font-family: monospace;'
);

// Add helpful console methods
console.log('%cAvailable Commands:', 'color: #10b981; font-weight: bold;');
console.log('%c  bandAPI.getHealth()           - Get system health metrics', 'color: #cbd5e1;');
console.log('%c  bandAPI.getLogs()             - Get system logs', 'color: #cbd5e1;');
console.log('%c  bandAPI.injectError()         - Inject random error', 'color: #cbd5e1;');
console.log('%c  bandAPI.getAgentDetails(id)   - Get agent details', 'color: #cbd5e1;');
console.log('%c  bandAPI.addLog(msg, level)    - Add custom log', 'color: #cbd5e1;');
