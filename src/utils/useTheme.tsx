import { useEffect, useState } from 'react';

export const useTheme = () => {
	const [theme, setTheme] = useState('dark');

	useEffect(() => {
		const darkThemeListener = (e: MediaQueryListEvent) =>
			e.matches && setTheme('dark');
		const lightThemeListener = (e: MediaQueryListEvent) =>
			e.matches && setTheme('light');

		const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
		const mediaLight = window.matchMedia('(prefers-color-scheme: light)');
		mediaDark.addEventListener('change', darkThemeListener);
		mediaLight.addEventListener('change', lightThemeListener);

		if (window.matchMedia('(prefers-color-scheme: light)').matches)
			setTheme('light');

		return () => {
			mediaDark.removeEventListener('change', darkThemeListener);
			mediaLight.removeEventListener('change', lightThemeListener);
		};
	}, []);
	return theme;
};
