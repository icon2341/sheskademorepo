import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

// TODO protect this route with a middleware that checks if the user is authenticated with anon middleware
export async function GET(request: Request, response: Response) {
	console.log('GET /api/guest/event');
	const {searchParams} = new URL(request.url)


	// Extract eventId from the query parameters instead of the request body
	const eventId = searchParams.get('eventId')

	if (!eventId) {
		return NextResponse.json({error: 'Bad Request'}, {status: 400})
	}

	const supabase = createClient(
		// Supabase API URL - env var exported by default.
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// Supabase API ANON KEY - env var exported by default.
		process.env.NEXT_PUBLIC_SUPABASE_KEY!)
	try {
		// Retrieve the event whose organizer_id matches userId
		const {data: eventData, error: eventError} = await supabase
			.from('events')
			.select('*')
			.eq('id', eventId);

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
