import {motion} from "framer-motion";
import styles from "@/app/components/Nav/components/NavButton.module.scss";
import React from "react";

const variants = {
	open: {opacity: 1, display: 'block'},
	closed: {opacity: 0, display: 'none'}

}

export function Logo(props: {isOpen : boolean}) {
	return (
			<div className={"flex flex-row mx-3 pt-2"}>
				<h1 className={"font-logo font-black text-5xl inline text-primary"}>S</h1>
				<motion.div animate={props.isOpen ? "open" : "closed"} variants={variants}
				            transition={{ease: "easeOut"}}>
					<h1 className={"font-logo font-black text-5xl inline text-primary"}>heska</h1>
				</motion.div>
			</div>
	)
}