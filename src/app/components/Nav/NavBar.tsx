'use client'

import styles from './NavBar.module.scss';
import {useState} from "react";
import {useClerk} from "@clerk/clerk-react";

import {NavButton} from "@/app/components/Nav/components/NavButton";
import {Heart, Home, LogOut, Menu, Settings, Type, Users} from "react-feather";
import {usePathname, useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {Logo} from "@/app/components/Nav/components/logo";
import {AuthBar} from "@/app/components/Nav/components/AuthBar";
import {UserButton} from "@clerk/nextjs";


/**
 * The NavBar component is a sidebar that is displayed on the left side of the screen. It contains buttons that allow the user to navigate to different pages.
 * Will not show up on the excluded Routes
 */
export default function NavBar() {
	//Exclude Navbar on these pages
	const excludedRoutes = ['/product', '/signup', '/signin', '/', '/onboarding', "/event"];
	const pathname = usePathname()
	const shouldDisplayNavBar = !(excludedRoutes.includes("/" + pathname.split('/')[1]) || pathname.includes('/signin') || pathname.includes('/signup'));



	const [isWide, setIsWide] = useState(false)
	const onMouseEnter = () => setIsWide(true);
	const onMouseLeave = () => setIsWide(false);
	const { signOut } = useClerk();
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	if(!shouldDisplayNavBar) return null;

	const variants = {
		open: {width: "185px"},
		closed: {width: "50px"}
	}

	const navVariants = {
		open: {height: '360px'},
		closed: {height: '50px'}
	}
	const item = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1
		}
	};
	const container = {
		hidden: { opacity: 0, visible: "hidden"  },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2
			}
		}
	};

	return (
		<div>
			<div className={"hidden sm:block "}>
				<AuthBar isOpen={isWide}/>
				<nav className={styles.navBar} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
					<motion.div animate={isWide ? "open" : "closed"} variants={variants}
					            className={`flex-col flex-start inline-flex h-screen fixed shadow ${styles.navBar}`}>
						<Logo isOpen={isWide}/>
						<div className={isWide ? styles.buttonContainerWide : styles.buttonContainer}>
							<NavButton icon={Home} text={'Home'} navigateToLocation={'/home'} selected={false} isSidebarOpen={isWide}/>
							<NavButton icon={Heart} text={'Contributions'} navigateToLocation={'/contributions'} selected={false}
							           isSidebarOpen={isWide}/>
							<NavButton icon={Users} text={'Guests'} navigateToLocation={'/guests'} selected={false} isSidebarOpen={isWide}/>
							<NavButton icon={Type} text={'Event'} navigateToLocation={'/eventsettings'} selected={false}
							           isSidebarOpen={isWide}/>
						</div>

						<div className={styles.buttonContainer}>
							<hr className={"w-11/12 mx-auto"}/>
							<NavButton icon={Settings} text={'Account'} navigateToLocation={'/settings'} selected={false} isSidebarOpen={isWide}/>
							<div onClick={() => signOut(() => router.push("/"))}>
								<NavButton icon={LogOut} text={'Signout'} navigateToLocation={undefined} selected={false} isSidebarOpen={isWide}/>
							</div>
						</div>
					</motion.div>
				</nav>
			</div>
			{/*mobile*/}
			<div className={"block sm:hidden fixed w-full bg-white shadow"}>
				<motion.div animate={isOpen ? "open" : "closed"} variants={navVariants}>
					<nav className={"e h-full"}>
						<div className={"m-4 flex-row flex justify-between"}>
							<motion.div
								whileTap={{
									scale: 1.5,
									borderRadius: "100%"
								}}>
								<Menu className={"mt-1"} onClick={() => {
									setIsOpen(!isOpen)
								}}/>
							</motion.div>

							<UserButton/>
						</div>
						<hr className={isOpen ? "w-11/12 mx-auto mb-4" : "hidden"}/>

						<motion.ul variants={container} className={`ml-4 ${isOpen ? "block" : "hidden"}`} animate={isOpen ? "visible" : "hidden"}>
							<motion.li key={1} variants={item}>
								<NavButton icon={Home} text={'Home'} navigateToLocation={'/home'} selected={false} isSidebarOpen={isOpen}/>
							</motion.li>

							<motion.li key={2} variants={item}>
								<NavButton icon={Heart} text={'Contributions'} navigateToLocation={'/contributions'} selected={false}
								           isSidebarOpen={isOpen}/>
							</motion.li>
							<motion.li key={3} variants={item}>
								<NavButton icon={Users} text={'Guests'} navigateToLocation={'/guests'} selected={false} isSidebarOpen={isOpen}/>

							</motion.li>
							<motion.li key={4} variants={item}>
								<NavButton icon={Settings} text={'Account'} navigateToLocation={'/settings'} selected={false} isSidebarOpen={isOpen}/>

							</motion.li>
							<motion.li key={5} variants={item}>
								<NavButton icon={Type} text={'Event'} navigateToLocation={'/eventsettings'}
								           selected={false} isSidebarOpen={isOpen}/>
							</motion.li>
							<motion.li key={6} variants={item}>
								<div onClick={() => signOut(() => router.push("/"))}>
									<NavButton icon={LogOut} text={'Signout'} navigateToLocation={undefined}
									           selected={false} isSidebarOpen={isOpen}/>
								</div>
							</motion.li>

						</motion.ul>

					</nav>
				</motion.div>
			</div>
		</div>


	)
}