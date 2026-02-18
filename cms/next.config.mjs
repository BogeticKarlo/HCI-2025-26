import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image domains for Next.js image optimization
  images: {
    domains: [
      'cms-bogetickarlos-projects.vercel.app',  // your CMS domain
      'xhebsnwjpfcdttydwuhg.storage.supabase.co', // your Supabase storage bucket
    ],
  },

  // Your existing webpack config
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
