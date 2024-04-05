import {loadConnectAndInitialize} from "@stripe/connect-js";

const fetchClientSecret = async () => {
	// Fetch the AccountSession client secret
	const response = await fetch('/api/account_session', {
		method: 'POST'
	});
	if (!response.ok) {
		// Handle errors on the client side here
		const {error} = await response.json();
		console.log('An error occurred: ', error);
		return undefined;
	} else {
		const {client_secret: clientSecret} = await response.json();
		return clientSecret;
	}
}

const stripeConnectInstance =  loadConnectAndInitialize({
	// This is your test publishable API key.
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
	fetchClientSecret: fetchClientSecret,
	appearance: {
		overlays: 'dialog',
		variables: {
			colorPrimary: '#625afa',
		},
	},
})

