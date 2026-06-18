/**
 * Band of Agents - API Module
 * Handles all system operations: health checks, logs, and error injection
 */

class BandOfAgentsAPI {
    constructor() {
        this.agents = [
            { id: 1, name: 'Agent Alpha', emoji: '🤖', status: 'running' },
            { id: 2, name: 'Agent Beta', emoji: '🔮', status: 'running' },
            { id: 3, name: 'Agent Gamma', emoji: '⚡', status: 'running' },
            { id: 4, name: 'Agent Delta', emoji: '🎯', status: 'running' },
            { id: 5, name: 'Agent Epsilon', emoji: '🌟', status: 'running' },
            { id: 6, name: 'Agent Zeta', emoji: '🚀', status: 'running' },
        ];

        this.logs = [];
        this.errorState = false;
        this.errorMessage = null;

        // Initialize logs
        this.addLog('System initialized', 'INFO', 'SYSTEM');
        this.addLog('All agents loaded successfully', 'INFO', 'SYSTEM');
        this.addLog('Band of Agents hackathon demo started', 'INFO', 'SYSTEM');
    }

    /**
     * Fetch health status of all agents
     * Returns health metrics for each agent
     */
    getHealth() {
        const health = {
            timestamp: new Date().toISOString(),
            systemStatus: this.errorState ? 'ERROR' : 'HEALTHY',
            uptime: Math.floor(performance.now() / 1000),
            agents: this.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                status: this.errorState ? 'error' : 'active',
                cpuUsage: Math.floor(Math.random() * 80) + 10,
                memoryUsage: Math.floor(Math.random() * 70) + 20,
                tasksCompleted: Math.floor(Math.random() * 1000),
                lastUpdate: new Date().toISOString(),
            })),
            metrics: {
                activeAgents: this.errorState ? 0 : this.agents.length,
                totalTasks: Math.floor(Math.random() * 5000) + 1000,
                successRate: this.errorState ? 65 : 99.8,
                averageResponseTime: Math.floor(Math.random() * 100) + 50,
            },
        };

        this.addLog('Health check performed', 'INFO', 'API');

        if (this.errorState) {
            this.addLog(`⚠️ System error detected: ${this.errorMessage}`, 'ERROR', 'SYSTEM');
        }

        return health;
    }

    /**
     * Fetch current system logs
     * Returns filtered and formatted logs
     */
    getLogs(filter = 'ALL', limit = 50) {
        let filtered = this.logs;

        if (filter !== 'ALL') {
            filtered = this.logs.filter(log => log.level === filter);
        }

        // Get most recent logs first
        const recent = filtered.reverse().slice(0, limit);

        return {
            timestamp: new Date().toISOString(),
            totalLogs: this.logs.length,
            filteredCount: filtered.length,
            filter: filter,
            logs: recent,
        };
    }

    /**
     * Inject various types of errors into the system
     * For testing and demonstration purposes
     */
    injectError(errorType = 'random') {
        const errorTypes = [
            {
                type: 'AGENT_FAILURE',
                message: 'Agent ' + this.agents[Math.floor(Math.random() * this.agents.length)].name + ' encountered a critical failure',
                severity: 'HIGH',
            },
            {
                type: 'MEMORY_OVERFLOW',
                message: 'Memory usage exceeded threshold (94.3%)',
                severity: 'CRITICAL',
            },
            {
                type: 'NETWORK_TIMEOUT',
                message: 'Network connection lost for Agent ' + this.agents[Math.floor(Math.random() * this.agents.length)].name,
                severity: 'HIGH',
            },
            {
                type: 'TASK_QUEUE_OVERFLOW',
                message: 'Task queue overflow detected - 2345 pending tasks',
                severity: 'HIGH',
            },
            {
                type: 'DATABASE_ERROR',
                message: 'Failed to connect to database: Connection timeout',
                severity: 'CRITICAL',
            },
            {
                type: 'AUTHENTICATION_ERROR',
                message: 'Authentication token expired for Agent Delta',
                severity: 'MEDIUM',
            },
            {
                type: 'RATE_LIMIT_EXCEEDED',
                message: 'API rate limit exceeded - 10000 requests/min threshold breached',
                severity: 'MEDIUM',
            },
            {
                type: 'CACHE_CORRUPTION',
                message: 'Cache corruption detected in Agent Zeta memory module',
                severity: 'MEDIUM',
            },
        ];

        let error = errorTypes[Math.floor(Math.random() * errorTypes.length)];

        if (errorType !== 'random' && errorTypes.find(e => e.type === errorType)) {
            error = errorTypes.find(e => e.type === errorType);
        }

        this.errorState = true;
        this.errorMessage = error.message;

        const errorLog = {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            source: error.type,
            message: error.message,
            severity: error.severity,
            errorType: error.type,
            stackTrace: this.generateStackTrace(),
        };

        this.addLog(error.message, 'ERROR', error.type);
        this.addLog(`Error injection completed - Type: ${error.type}`, 'WARNING', 'API');

        // Auto-recover after 5 seconds for demo purposes
        setTimeout(() => {
            this.recoverFromError();
        }, 5000);

        return errorLog;
    }

    /**
     * Recover from injected error
     */
    recoverFromError() {
        this.errorState = false;
        this.errorMessage = null;
        this.addLog('System recovered from error', 'INFO', 'SYSTEM');
        this.addLog('All agents back to normal operation', 'INFO', 'SYSTEM');
    }

    /**
     * Internal method to add logs
     */
    addLog(message, level = 'INFO', source = 'APP') {
        const log = {
            timestamp: new Date().toISOString(),
            level: level,
            source: source,
            message: message,
        };

        this.logs.push(log);

        // Keep only last 500 logs to prevent memory issues
        if (this.logs.length > 500) {
            this.logs.shift();
        }

        return log;
    }

    /**
     * Generate a mock stack trace
     */
    generateStackTrace() {
        const traces = [
            'at BandOfAgentsAPI.injectError (api.js:78)\n  at onErrorClick (app.js:145)\n  at HTMLButtonElement.onclick (index.html:52)',
            'at Agent.execute (agent.js:234)\n  at Scheduler.process (scheduler.js:89)\n  at EventLoop.tick (events.js:42)',
            'at DatabaseConnection.query (db.js:156)\n  at Repository.find (repository.js:78)\n  at Service.getData (service.js:45)',
            'at NetworkHandler.request (network.js:203)\n  at APIClient.fetch (client.js:67)\n  at Controller.handler (controller.js:112)',
        ];

        return traces[Math.floor(Math.random() * traces.length)];
    }

    /**
     * Get detailed agent information
     */
    getAgentDetails(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) return null;

        return {
            id: agent.id,
            name: agent.name,
            emoji: agent.emoji,
            status: this.errorState ? 'error' : 'active',
            uptime: Math.floor(Math.random() * 1000000),
            version: '1.2.3',
            capabilities: ['Task Processing', 'Data Analysis', 'Pattern Recognition', 'Decision Making'],
            performance: {
                tasksCompleted: Math.floor(Math.random() * 5000),
                successRate: this.errorState ? 72 : 99.2,
                averageTaskTime: Math.floor(Math.random() * 500) + 100,
            },
        };
    }

    /**
     * Get system overview
     */
    getSystemOverview() {
        return {
            timestamp: new Date().toISOString(),
            name: 'Band of Agents Hackathon Demo',
            version: '1.0.0',
            status: this.errorState ? 'DEGRADED' : 'OPERATIONAL',
            uptime: Math.floor(performance.now() / 1000),
            agentsCount: this.agents.length,
            logsCount: this.logs.length,
            systemHealth: this.errorState ? 45 : 98,
            features: [
                'Multi-Agent Coordination',
                'Real-time Monitoring',
                'Error Injection',
                'Log Management',
                'Health Tracking',
            ],
        };
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        this.addLog('Logs cleared by user', 'INFO', 'SYSTEM');
        return { success: true, message: 'Logs cleared' };
    }

    /**
     * Reset system to initial state
     */
    resetSystem() {
        this.errorState = false;
        this.errorMessage = null;
        this.logs = [];
        this.addLog('System reset', 'INFO', 'SYSTEM');
        this.addLog('All agents loaded successfully', 'INFO', 'SYSTEM');
        return { success: true, message: 'System reset' };
    }
}

// Create global API instance
const bandAPI = new BandOfAgentsAPI();
