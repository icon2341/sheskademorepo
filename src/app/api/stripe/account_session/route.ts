import {NextRequest, NextResponse} from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create an account session for the client
 * @param request - The incoming request with accountId in the JSON
 * @param response - The outgoing response with the account session in the JSON to be consumed
 * @constructor - The function to create an account session
 */
export async function POST(request: Request, response: Response) {

	const data = await request.json();


	try {
		if (!data.accountId) {
			return await NextResponse.json({ error: 'accountId is required' }, { status: 400 })
		}

		const accountSession = await stripe.accountSessions.create({
			account: data.accountId,
			components: {
				payments: {
					enabled: true,
					features: {
						refund_management: true,
						dispute_management: true,
						capture_payments: true,
					}
				}
			}
		});

		const secret = accountSession.client_secret;

		console.log('Account session created: ', secret);

		return NextResponse.json({secret}, { status: 200 })

	} catch (error : any) {
		console.error('An error occurred when calling the Stripe API to create an account session', error);
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}