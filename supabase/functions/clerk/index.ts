import {createClient} from 'https://esm.sh/@supabase/supabase-js'
import {WebhookEvent} from "@clerk/nextjs/server";
import {Webhook} from "https://cdn.skypack.dev/svix"

async function postUser(payload : WebhookEvent, supabaseClient : any): Promise<void> {
	const {error} = await supabaseClient
		.from('users')
		.insert({ id: payload.data.id, first_name: payload.data.first_name, last_name: payload.data.last_name, email: payload.data.email_addresses[0].email_address})

	if (error) {
		throw error;
	}
}

async function postEvent(payload : WebhookEvent, supabaseClient : any): Promise<void> {
	const {error} = await supabaseClient
		.from('events')
		.insert({
			organizer_id : payload.data.id,
			title : `${payload.data.first_name}'s Event`,
		})

	if (error) {
		throw error;
	}
}

async function deleteEvent(payload: WebhookEvent, supabaseClient: any): Promise<void> {
	const {error} = await supabaseClient
		.from('users')
		.delete()
		.eq('id', payload.data.id)

	if (error) {
		throw error;
	}
}

Deno.serve(async (req: Request) => {
	try {

		const headers = {
			"svix-id": req.headers.get("svix-id"),
			"svix-signature": req.headers.get("svix-signature"),
			"svix-timestamp": req.headers.get("svix-timestamp")
		}

		let payload: WebhookEvent = await req.text()

		if (!payload) {
			throw Error("Bad Request")
		}

		const secret = Deno.env.get("CLERK_WEBHOOK_SECRET")!
		const webhook = new Webhook(secret)

		try {
			await webhook.verify(payload, headers)
		} catch (err) {
			console.log("Invalid Signature")
			return new Response(err.message, {status: 400})
		}

		console.log("Valid Signature")

		payload = JSON.parse(payload)

		const data = {
			message: `USER ADDED SUCCESS`,
		}

		const supabaseClient = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
		)

		switch (payload.type) {
			case 'user.created':
				await postUser(payload, supabaseClient);
				await postEvent(payload, supabaseClient)
				break;
			case 'user.deleted':
				await deleteEvent(payload, supabaseClient)
				break;
		}

		return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
	} catch (error : Error) {
		console.error('Error:', error)

		switch(error.message) {
			case "Bad Request": {
				return new Response('Bad Request', {status: 400})
			}
			default: {
				return new Response('Internal Server Error', { status: 500 })
			}
		}

	}
})