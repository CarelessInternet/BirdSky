// https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-os/use-os.ts

export type UseOSReturnValue = 'Unknown' | 'MacOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'ChromeOS';

function isMacOS(userAgent: string): boolean {
	const macosPattern = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i;

	return macosPattern.test(userAgent);
}

function isIOS(userAgent: string): boolean {
	const iosPattern = /(iPhone)|(iPad)|(iPod)/i;

	return iosPattern.test(userAgent);
}

function isWindows(userAgent: string): boolean {
	const windowsPattern = /(Win32)|(Win64)|(Windows)|(WinCE)/i;

	return windowsPattern.test(userAgent);
}

function isAndroid(userAgent: string): boolean {
	const androidPattern = /Android/i;

	return androidPattern.test(userAgent);
}

function isLinux(userAgent: string): boolean {
	const linuxPattern = /Linux/i;

	return linuxPattern.test(userAgent);
}

function isChromeOS(userAgent: string): boolean {
	const chromePattern = /CrOS/i;
	return chromePattern.test(userAgent);
}

export function getOS(userAgent: Navigator['userAgent']): UseOSReturnValue {
	if (isIOS(userAgent) || (isMacOS(userAgent) && 'ontouchend' in document)) {
		return 'iOS';
	}
	if (isMacOS(userAgent)) {
		return 'MacOS';
	}
	if (isWindows(userAgent)) {
		return 'Windows';
	}
	if (isAndroid(userAgent)) {
		return 'Android';
	}
	if (isLinux(userAgent)) {
		return 'Linux';
	}
	if (isChromeOS(userAgent)) {
		return 'ChromeOS';
	}

	return 'Unknown';
}
