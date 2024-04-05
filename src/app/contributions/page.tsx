import {Suspense} from "react";
import {supabaseClient} from "@/app/api/supabase";
import SummaryCard from "@/app/contributions/components/SummaryCard";
import {DollarSign, Heart, Users} from "react-feather";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import LoadingSummaryCard from "@/app/contributions/components/LoadingSummaryCard";
import RecentActivity from "@/app/contributions/components/RecentActivity/RecentActivity";
import Notifications from "@/app/contributions/components/Notifications/Notifications";
import TransactionsList from "@/app/contributions/components/TransactionsList/TransactionsList";
import {auth} from "@clerk/nextjs";
import PayoutEnabledTracker from "@/app/contributions/components/PayoutEnabledTracker/PayoutEnabledTracker";


async function getItem() {
	const {userId, getToken} = auth();
	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supabase = await supabaseClient(supabaseAccessToken);
	const {data, error} = await supabase.from('users').select('*')


	if (error) {
		console.error('error', error)
		return [null, error]
	}

	if (data[0]?.stripe_id) {
		const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
		data[0].stripe_account = await stripe.accounts.retrieve(data[0].stripe_id)
	}
	return [data[0], error]
}

const revalidate = 3600 // revalidate the data at most every hour


export default async function Contributions() {

	const [item, error] = await getItem()

	if (error) {
		return <div className={"flex flex-col sm:items-center min-h-screen p-6 justify-center align-middle items-center"}>
			<h1 className={"mt-14"}>
				{error.message}
			</h1>
		</div>
	} else if (!item) {
		return <div className={"flex flex-col sm:items-center min-h-screen p-6 justify-center align-middle items-center"}>
			<LoadingSummaryCard/>
		</div>
	}

	return (
		<div className={"flex flex-col sm:items-center min-h-screen pt-4 md:p-6 mx-1 md:mx-0"}>
			<div className={"mt-14 md:mt-24"}></div>

			<div className={"flex flex-col items-start sm:w-1/2 xl:w-2/3"}>
				<h1 className={"font-sans font-bold text-4xl mb-3"}>Contributions</h1>
				<p className={"font-roboto mb-2"}>Manage event settings and contributions here.</p>
				<Tabs defaultValue="summary" className="w-full">
					<TabsList>
						<TabsTrigger value="summary">Summary</TabsTrigger>
						<TabsTrigger value="transactions">Transactions</TabsTrigger>
					</TabsList>
					<PayoutEnabledTracker payoutEnabled={(item?.stripe_account?.payouts_enabled ?? false) && item.stripe_id}/>
					<TabsContent value="summary">
						<hr className={"mb-2 bg-black"}/>
						<div className={"grid grid-cols-2  md:flex-row md:flex w-full gap-2 flex-grow transition mb-3"}>
							<Suspense fallback={<LoadingSummaryCard/>}>
								<SummaryCard icon={DollarSign} title={"Total Revenue"}
								             schema_column_name={"total_raised"} schema_table={"events"}
								             isDollar={true}/>
							</Suspense>
							<Suspense fallback={<LoadingSummaryCard/>}>
								<SummaryCard icon={Users} title={"Guests"} schema_column_name={"num_guests"}
								             schema_table={"events"}
								             isDollar={false}/>
							</Suspense>
							<Suspense fallback={<LoadingSummaryCard/>}>
								<SummaryCard icon={Heart} title={"Donations"} schema_column_name={"transaction_count"}
								             schema_table={"events"}
								             isDollar={false}/>
							</Suspense>
						</div>
						<div className={"flex flex-col lg:grid lg:grid-cols-2 gap-2"}>
							<div className={"w-full"}>
								<Suspense fallback={<LoadingSummaryCard/>}>
									<RecentActivity/>
								</Suspense>
							</div>
							<div className={"w-full"}>
								<Notifications/>
							</div>
							{/*<div className={"w-full"}>*/}
							{/*	<RecentActivity/>*/}
							{/*</div>*/}
						</div>

					</TabsContent>
					<TabsContent value="transactions">
						<h3 className={"text-lg font-sans font-bold my-4"}>All Transactions</h3>
						<div className={"my-auto bg-white rounded-lg p-5 border border-gray-300 shadow pb-10"}>
							<TransactionsList accountId={item.stripe_id}
							                  payoutsEnabled={(item?.stripe_account?.payouts_enabled ?? false)}
							                  userEmail={item.email}/>
						</div>
					</TabsContent>
				</Tabs>


			</div>
		</div>
	)
}