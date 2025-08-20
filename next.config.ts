import type { NextConfig } from 'next';

export default {
	typedRoutes: true,
	experimental: {
		reactCompiler: true,
		ppr: 'incremental',
	},
	images: {
		unoptimized: true,
	},
	transpilePackages: ['@uiw/react-md-editor'],
} satisfies NextConfig;
