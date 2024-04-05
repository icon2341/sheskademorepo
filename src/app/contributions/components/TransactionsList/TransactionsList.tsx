'use client';


import {useEffect, useRef, useState} from "react";
import {loadConnectAndInitialize, StripeConnectInstance} from '@stripe/connect-js'
import {ConnectComponentsProvider, ConnectPayments,} from "@stripe/react-connect-js";
import {LoadingIndicator} from "@/app/components/LoadingUtils/LoadingIndicator";
import Image from "next/image";
import sheskalogo from "/public/images/Sheska_S.png";
import LoadingButton from "@/app/components/LoadingButton/LoadingButton";
import {Button} from "@/components/ui/button";

// '/api/stripe_webhook/account_session'

/**
 * Get the express dashboard URL
 * @param accountId The account ID
 */
async function getExpressDashboardURL(accountId: string) {
	const response = await fetch('/api/stripe/express_dashboard', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({accountId: accountId})
	});

	if (!response.ok) {
		// Handle errors on the client side here
		const {error} = await response.json();
		console.error('An error occurred: ', error);
		return Promise.reject(error);
	} else {
		const res = await response.json();
		console.log('Express Dashboard URL: ', res);
		return res.url;
	}
}


/**
 * Get the Stripe Connect instance
 * @param accountId The account ID
 */
async function getConnectInstance(accountId: string) {
	const fetchClientSecret = async () => {
		// Fetch the AccountSession client secret
		const response = await fetch('/api/stripe/account_session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({accountId: accountId})
		});
		if (!response.ok) {
			// Handle errors on the client side here
			const {error} = await response.json();
			console.log('An error occurred: ', error);
			return Promise.reject(error);
		} else {
			const clientSecret = await response.json();
			return clientSecret.secret;
		}

	}

	return loadConnectAndInitialize({
		publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
		fetchClientSecret: fetchClientSecret,
		appearance: {
			overlays: 'dialog',
			variables: {
				colorPrimary: '#625afa',
			},
		},
	})
}

/**
 * Get the account onboarding URL
 * @param accountId The account ID
 */
async function getAccountOnboardingURL(accountId: string) {
	const response = await fetch('/api/stripe/onboarding_link', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({accountId: accountId})
	});

	if (!response.ok) {
		// Handle errors on the client side here
		const {error} = await response.json();
		console.error('An error occurred: ', error);
		return Promise.reject(error);
	} else {
		const res = await response.json();
		console.log('Onboarding URL: ', res);
		return res.accountLink.url;
	}
}

/**
 * Create a Stripe account ID in stripe if one does not already exist
 * @param email The email address
 */
async function createAccountId(email: string) {
	const response = await fetch('/api/stripe/create_account', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email: email})
	});

	if (!response.ok) {
		// Handle errors on the client side here
		const {error} = await response.json();
		console.log('An error occurred: ', error);
		return Promise.reject(error);
	} else {
		const res = await response.json();
		console.log('Account ID: ', res);
		return res.id;
	}
}

export default function TransactionsList(props: { accountId: string, payoutsEnabled: boolean, userEmail: string }) {
	const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [urlLoading, setUrlLoading] = useState(true);
	const [onboardingURL, setOnboardingURL] = useState('');
	const useEffectRan = useRef(false); // Use a ref


	const [dashboardUrl, setDashboardUrl] = useState('');

	useEffect(() => {
		if (props.accountId) {
			getExpressDashboardURL(props.accountId)
				.then(setDashboardUrl)
				.catch(console.error);
		}
	}, [props.accountId]);

	useEffect(() => {
		console.log('i fire once');
		if (useEffectRan.current) {
			return;
		}
		useEffectRan.current = true; // Mark the effect as having run




		if (props.accountId !== '' && props.accountId !== undefined && props.accountId !== null) {
			console.log('No account ID found');
			getConnectInstance(props.accountId).then((instance : StripeConnectInstance) => {
				console.log('Stripe Connect instance loaded');
				setStripeConnectInstance(instance);
				setLoading(false);
			}).then(() => {
				return getAccountOnboardingURL(props.accountId)
			}).then(async (url: string) => {
				console.log('Onboarding URL loaded', url);
				await setOnboardingURL(url)
				await setUrlLoading(false);
			}).catch(
				(error) => {
					console.error('An error occurred: ', error);
					alert('An error occurred: ' + error.message)
				}
			)
		} else {
			createAccountId(props.userEmail).then((accountId) => {
				console.log('Account ID created', accountId);
				return getAccountOnboardingURL(accountId)
			}).then(async (url: string) => {
				console.log('Onboarding URL loaded', url);
				await setOnboardingURL(url)
				await setUrlLoading(false);
			}).catch(
				(error) => {
					console.error('An error occurred: ', error);
					alert('An error occurred: ' + error.message)
				}
			)

		}


	}, [props.accountId, props.payoutsEnabled]);

	if (props.accountId === '' || props.accountId === undefined || props.accountId === null) {
		return (
			<div className={"flex flex-col align-middle items-center justify-center mx-auto w-full md:w-1/2 text-center gap-5 mt-5    "}>
				<Image src={sheskalogo} alt={"Sheska Logo"} width={100} className={"rounded-lg"}/>
				<h1 className={"text-xl font-sans"}>
					Set up payouts to view transactions
				</h1>
				<h2 className={"text-md font-roboto w-11/12"}>
					Sheska uses Stripe to process payments and payouts. To view transactions, you need to set up
					payouts.
				</h2>

				<LoadingButton isLoading={urlLoading} url={onboardingURL} className={"w-1/2"}>
					Setup payouts
				</LoadingButton>

				<h3 className={"text-sm font-roboto"}>
					You will be redirected to Stripe to complete onboarding
				</h3>


			</div>
		)
	}

	if (!props.payoutsEnabled) {
		return (
			<div className={"flex flex-col align-middle items-center justify-center mx-auto w-full md:w-1/2 text-center gap-5 mt-5    "}>
				<Image src={sheskalogo} alt={"Sheska Logo"} width={75} className={"rounded-lg"}/>
				<h1 className={"text-xl font-sans"}>
					Payouts are not enabled
				</h1>
				<h2 className={"text-md font-roboto"}>
					Sheska uses Stripe to process payments and payouts. To view transactions, you need to enable
					payouts by completing onboarding if you have not already done so, or by fixing any issues with your stripe
					account.
				</h2>

				<LoadingButton isLoading={urlLoading} url={onboardingURL} className={"w-1/2"}>
					Enable Payouts
				</LoadingButton>

				<h3 className={"text-sm font-roboto"}>
					You will be redirected to Stripe to complete onboarding
				</h3>

			</div>
		);
	}

	if (loading) {
		return (
			<div className={"flex flex-col sm:items-center min-h-screen p-6 justify-center align-middle items-center"}>
				<LoadingIndicator/>
			</div>
		)
	} else {
		return (
			<div>
				<div className="">
					<a href={dashboardUrl} className="btn btn-primary"><Button>
						Manage your stripe details
					</Button></a>
					<ConnectComponentsProvider connectInstance={stripeConnectInstance}>
						<ConnectPayments/>
					</ConnectComponentsProvider>
				</div>
			</div>
		)
	}

}