import {supabaseClient} from "@/app/api/supabase";
import {auth} from "@clerk/nextjs";

async function getData() {

	const {userId, getToken} = auth();

	const supabaseAccessToken = await getToken({ template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME! });
	const supabase = await supabaseClient(supabaseAccessToken);
	const { data, error } = await supabase.from("transactions").select("*").eq("user_id", userId).limit(6)



	if (error) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch transactions')
	}

	return data
}

export default async function RecentActivity() {
	// TODO: Implement RecentActivityFetch
	//  fetch last 5 transactions + guest name
	//  Skelton and Suspense Too Format is fine

	const data = await getData()
	console.log("DATA", await data)
	// const data = [
	// 	{
	// 		"guest_name": "John Doe",
	// 		"transaction_type": "Donation",
	// 		"date": "2023-11-21",
	// 		"amount": "$100.50"
	// 	},
	// 	{
	// 		"guest_name": "John Doe",
	// 		"transaction_type": "Donation",
	// 		"date": "2023-11-21",
	// 		"amount": "$100.50"
	// 	},
	// 	{
	// 		"guest_name": "John Doe",
	// 		"transaction_type": "Donation",
	// 		"date": "2023-11-21",
	// 		"amount": "$100.50"
	// 	},
	// 	{
	// 		"guest_name": "John Doe",
	// 		"transaction_type": "Donation",
	// 		"date": "2023-11-21",
	// 		"amount": "$100.50"
	// 	},
	// 	{
	// 		"guest_name": "John Doe",
	// 		"transaction_type": "Donation",
	// 		"date": "2023-11-21",
	// 		"amount": "$100.50"
	// 	}
	// ]

	return (
		<div className={"flex flex-col w-full rounded-lg bg-white p-5 border-gray-200 border shadow-card hover:bg-primary hover:text-white transition-all duration-500 h-full"}>
			<h3 className={"text-xl font-sans font-bold"}>Recent Transactions</h3>
			<div className={"flex flex-col mt-3 flex-grow"}>
				{/*if no recent activiity tell user*/}
				{data.length === 0 && <div className={"text-center"}>No recent activity</div>}
				{/*if recent activity*/}
				{data.map((item, index) => {
					return (
						<div key={index} className={"flex flex-row justify-between items-center border-b border-gray-200 py-2 h-full"}>
							<div className={"flex flex-row"}>
								<div className={"flex flex-col ml-3"}>
									<h3 className={"font-sans font-light"}>{item.guest_name ?? 'Anon'}</h3>
									<p className={"font-sans text-sm"}>{item.transaction_type}</p>
								</div>
							</div>
							<div className={"flex flex-col mr-3"}>
								<p className={"font-sans text-sm"}>{item.date}</p>
								<p className={"font-sans text-sm"}>${ (item.amount / 100).toFixed(2)}</p>							</div>
						</div>
					)
				})}

			</div>

		</div>
	)
}