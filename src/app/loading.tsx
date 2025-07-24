import Image from 'next/image';
import BirdSky from '../../public/birdsky.png';

export default async function Page() {
	return (
		<main className="flex flex-1 items-center justify-center">
			<Image src={BirdSky} alt="BirdSky Favicon" width={256} height={256} className="animate-bounce" />
		</main>
	);
}
