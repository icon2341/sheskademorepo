import stripe from 'npm:stripe';
import {createClient} from "https://esm.sh/@supabase/supabase-js";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")

const supabaseClient = createClient(
	Deno.env.get('SUPABASE_URL') ?? '',
	Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

async function handleCheckoutSessionCompleted(event: stripe.Event) {
	// Handle successful checkout
	// TODO notify the user that someone has paid and add the user name to the transaction object


	//TODO MOVE PENDING TRANSACTION CREATION HERE THE NUPDATE AFTER
	const stripeClient = await stripe(STRIPE_SECRET_KEY);

	const paymentIntent : stripe.PaymentIntent = await stripeClient.paymentIntents.retrieve(event.data.object.payment_intent);

	const stripe_account = paymentIntent.transfer_data.destination;
	// get the user with this stripe ID
	let {data: userData, error} = await supabaseClient.from('users').select('*').eq('stripe_id', stripe_account);
	if (error) {
		throw new Error(`Error getting account: ${error.message}`);
	}
	if (!userData) {
		throw new Error(`Error getting account, No account exists`);
	}


	// get event data
	let {data: eventData, error: eventError} = await supabaseClient.from('events').select('*').eq('organizer_id', userData[0].id);
	if (eventError) {
		throw new Error(`Error getting account: ${eventError.message}`);
	}
	if (!eventData) {
		throw new Error(`Error getting account, No event exists`);
	}



	const {data: transactionData, error: transactionError} = await supabaseClient.from('transactions').insert({
		id: crypto.randomUUID(),
		event_id: eventData[0].id,
		user_id: userData[0].id,
		amount: paymentIntent.amount,
		transaction_at: new Date( event.data.object.created * 1000),
		status: paymentIntent.status,
		payment_method: event.data.object.payment_method_types[0],
		payment_intent_id: event.data.object.id,
		guest_name: event.data.object.customer_details.name,

	}).single();


}

async function handlePaymentIntentSucceeded(event: stripe.Event) {

	// TODO consider using promise.all to handle multiple tasks and log failed taskes independently
	const stripe_account = event.data.object.transfer_data.destination;
	// get the user with this stripe ID
	let {data: userData, error} = await supabaseClient.from('users').select('*').eq('stripe_id', stripe_account);
	if (error) {
		throw new Error(`Error getting account: ${error.message}`);
	}
	if (!userData) {
		throw new Error(`Error getting account, No account exists`);
	}


	// get event data
	let {data: eventData, error: eventError} = await supabaseClient.from('events').select('*').eq('organizer_id', userData[0].id);
	if (eventError) {
		throw new Error(`Error getting account: ${eventError.message}`);
	}
	if (!eventData) {
		throw new Error(`Error getting account, No event exists`);
	}

	// update balance in event from stripe
	const stripeClient = await stripe(STRIPE_SECRET_KEY);

	const balance = await stripeClient.balance.retrieve({
		stripeAccount: stripe_account,
	});

	// update the event with the new balance
	const {data : eventUpdateData, error : eventUpdateError} =  await supabaseClient.from('events').update({
		total_raised: balance.available[0].amount + balance.pending[0].amount, transaction_count: eventData[0].transaction_count + 1
	}).eq("id", eventData[0].id);

	if(eventUpdateError) {
		throw new Error(`Error updating event: ${eventUpdateError.message}`);
	}

	// update transaction with new status for async payments_intent completions
	const {data: transactionData, error: transactionError} = await supabaseClient.from('transactions').update({
		status: event.data.object.status
	}).eq("payment_intent_id", event.data.object.id);

	if(transactionError) {
		throw new Error(`Error updating transaction: ${transactionError.message}`);
	}
}

async function handleEvent(event: stripe.Event) {
	switch (event.type) {
		case 'checkout.session.completed':
			await handleCheckoutSessionCompleted(event);
			break;
		case 'payment_intent.succeeded':
			await handlePaymentIntentSucceeded(event);
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}
}

Deno.serve(async (req: Request) => {
	console.log("Received request", req.method, req.url);
	if (req.method === "POST") {
		const signature = req.headers.get("stripe-signature");
		const body = await req.text();

		let event: stripe.Event;

		// Webhook validation
		try {
			event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
			console.log("Received event", event.id, event.type);

			await handleEvent(event);

			return new Response("Received", {status: 200});
		} catch (error: any) {
			console.error("Webhook Handling Failed", error.message);
			return new Response(`Webhook Error: ${error.message}`, {status: 500});
		}
	} else {
		return new Response("Only POST requests supported", {status: 405});
	}
});