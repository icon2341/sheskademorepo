'use client'
import {UserProfile} from "@clerk/nextjs";
import {DollarSign, X} from "react-feather";
import {useRouter} from "next/navigation";

function CustomProfilePage() {
	return (
		<div>
			<h1 className={"text-3xl font-bold mt-1"}>Banking Integration</h1>
			<h2 className={"text-md mt-2"}>Configure your stripe integration so that Sheska can deliver payouts.</h2>

		</div>
	)
}

export default  function Settings() {

	const router = useRouter()

	return (
		<div className={"ml-1  md:ml-60"}>
			<div className={"md:pt-20"}>
				<div className={"absolute right-5 top-5 sm:right-20 z-20 md:hidden"}>
					<X onClick={() => {router.push("/home")}}/>
				</div>
				<UserProfile path={ "/settings"} routing={"path"} >
					<UserProfile.Page label="Banking" labelIcon={<DollarSign className={"-ml-1 -mt-1"}/>} url="banking-integration">
						<CustomProfilePage/>
					</UserProfile.Page>
				</UserProfile>
			</div>
		</div>
	)
}