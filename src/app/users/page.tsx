import Link from 'next/link';
import { NameAndVerifiedBadge } from '~/components/post/Post';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '~/components/ui/table';
import { database } from '~/lib/database/connection';
import { user } from '~/lib/database/schema';
import { getYearMonthDay } from '~/lib/date';

export default async function Page() {
	const users = await database.select().from(user);

	return (
		<main className="mx-auto mt-4 w-full max-w-7xl px-4 py-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Creation Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<Link href={`/users/${user.id}`} className="underline underline-offset-2">
									{user.id}
								</Link>
							</TableCell>
							<TableCell>
								<span className="inline-flex min-w-0 items-center gap-x-1">
									<NameAndVerifiedBadge author={user} />
								</span>
							</TableCell>
							<TableCell suppressHydrationWarning>{getYearMonthDay(user.createdAt)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
