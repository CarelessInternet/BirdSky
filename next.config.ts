import type { NextConfig } from 'next';

export default {
	experimental: {
		reactCompiler: true,
		ppr: 'incremental',
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
		unoptimized: true,
	},
	transpilePackages: ['@uiw/react-md-editor'],
} satisfies NextConfig;
