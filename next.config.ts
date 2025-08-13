import type { NextConfig } from 'next';

export default {
	experimental: {
		reactCompiler: true,
		ppr: 'incremental',
		typedRoutes: true,
	},
	images: {
		unoptimized: true,
	},
	transpilePackages: ['@uiw/react-md-editor'],
} satisfies NextConfig;
