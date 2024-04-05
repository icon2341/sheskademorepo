export default function Notifications() {
	// TODO: Implement RecentActivityFetch
	//  fetch last 5 transactions + guest name
	//  Skelton and Suspense Too Format is fine

	const data = [
		{
			"guest_name": "John Doe",
			"transaction_type": "Donation",
			"date": "2023-11-21",
			"amount": "$100.50"
		},
		{
			"guest_name": "John Doe",
			"transaction_type": "Donation",
			"date": "2023-11-21",
			"amount": "$100.50"
		},
		{
			"guest_name": "John Doe",
			"transaction_type": "Donation",
			"date": "2023-11-21",
			"amount": "$100.50"
		},
		{
			"guest_name": "John Doe",
			"transaction_type": "Donation",
			"date": "2023-11-21",
			"amount": "$100.50"
		},
		{
			"guest_name": "John Doe",
			"transaction_type": "Donation",
			"date": "2023-11-21",
			"amount": "$100.50"
		}
	]

	return (
		<div className={"flex flex-col w-full rounded-lg bg-white p-5 hover:scale-110 border-gray-200 border shadow-card hover:bg-primary hover:text-white transition-all duration-500"}>
			<h3 className={"text-xl font-sans font-bold"}>Notifications</h3>
			<div className={"flex flex-col mt-3"}>
				{/*if no recent activiity tell user*/}
				{data.length === 0 && <div className={"text-center"}>No Notifications</div>}
				{/*if recent activity*/}
				{data.map((item, index) => {
					return (
						<div key={index} className={"flex flex-row justify-between items-center border-b border-gray-200 py-2"}>
							<div className={"flex flex-row"}>
								<div className={"flex flex-col ml-3"}>
									<h3 className={"font-sans font-bold"}>{item.guest_name}</h3>
									<p className={"font-sans text-sm"}>{item.transaction_type}</p>
								</div>
							</div>
							<div className={"flex flex-col mr-3"}>
								<p className={"font-sans text-sm"}>{item.date}</p>
								<p className={"font-sans text-sm"}>{item.amount}</p>
							</div>
						</div>
					)
				})}

			</div>

		</div>
	)
}