import {NextRequest, NextResponse} from "next/server";
import {auth} from '@clerk/nextjs';
import {supabaseClient} from "@/app/api/supabase";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


/**
 * Create a user on stripe_webhook for the client to connect to and add this stripe_webhook id to the users postgres record
 * @param request contains email
 * @param response new account ID
 */
export async function POST(request: NextRequest, response: NextResponse) {
	const {userId, getToken} = auth();

	if (!userId) {
		return await NextResponse.json({error: 'User not found'}, {status: 400})
	}

	const resData = await request.json();
	try {
		if (!resData.email) {
			return await NextResponse.json({error: 'email is required'}, {status: 400})
		}
		const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
		const supabase = await supabaseClient(supabaseAccessToken);

		// check db if there is already a stripe_webhook account
		const {data, error} = await supabase.from('users').select('*').eq('id', userId)
		if (error) {
			console.error('error', error)
			throw error
		}

		if (data[0]?.stripe_id) {
			const oldAccount = await stripe.accounts.retrieve(data[0].stripe_id);
			console.log('Account already exists: ', oldAccount.id);
			return NextResponse.json(oldAccount, {status: 200})
		}



		const account = await stripe.accounts.create({
			type: 'express',
			country: 'US',
			business_type: 'individual',
			email: resData.email,
			capabilities: {
				transfers: {requested: true},
			},
		});


		let secondQueryError = await supabase.from('users').update({stripe_id: account.id}).eq('id', userId)
		if (secondQueryError.error) {
			console.error('error', secondQueryError.error)
			throw secondQueryError.error
		}

		console.log('Account created: ', resData.email, account.id);
		return NextResponse.json(account, {status: 200})
	} catch (error : any) {
		console.error('An error occurred when calling the Stripe API to create an account session', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}