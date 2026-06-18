/**
 * Band of Agents - Agents Animation Module
 * Handles the visual representation and animation of agents
 */

class AgentsAnimationManager {
    constructor() {
        this.agents = bandAPI.agents;
        this.container = document.getElementById('agentsGrid');
        this.canvas = document.getElementById('animationCanvas');
        this.animationFrameId = null;
        this.time = 0;

        this.init();
    }

    /**
     * Initialize agents on the page
     */
    init() {
        this.renderAgents();
        this.startAnimation();
    }

    /**
     * Render agent elements
     */
    renderAgents() {
        this.container.innerHTML = '';

        this.agents.forEach((agent, index) => {
            const agentEl = document.createElement('div');
            agentEl.className = 'agent';
            agentEl.innerHTML = `
                <div class="agent-icon">${agent.emoji}</div>
                <div class="agent-name">${agent.name}</div>
                <div class="agent-status">● Active</div>
            `;

            agentEl.addEventListener('click', () => this.onAgentClick(agent.id));
            agentEl.addEventListener('mouseenter', () => this.onAgentHover(agentEl, true));
            agentEl.addEventListener('mouseleave', () => this.onAgentHover(agentEl, false));

            this.container.appendChild(agentEl);
        });
    }

    /**
     * Handle agent click
     */
    onAgentClick(agentId) {
        const details = bandAPI.getAgentDetails(agentId);
        if (details) {
            showStatus('Agent Details', JSON.stringify(details, null, 2));
        }
    }

    /**
     * Handle agent hover
     */
    onAgentHover(el, isEnter) {
        if (isEnter) {
            el.style.transform = 'translateY(-12px) scale(1.05)';
        } else {
            el.style.transform = 'translateY(0) scale(1)';
        }
    }

    /**
     * Update agent status
     */
    updateAgentStatus(agentId, status) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = status;
            this.renderAgents();
        }
    }

    /**
     * Start continuous animation
     */
    startAnimation() {
        const animate = () => {
            this.time += 0.016; // 60fps
            this.drawConnections();
            this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Draw connection lines between agents
     */
    drawConnections() {
        if (!this.canvas) return;

        const rect = this.container.getBoundingClientRect();
        this.canvas.setAttribute('width', window.innerWidth);
        this.canvas.setAttribute('height', window.innerHeight);

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get agent positions
        const agentElements = document.querySelectorAll('.agent');
        const positions = [];

        agentElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            positions.push({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                index: index,
            });
        });

        // Draw lines between adjacent agents
        ctx.strokeStyle = `rgba(99, 102, 241, 0.3)`;
        ctx.lineWidth = 2;

        for (let i = 0; i < positions.length - 1; i++) {
            const p1 = positions[i];
            const p2 = positions[i + 1];

            // Add wave effect
            const waveOffset = Math.sin(this.time * 2 + i) * 10;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(
                (p1.x + p2.x) / 2,
                (p1.y + p2.y) / 2 + waveOffset,
                p2.x,
                p2.y
            );
            ctx.stroke();

            // Draw pulsing dots
            const dotAlpha = 0.5 + Math.sin(this.time * 3 + i * 0.5) * 0.5;
            ctx.fillStyle = `rgba(139, 92, 246, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(
                p1.x + (p2.x - p1.x) * (0.5 + Math.sin(this.time * 2 + i) * 0.2),
                p1.y + (p2.y - p1.y) * (0.5 + Math.sin(this.time * 2 + i) * 0.2),
                4,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Draw circular connections
        if (positions.length > 2) {
            ctx.strokeStyle = `rgba(99, 102, 241, 0.2)`;
            ctx.lineWidth = 1;

            for (let i = 0; i < positions.length; i++) {
                const p1 = positions[i];
                const p2 = positions[(i + 2) % positions.length];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    /**
     * Stop animation
     */
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    /**
     * Trigger agent activity animation
     */
    triggerAgentActivity(agentId) {
        const agents = document.querySelectorAll('.agent');
        agents[agentId - 1]?.classList.add('active');

        setTimeout(() => {
            agents[agentId - 1]?.classList.remove('active');
        }, 1000);
    }
}

// Initialize animation manager when DOM is ready
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AgentsAnimationManager();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (animationManager) {
        animationManager.drawConnections();
    }
});
