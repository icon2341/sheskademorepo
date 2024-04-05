import {NextRequest, NextResponse} from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get an onboarding link for the user to onboard themselves with.
 * @param request contains accountID
 * @param response onboarding link url
 */
export async function POST(request: NextRequest, response: NextResponse) {

	const data = await request.json();

	try {
		if (!data.accountId) {
			return await NextResponse.json({error: 'accountId is required'}, {status: 400})
		}

		const accountLink = await stripe.accountLinks.create({
			account: data.accountId,
			refresh_url: `${request.nextUrl.origin}/contributions/`,
			return_url: `${request.nextUrl.origin}/contributions/`,
			type: 'account_onboarding',
			collection_options: {
				fields: 'eventually_due',
			},
		});


		console.log('Account Link created: ', data.accountId, accountLink.url);
		return NextResponse.json({accountLink}, {status: 200})
	} catch (error : any) {
		console.error('An error occurred when calling the Stripe API to create an account session', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}