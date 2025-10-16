import type { NextConfig } from 'next';

export default {
	typedRoutes: true,
	reactCompiler: false,
	experimental: {
		cacheComponents: true,
		turbopackFileSystemCacheForDev: true,
	},
	images: {
		unoptimized: true,
	},
	transpilePackages: ['@uiw/react-md-editor'],
} satisfies NextConfig;
