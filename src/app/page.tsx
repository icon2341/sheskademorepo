'use client'

import {Button} from "@/components/ui/button"
import {useRouter} from 'next/navigation'

export default function Home() {

	const router = useRouter()

	return (
		<main className="">
			<video className={"h-full w-full absolute object-cover -z-50"} playsInline={true} autoPlay={true} loop={true} muted={true}
			       src={"/images/SheskaLandingVideo.mp4"}>
			</video>
			<section className={""}>
				<div className={"w-full flex flex-row z-20 justify-between p-2"}>
					<h1 className={"font-logo font-black text-5xl text-white m-2"}>
						S
					</h1>
					<Button className={"font-black m-2"} onClick={() => router.push('/product')}>Learn More</Button>

					<div className={"flex-row"}>
						<Button variant={"secondary"} className={'m-2'} onClick={() => router.push('/signup')}>Sign Up</Button>
						<Button onClick={() => router.push('/signin')}>Log In</Button>
					</div>
				</div>

				<div className={"absolute top-1/2 w-full flex-col justify-center align-middle"}>
					<h1 className={"font-logo font-black text-8xl text-center text-white"}>Sheska</h1>
					<h2 className={"font-sans font-extralight text-3xl text-center text-white"}>
						Memories are made together
					</h2>
				</div>

			</section>
		</main>
);
}
