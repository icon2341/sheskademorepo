"use client"

import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation'

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"


export default function InviteForm() {
	const {toast} = useToast()
	const router = useRouter();


	const formSchema = z.object({
		email: z.string().email({message: 'Invalid email address'}),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {

		// Call the API
		const response = await fetch('/api/guest/invite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: values.email, firstName: values.firstName, lastName: values.lastName})
		})

		if (response.ok) {
			toast({
				title: "Guest invited!",
				description: "We've sent an invitation to your guest."
			})

			router.refresh()
		} else {
			//TODO show different messages depending on error
			const res = await response.json()
			console.error('Error:', res.error)
			toast({variant: "destructive", title: "Error inviting guest, try again later.", description: res.error})

		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}
			      className="space-y-8 bg-white p-10 rounded-lg border border-gray-50 w-11/12 mx-auto">
				<FormField
					control={form.control}
					name="email"
					render={({field}) => (
						<FormItem>
							<FormLabel className={"text-xl"}>Email</FormLabel>
							<FormControl>
								<Input placeholder="yourguest@email.com" {...field} className={"bg-white"}/>
							</FormControl>
							<FormDescription>
								This is your guest&apos;s email address.
							</FormDescription>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					name={"firstName"}
					control={form.control}
					render={({field: fieldFirstName}) => (
						<FormItem>
							<FormLabel className={"text-xl"}>Name</FormLabel>
							<div className={"flex flex-row gap-4"}>
								<FormControl>
									<Input placeholder="James" {...fieldFirstName} className={"bg-white"}/>
								</FormControl>
								<FormField
									name={"lastName"}
									control={form.control}
									render={({field: fieldLastName}) => (
										<FormControl>
											<Input placeholder="Dale" {...fieldLastName}
											       className={"bg-white"}/>
										</FormControl>
									)}
								/>
							</div>
							<FormDescription>
								This is your guest&apos;s name (optional).
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