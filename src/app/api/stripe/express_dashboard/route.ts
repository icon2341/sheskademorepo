import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest, response: NextResponse) {
    const data = await request.json();
    const {userId, getToken} = auth();

    if (!userId) {
        return await NextResponse.json({error: 'User not found'}, {status: 400})
    }

    if (!data.accountId) {
        return NextResponse.json({error: 'accountId is required'}, {status: 400});
    }

    try {
        const loginLink = await stripe.accounts.createLoginLink(data.accountId);
        return NextResponse.json({url: loginLink.url}, {status: 200});
    } catch (error : any) {
        console.error('An error occurred when calling the Stripe API to create a login link', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}