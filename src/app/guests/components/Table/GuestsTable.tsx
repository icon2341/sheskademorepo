import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {auth} from "@clerk/nextjs";
import {supabaseClient} from "@/app/api/supabase";
import DeleteGuest from "@/app/guests/components/Table/components/DeleteGuest/DeleteGuest";

async function getData() {
	const {userId, getToken} = await auth();

	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supaClient = await supabaseClient(supabaseAccessToken);
	const {data, error} = await supaClient.from("guests").select("*").eq("organizer_id", userId)

	//TODO ADD ERROR BOUNDARY IN InviteForm.tsx
	if (error) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch transactions')
	}

	return data
}


export default async function GuestsTable() {
	const data = await getData()

	if (data?.length === 0) {
		return (
			<div className={"space-y-8 bg-white p-10 rounded-lg border border-gray-50 w-11/12 mx-auto mt-5"}>
				<h3 className={"text-lg"}>Guest List</h3>
				<p className={"text-center"}>No guests yet! Invite some friends.</p>
			</div>
		)
	}

	return (
		<div className={"space-y-8 bg-white p-2 md:p-10 rounded-lg border border-gray-50 w-11/12  lg:w-8/12/12 mx-auto mt-5"}>
			<h3 className={"text-lg"}>Guest List</h3>
			<Table className={""}>
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>First Name</TableHead>
						<TableHead>Last Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((guest: any) => (
						<TableRow key={guest.id}>
							<TableCell className={"max-w-16 md:max-w-full overflow-x-clip"}>{guest.email}</TableCell>
							<TableCell className="w-[80px] sm:w-auto">{guest.first_name}</TableCell>
							<TableCell className="w-[80px] sm:w-auto">{guest.last_name}</TableCell>
							<TableCell>
								<DeleteGuest id={guest.id}/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)

}