export async function sendGuestInvitationEmail(email: string, eventData: any, userId: string) {
	const sgMail = require('@sendgrid/mail')

	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	// Send email to guest using sendgrid
	const msg = {
		to: email, // Change to your recipient
		from: 'sheskasupport@sheska.co',
		templateId: 'd-9a0785dd256f49e881589db731aad0e1',
		dynamic_template_data: {
			event_name: eventData.title,
			sender_address: '16 Cobble Creek Rd, Victor, NY 14564',
			event_link: `${process.env.NEXT_PUBLIC_URL}/event/${eventData.id}`,
		}
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent to ', email)
			return Promise.resolve("REQUEST SUCCESSFUL");
		})
		.catch((resultError: any) => {
			console.error('Error sending email to ', email, ' error: ', resultError)
		});
}