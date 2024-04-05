import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {supabaseClient} from "@/app/api/supabase";

export async function PATCH(request: Request, response: Response) {
	const data = await request.json();
	const {userId, getToken} = await auth();
	console.log('UPDATE EVENT', data, userId)

	if (!userId) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401})
	}


	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supabase = await supabaseClient(supabaseAccessToken);

	try {

		// update the event whose organizer_id matches userId
		const {data: eventData, error: eventError} = await supabase
			.from('events')
			.update({...data})
			.eq('organizer_id', userId);

		if (eventError) {
			console.error('error', eventError)
			throw eventError
		}

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

	const supabaseAccessToken = await getToken({template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME!});
	const supabase = await supabaseClient(supabaseAccessToken);

	try {
		// Retrieve the event whose organizer_id matches userId
		const {data: eventData, error: eventError} = await supabase
			.from('events')
			.select('*')
			.eq('organizer_id', userId);

		if (eventError) {
			console.error('error', eventError)
			throw eventError
		}

		return NextResponse.json({data: eventData[0]}, {status: 200})

	} catch (error: any) {
		console.error('An error occurred while retrieving the event data, try again later', error);
		return NextResponse.json({error: error.message}, {status: 500})
	}
}
