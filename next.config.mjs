const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] || 'band-of-agents-demo'
const basePath = isGithubPages ? `/${repoName}` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
