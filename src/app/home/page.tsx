'use client'

import {UserButton, useUser} from "@clerk/nextjs";
import {motion} from "framer-motion";
import * as React from "react";
import {useRouter} from "next/navigation";
const variants = {
	isLoaded: {opacity: 1},
	isNotLoaded: {opacity: 0}

}

export default function Home() {
	const { isSignedIn, user, isLoaded } = useUser();
	const router = useRouter();

	return (
		<div className={"flex flex-col justify-center items-center min-h-screen h-6/12"}>
			<motion.div
				className="box"
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				transition={{delay: 0.3, duration: 0.5, ease: "easeIn"}}>
				<h2 className={"md:ml-0 text-2xl lg:text-4xl lg:mb-20 mb-10"}>
					Hi, {user && user.firstName}, {"Let's get Started"}
				</h2>
			</motion.div>
			<div className={"flex flex-col md:flex-row md:ml-0 w-9/12 md:w-7/12 h-4/5 align-middle gap-2"}>
				<div className={"bg-white border-2 rounded-2xl  lg:w-6/12 p-5 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"}
				     onClick={() => {
					     router.push("/contributions")
				     }}>
					<h1 className={"text-2xl  lg:text-4xl font-roboto"}>Contributions</h1>
					<h2 className={"text-1xl lg:text-2xl font-roboto  mt-5 lg:mt-10"}>Manage Guest contributions and labeling so your guests are
						informed.</h2>
				</div>
				{/*guests card*/}
				<div className={"bg-white border-2 rounded-2xl lg:w-6/12 p-5 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"}
				     onClick={() => {
					     router.push("/guests")
				     }}>
					<h1 className={"text-2xl  lg:text-4xl font-roboto"}>Guests</h1>
					<h2 className={"text-1xl lg:text-2xl font-roboto  mt-5 lg:mt-10"}>View and manage guests, dining, seating, and invitations.</h2>
				</div>
			</div>
		</div>
	)
}