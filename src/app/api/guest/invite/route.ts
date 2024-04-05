import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {supabaseClient} from "@/app/api/supabase";
import {sendGuestInvitationEmail} from "@/app/api/guest/invite/emailHelper";
import {inviteGuest} from "@/app/api/guest/invite/inviteHelper";


/**
 * invite guest to event and call function to send email to them
 * @param request request must contain email and user must be authenticated
 * @param response
 */
export async function POST(request: Request, response: Response) {
	const data = await request.json();
	const {userId, getToken} = await auth();

	if (!userId) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401})
	}

	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supabase = await supabaseClient(supabaseAccessToken);

	try {
		if (!data.email) {
			return await NextResponse.json({error: 'email is required'}, {status: 400})
		}


		// check db if there is already a stripe_webhook account
		const {data: eventData, error: eventError} = await supabase.from('events').select('*').eq('organizer_id', userId);

		if (eventError) {
			console.error('error', eventError)
			throw eventError
		}
		if (!eventData) {
			return await NextResponse.json({error: 'Event not found'}, {status: 404})
		}

		// send email to guest
		await inviteGuest(data.email, data.firstName, data.lastName, eventData[0].id, userId, supabase);

		console.log('Invitation sent to: ', data.email);

		const {data: eventUpdateData, error: eventUpdateError} = await supabase
			.from('events')
			.update({num_guests: eventData[0].num_guests + 1})
			.eq('organizer_id', userId);

		await sendGuestInvitationEmail(data.email, eventData[0], userId);

		return NextResponse.json({message: 'Invitation sent'}, {status: 200})

	} catch (error: any) {
		console.error('An error occurred while inviting the guest, try again later', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}

export async function GET(request: Request, response: Response) {
	const {userId, getToken} = await auth();

	if (!userId) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401})
	}

	console.log("GETTING GUESTS")

	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supaClient = await supabaseClient(supabaseAccessToken);

	try {
		const {data, error} = await supaClient.from("guests").select("*").eq("organizer_id", userId)
		if (error) {
			console.error('error', error)
			throw error
		}
		console.log("DATA FOR GUESTS", data)
		return NextResponse.json(data, {status: 200})
	} catch (error: any) {
		console.error('An error occurred while fetching the guests, try again later', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}

export async function DELETE(request: Request, response: Response) {
	const {userId, getToken} = await auth();

	const data = await request.json();

	if (!userId) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401})
	}

	if (!data.guestId) {
		return NextResponse.json({error: 'Guest ID is required'}, {status: 400})
	}

	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supaClient = await supabaseClient(supabaseAccessToken);

	console.log("DELETING GUEST", await data.guestId)

	try {
		const {data: guestData, error} = await supaClient.from("guests").delete().eq("id", data.guestId).eq("organizer_id", userId);
		if (error || data.length === 0) {
			console.error('error', error)
			throw new Error('Failed to delete guest')
		}
		console.log("Guest deleted", data)
		return NextResponse.json({message: 'Guest deleted'}, {status: 200})
	} catch (error: any) {
		console.error('An error occurred while deleting the guest, try again later', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}