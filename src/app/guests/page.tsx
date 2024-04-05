import InviteForm from "@/app/guests/components/InviteForm";
import GuestsTable from "@/app/guests/components/Table/GuestsTable";
import {Suspense} from "react";
import GuestsTableLoading from "@/app/guests/components/Table/GuestsTableLoading";

export default function Guests() {
	return (
		<div className={"flex flex-col sm:items-center min-h-screen pt-4 md:p-6 mx-1 md:mx-0"}>
			<div className={"mt-14 md:mt-24"}></div>

			<div className={"flex flex-col items-start sm:w-9/12 xl:w-2/3"}>
				<h1 className={"font-sans font-bold text-4xl mb-3 ml-2"}>Guest Book</h1>
				<p className={"font-roboto mb-2 ml-3 mb-5"}>Manage guests and their needs..</p>

				<InviteForm/>
				<Suspense fallback={<GuestsTableLoading/>}>
					<GuestsTable/>
				</Suspense>
			</div>
		</div>
	)
}