import { Menu, Search } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
import Link from './Link';
import BirdSky from '../../app/favicon.ico';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { Input } from '~/components/ui/input';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '~/components/ui/navigation-menu';
import Dropdown from './Dropdown';

export default function Component() {
	return (
		<header className="bg-background sticky top-0 z-50 flex w-full justify-center border-b shadow-sm backdrop-blur">
			<div className="container flex h-16 items-center justify-between px-4">
				<NextLink href="/" className="text-foreground flex flex-row items-center space-x-2 text-xl font-bold">
					<Image src={BirdSky} alt="BirdSky Favicon" width={32} height={32} />
					<span>BirdSky</span>
				</NextLink>

				<div className="hidden max-w-2xl flex-1 items-center justify-center space-x-6 md:flex">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/">Posts</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/users">Users</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<div className="relative ml-6">
						<Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
						<Input type="search" placeholder="Search..." className="w-64 pl-8" />
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Dropdown />

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm" className="hover:bg-accent/50 md:hidden">
								<Menu className="size-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="p-6">
							<div className="mt-6 flex flex-col space-y-4">
								<div className="relative">
									<Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
									<Input type="search" placeholder="Search..." className="pl-8" />
								</div>
								<div className="space-y-4 border-t pt-4">
									<Link href="/" sheet>
										Posts
									</Link>
									<Link href="/users" sheet>
										Users
									</Link>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
