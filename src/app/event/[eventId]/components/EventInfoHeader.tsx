'use client'

import {motion} from 'framer-motion'
import {Event} from '../page'

export default function EventInfoHeader(props: { event: Event }) {
	const container = {
		hidden: {opacity: 1, scale: 0},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				delayChildren: 0.7,
				staggerChildren: 0.2
			}
		}
	};

	const item = {
		hidden: {y: 20, opacity: 0},
		visible: {
			y: 0,
			opacity: 1
		}
	};

	return (
		<div
			className={
				"w-11/12 mx-auto text-center rounded-lg bg-white p-6 mt-12"
			}>
			<motion.div
				variants={container}
				initial="hidden"
				animate="visible"
				className={"font-extralight"}
			>
				<motion.div variants={item} className={"text-4xl font-bold mb-5"}>Welcome to {props.event.title}</motion.div>
				<motion.div variants={item} className={'text-2xl mb-5'}>{props.event.description}</motion.div>
				<motion.div variants={item} className={'text-lg mb-2'}>{props.event.address}</motion.div>
				<motion.div variants={item} className={'text-lg'}>
					{new Date(props.event.event_date).toLocaleDateString("en-US", {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</motion.div>
			</motion.div>
		</div>
	)
}