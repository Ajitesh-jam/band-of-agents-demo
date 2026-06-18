export interface DeploymentLogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  source: 'deploy' | 'build' | 'pages' | 'system'
  message: string
}

const DEPLOYMENT_LOGS: DeploymentLogEntry[] = [
  {
    id: 'deploy-1',
    timestamp: new Date().toISOString(),
    level: 'success',
    source: 'deploy',
    message: 'GitHub Pages deployment configured via gh-pages package',
  },
  {
    id: 'deploy-2',
    timestamp: new Date(Date.now() - 60_000).toISOString(),
    level: 'info',
    source: 'build',
    message: 'Next.js static export completed (output: out/)',
  },
  {
    id: 'deploy-3',
    timestamp: new Date(Date.now() - 120_000).toISOString(),
    level: 'info',
    source: 'pages',
    message: 'Site published to gh-pages branch at /band-of-agents-demo/',
  },
  {
    id: 'deploy-4',
    timestamp: new Date(Date.now() - 180_000).toISOString(),
    level: 'info',
    source: 'system',
    message: '5 agents initialized: Atlas, Echo, Nova, Flux, Iris',
  },
]

export function getDeploymentLogs(limit = 50): DeploymentLogEntry[] {
  return DEPLOYMENT_LOGS.slice(0, limit)
}

export function addDeploymentLog(
  message: string,
  level: DeploymentLogEntry['level'] = 'info',
  source: DeploymentLogEntry['source'] = 'system'
) {
  DEPLOYMENT_LOGS.unshift({
    id: `deploy-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
  })
}
