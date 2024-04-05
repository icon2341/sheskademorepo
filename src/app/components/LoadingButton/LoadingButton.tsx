'use client';

import {Bars as Loading} from 'react-loader-spinner';
import {useRouter} from 'next/navigation'
import {useState} from "react";

export default function LoadingButton(props: { isLoading: boolean, url: string, className: string, children: any }) {
	const router = useRouter();
	const [hasBeenPressed, setHasBeenPressed] = useState(false);

	return (
		<div className={`${props.isLoading ? `flex flex-row` : 'block'}  justify-center text-center border border-gray-50 text-white p-3 rounded-lg ${props.className} hover:bg-primary/75 transition-all ${props.isLoading ? 'bg-primary/75' : "bg-primary cursor-pointer"} 
		${hasBeenPressed ? 'bg-primary/75' : 'bg-primary cursor-pointer'}`}
		     onClick={() => {
			     console.log('redirecting to', props.url);
			     setHasBeenPressed(true);
			     if (!props.isLoading) router.replace(props.url);
		     }}>
			{props.children}
			<div className={"mx-2 my-auto"}>
				{props.isLoading && <Loading width={20} height={20} color={"white"}/>}
			</div>
		</div>
	)
}