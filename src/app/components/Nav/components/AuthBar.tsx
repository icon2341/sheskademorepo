import {UserButton} from "@clerk/nextjs";
import {useUser} from "@clerk/nextjs";
import {LoadingIndicator} from "@/app/components/LoadingUtils/LoadingSecondaryIndicator";

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function AuthBar(props: {isOpen : boolean}) {
	// TODO ADD NOTIFICATION SYSTEM HERE, GREETING, AND NOTIFCATION SHORTAHND ETC WHICH WILL GET DATA FROM API
	const { isSignedIn, user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<div className={"bg-white h-14 fixed w-full"}>
				<div className={"flex flex-row justify-end ml-auto mr-4 align-middle h-full"}>
					<LoadingIndicator/>
				</div>
			</div>
		)
	}


	return (
		<div className={"bg-white h-14 fixed w-full"}>
			<div className={"flex flex-row justify-end ml-auto mr-4 align-middle h-full"}>
				<h2 className={"my-auto mr-4"}>Hi, {user && capitalizeFirstLetter(user.firstName?? "")}</h2>
			  <div className={"h-1/2 my-auto"}>
				  <UserButton/>
			  </div>
		  </div>
	  </div>
  );
}