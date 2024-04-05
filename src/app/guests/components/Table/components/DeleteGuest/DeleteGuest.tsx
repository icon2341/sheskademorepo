'use client'
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation";

async function deleteGuest(id: string, toast: any, router: any) {

	const response = await fetch(`/api/guest/invite`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({guestId: id})
	})

	if (response.ok) {
		console.log('Guest deleted')
		toast({
			title: "Guest deleted!",
			description: "The guest has been removed from your list."
		})
		router.refresh()
	} else {
		const res = await response.json()
		console.error('Error:', res.error)
		toast({variant: "destructive", title: "Error deleting guest, try again later.", description: res.error})

	}

}

export default function DeleteGuest(props: { id: string }) {
	const {toast} = useToast()
	const router = useRouter();

	return (
		<div>
			<Button onClick={() => {
				deleteGuest(props.id, toast, router)
			}}>Delete</Button>
		</div>
	)
}