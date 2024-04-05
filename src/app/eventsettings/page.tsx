import EventParamForm from "@/app/eventsettings/components/EventParamForm";
import {DateTimePicker} from "@/app/eventsettings/components/DateTimePicker";

export default function Page({params}: { params: { eventId: string } }) {

	return (
		<div className={"flex flex-col sm:items-center min-h-screen pt-4 md:p-6 mx-1 md:mx-0"}>
			<div className={"mt-14 md:mt-24"}></div>

			<div className={"flex flex-col items-start sm:w-9/12 xl:w-2/3"}>
				<h1 className={"font-sans font-bold text-4xl mb-3 ml-2"}>Event Details</h1>
				<p className={"font-roboto mb-2 ml-3 mb-5"}>Manage your event</p>
				<EventParamForm/>

				<DateTimePicker/>
			</div>

		</div>
	)
}