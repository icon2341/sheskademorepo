import EventInfoHeader from "@/app/event/[eventId]/components/EventInfoHeader";

export type Event = {
	id: string;
	title: string;
	description: string;
	address: string;
	event_date: Date;
}

async function getEvent(eventId: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/guest/event?eventId=${eventId}`, {
		method: 'GET',
		next: {revalidate: 60}
	});

	return await response.json()
}

export default async function Page({params}: { params: { eventId: string } }) {

	const data = await getEvent(params.eventId)
	const event: Event = data.data
	return (
		<div className={"flex flex-col align-middle justify-center items-center gap-2"}>
			<EventInfoHeader event={event}/>
			{/*<div className={"absolute top-50% left-1/2 right-1/2 bottom-1/2"}>My Post: {data.data.id}</div>*/}
			<div className={"font-roboto font-extralight text-gray-800 flex flex-row w-auto"}>
				<h4 className={"mr-3"}>Powered By</h4>
				<h4 className={"font-logo text-primary font-black"}>Sheska</h4>
			</div>
		</div>
	)

}