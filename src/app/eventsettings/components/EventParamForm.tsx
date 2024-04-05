"use client"

import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation'

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import React, {useEffect} from 'react';


export default function EventParamForm() {
	const {toast} = useToast()
	const router = useRouter();


	const formSchema = z.object({
		title: z.string().min(1, {message: 'Event Title is required'}),
		description: z.string(),
		address: z.string()
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			address: "",
		},
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
					title: data.data.title,
					description: data.data.description,
					address: data.data.address,
				});
				console.log(data.data)
			})
			.catch(error => console.error('Error:', error));
	}, []);

	async function onSubmit(values: z.infer<typeof formSchema>) {

		// Call the API
		const response = await fetch('/api/event', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({title: values.title, description: values.description, address: values.address})
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
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}
			      className="space-y-8 bg-white p-10 rounded-lg border border-gray-50 w-11/12 mx-auto">
				<FormField
					control={form.control}
					name="title"
					render={({field}) => (
						<FormItem>
							<FormLabel className={"text-xl"}>Event Title</FormLabel>
							<FormControl>
								<Input placeholder="James and Anna's Wedding" {...field} className={"bg-white"}/>
							</FormControl>
							<FormDescription>
								This is your event name that will be shown to guests on invites
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					name={"description"}
					control={form.control}
					render={({field: fieldDescription}) => (
						<FormItem>
							<FormLabel className={"text-xl"}>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="A lovely oasis venue down in saint cabo" {...fieldDescription}
								          className={"bg-white"}/>
							</FormControl>
							<FormDescription>
								This is your event description that is shown to guests (optional)
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					name={"address"}
					control={form.control}
					render={({field: fieldAddress}) => (
						<FormItem>
							<FormLabel className={"text-xl"}>Address</FormLabel>
							<FormControl>
								<Input placeholder="17 dumbledore dr, Las Vegas NV, 12312" {...fieldAddress}
								       className={"bg-white"}/>
							</FormControl>
							<FormDescription>
								This is the address of your venue (optional)
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