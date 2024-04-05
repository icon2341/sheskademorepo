"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {toast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const FormSchema = z.object({
	eventDate: z.date({
		required_error: "A event date is required",
	}),
})

export function DateTimePicker() {
	const router = useRouter()
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	useEffect(() => {
		fetch('/api/event', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => response.json())
			.then(data => {
				// Use the reset method to update the form with the fetched data
				form.reset({
					eventDate: new Date(data.data.event_date),
				});
				console.log(data.data)
			})
			.catch(error => console.error('Error:', error));
	}, []);

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const response = await fetch('/api/event', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({event_date: data.eventDate})
		})

		if (response.ok) {
			toast({
				title: "Event Updated!",
				description: "We have updated your event details."
			})

			router.refresh()
		} else {
			//TODO show different messages depending on error
			const res = await response.json()
			console.error('Error:', res.error)
			toast({variant: "destructive", title: "Error updating event, try again later.", description: res.error})

		}


		// 	toast({
		// 		title: "You submitted the following values:",
		// 		description: (
		// 			<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
		//   <code className="text-white">{JSON.stringify(data, null, 2)}</code>
		// </pre>
		// 		),
		// 	})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-10 mt-5 bg-white rounded-lg mx-auto w-11/12">
				<FormField
					control={form.control}
					name="eventDate"
					render={({field}) => (
						<FormItem className="flex flex-col">
							<FormLabel className={"text-xl"}>Event Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-norma bg-white",
												!field.value
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date()
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>
								What day is your event happening?
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}
