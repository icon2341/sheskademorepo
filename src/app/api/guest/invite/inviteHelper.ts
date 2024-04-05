import {SupabaseClient} from "@supabase/supabase-js";

/**
 * Create an entry in the database for the guest and connect them to this event
 */
export async function inviteGuest(email: string, first_name: string, last_name: string, eventId: string, userId: string, supabaseClient: SupabaseClient) {
	const {data, error} = await supabaseClient.from('guests').insert(
		{
			id: crypto.randomUUID(),
			email: email,
			event_id: eventId,
			organizer_id: userId,
			first_name: first_name || null,
			last_name: last_name || null,
		});

	if (error) {
		console.error('error', error)
		throw error
	}
}