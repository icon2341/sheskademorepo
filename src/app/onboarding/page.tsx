"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import Image from "next/image";
import sheskalogo from "/public/images/TextLogo.webp";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"




export default function OnboardingComponent() {
	const [error, setError] = React.useState("");
	const {user} = useUser();
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const res = await completeOnboarding(formData);
		if (res?.message) {
			await user?.reload();
			router.push("/home");
		}
		if (res?.error) {
			setError(res?.error);
			alert(res?.error)
		}
	};
	return (
		<div>
			<div className={"flex flex-col h-full w-full align-middle justify-between"}>
				<Image src={sheskalogo} alt={"Sheska"} className={"w-48 lg:w-80 m-auto"}/>
				<motion.div
					className="box"
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					transition={{delay: 0.1, duration: 0.5, ease: "easeIn"}}>
					<h2 className={"mx-auto px-36font-sans text-center text-sm max-w-80 lg:text-4xl lg:max-w-2xl mt-64 text-primary"}>Welcome To
						Sheska,
						In the future we will ask you important questions here to customize your experience.</h2>
				</motion.div>
				<form action={handleSubmit} className={"max-w-36 mx-auto m-20"}>
					<div >
						<Button variant={"default"}>{`Let's get started`}</Button>
					</div>
				</form>


			</div>


			{/*<form action={handleSubmit}>*/}
			{/*	<div>*/}
			{/*		<label>Application Name</label>*/}
			{/*		<p>Enter the name of your application.</p>*/}
			{/*		<input type="text" name="applicationName" required/>*/}
			{/*	</div>*/}

			{/*	<div>*/}
			{/*		<label>Application Type</label>*/}
			{/*		<p>Describe the type of your application.</p>*/}
			{/*		<input type="text" name="applicationType" required/>*/}
			{/*	</div>*/}
			{/*	{error && <p className="text-red-600">Error: {error}</p>}*/}
			{/*	<button type="submit">Submit</button>*/}
			{/*</form>*/}
		</div>
	);
}