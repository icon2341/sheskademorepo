'use client'

import React from 'react';
import styles from './NavButton.module.scss';
import {usePathname, useRouter} from "next/navigation";
import {motion} from "framer-motion";

const variants = {
	open: {opacity: 1, display: 'block'},
	closed: {opacity: 0, display: 'none'}

}

/**
 * The NavButton component is a button that is used to navigate to different pages. It is used in the NavBar component.
 */
export function NavButton(props: { icon:any, text: string, navigateToLocation: string | undefined, selected:boolean, isSidebarOpen: boolean}) {
	const pathname = usePathname();
    const color = (pathname.match(props.navigateToLocation ?? '') && props.navigateToLocation) ? 'white' : 'black';
	const router = useRouter()


	return (
        <div className={`${styles.navButton} ${(pathname.match(props.navigateToLocation ?? '') && props.navigateToLocation) ? styles.selectedButton : ''} 
        ${props.isSidebarOpen ? styles.navButtonOpen: ''}`}  onClick={() => {if(props.navigateToLocation) router.push(props.navigateToLocation)}}>
            <div className={styles.iconContainer}>
                <props.icon color={color} size={24}/>
            </div>
	        <motion.div animate={props.isSidebarOpen ? "open" : "closed"} variants={variants}
	        transition={{ease: "easeOut"}}>
		        <h3 className={styles.navButtonText}>{props.text}</h3>
	        </motion.div>
        </div>
	)
}