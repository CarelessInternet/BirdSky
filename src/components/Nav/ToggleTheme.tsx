'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, SunMoon } from 'lucide-react';
import {
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
	DropdownMenuItem,
} from '../ui/dropdown-menu';

export default function ToggleTheme() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className="flex items-center justify-start gap-x-1.5 px-2 py-1 text-sm leading-7">
				<SunMoon className="mr-2 size-4" />
				<span>Change Theme</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className="mr-2 size-4" />
						<span>Light</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className="mr-2 size-4" />
						<span>Dark</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('system')}>
						<Monitor className="mr-2 size-4" />
						<span>System</span>
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}
