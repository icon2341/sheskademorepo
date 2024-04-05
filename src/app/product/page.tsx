'use client'


import styles from './ProductPage.module.css';
import React from "react";
import {useTrail, a} from "react-spring";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Image from "next/image";

function ProductPage() {
	const router = useRouter()

	return (
		<div className={"flex-col flex"}>
			{/*DESKTOP NAV BAR*/}
			<div className={"flex-row flex flex-auto full justify-between p-3"}>
				<div className={"font-logo text-5xl text-primary font-black"}>S</div>
				{/*<div className={styles.navLinksContainer}>*/}
				{/*    /!*<h2 onClick={() =>  {navigate('/product')}} className={styles.navigationLink}>Coming Summer 2023</h2>*!/*/}
				{/*    /!*<h2 className={styles.navigationLink}>Careers</h2>*!/*/}
				{/*    /!*<h2 className={styles.navigationLink}>Blog</h2>*!/*/}
				{/*    /!*<h2 className={styles.navigationLink}>Support</h2>*!/*/}
				{/*</div>*/}
				<div className={"flex-row flex"}>
					<Button className={"m-1"} variant={'outline'} onClick={() => router.push('/signup')}>Sign Up</Button>
					<Button className={"m-1"} onClick={() => router.push('/signin')}>Log in</Button>
				</div>
			</div>

			{/*Hero*/}
			<div className={"flex flex-col justify-center items-center"}>
				<div className={"flex flex-col items-center w-11/12 md:w-50"}>
					<div className={"md:block mt-32 lg:mt-64"}>
						<h1 className={`font-sans font-black text-2xl mb-10 md:text-5xl xl:text-6xl text-center text-black`}>Supercharge
							Event <br/> Funding.</h1>
					</div>
					<h2 className={"text-center font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl w-75 mb-10 max-w-3xl"}>
						A comprehensive platform designed to seamlessly connect with your guests, from financial transactions to open communication.
					</h2>

					<div className={"flex flex-row justify-center w-50"}>
						<Button className={"m-2 w-50"} size={"lg"} onClick={() => router.push('/signup')}>Sign Up</Button>
						<Button className={"m-2 w-50"} variant={'outline'} size={"lg"} onClick={() => router.push('/signin')}>Log in</Button>
					</div>
				</div>
			</div>

			{/*Features*/}

			<section className={"md:mt-96"}>
				<div className={"flex flex-col md:p-10 p-5"}>
					<div className={"flex flex-col md:flex-row align-middle justify-center radi"}>
						<div className={"bg-slate-900 rounded-lg px-10 py-20"}>
							<div className={"flex flex-col md:flex-row grow mx-30 justify-center md:align-middle"}>
								<div className={"md:w-1/4"}>
									<Image src={"/images/Crowdsourcing.png"} alt={"Many doors with glowing balls exiting them"} width={500} height={300}></Image>
								</div>
								<div className={"flex flex-col md:ml-20 md:mt-0 mt-10 justify-center"}>
									<h1 className={"text-3xl text-white font-sans font-black max-w-sm"}>Guest Crowdsourced
										Funding.</h1>
									<h2 className={"text-xl text-white max-w-md mt-3 font-sans font-extralight"}>Sheska offers hosts a seamless way to raise funds
										while enabling guests to fulfill their desires for gift giving, philanthropy, or community-driven event
										participation</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className={"md:mt-20"}>
				<div className={"flex flex-col md:p-10 p-5"}>
					<div className={"flex flex-col md:flex-row align-middle justify-center radi"}>
						<div className={"bg-teal-500 rounded-lg px-10 py-20"}>
							<div className={"flex flex-col md:flex-row grow mx-30 justify-center md:align-middle"}>
								<div className={"md:w-1/4"}>
									<Image src={"/images/Crowdsourcing.png"} alt={"Many doors with glowing balls exiting them"}
									width={500} height={300}></Image>
								</div>
								<div className={"flex flex-col md:ml-20 md:mt-0 mt-10 justify-center"}>
									<h1 className={"text-3xl text-white font-sans font-black max-w-sm"}>Make your guests feel heard.</h1>
									<h2 className={"text-xl text-white max-w-md mt-3 font-sans font-extralight"}>With Sheska, managing guests from invitation to
										convocation is extremely simple. We cover everything from seating, RSVPs, Plus1s, At-the-door Ticketing, and
										Dining Plans</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className={"md:mt-20"}>
				<div className={"flex flex-col md:p-10 p-5"}>
					<div className={"flex flex-col md:flex-row align-middle justify-center radi"}>
						<div className={"bg-slate-900 rounded-lg px-10 py-20"}>
							<div className={"flex flex-col md:flex-row grow mx-30 justify-center md:align-middle"}>
								<div className={"md:w-1/4"}>
									<Image src={"/images/Crowdsourcing.png"} alt={"Many doors with glowing balls exiting them"} width={500} height={300}></Image>
								</div>
								<div className={"flex flex-col md:ml-20 md:mt-0 mt-10 justify-center"}>
									<h1 className={"text-3xl text-white font-sans font-black max-w-sm"}>Ensure your guests can hear you.</h1>
									<h2 className={"text-xl text-white max-w-md mt-3 font-sans font-extralight"}>Sheskas Robust Comms platform ensures guests hear the important information right when you need them to. With live announcements and customizable info panels.</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>


		</div>
	);
}

export default ProductPage;