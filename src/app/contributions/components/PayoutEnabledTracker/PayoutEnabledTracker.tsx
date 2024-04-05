'use client'

import {AlertCircle as DisabledSymbol, UserCheck as EnabledSymbol} from "react-feather"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"

export default function PayoutEnabledTracker(props: { payoutEnabled: boolean }) {
	if (props.payoutEnabled) {
		return (
			<div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<div className={"p-2 bg-white border border-gray- rounded-lg w-52 flex flex-row align-middle gap-2 justify-center my-3"}>
								<h1>Payouts are enabled</h1>
								<EnabledSymbol size={20} color={"green"} className={"my-auto"}/>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Great! You are all set to raise money with Sheska!</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	}
	return (
		<div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<div className={"p-2 bg-white border border-gray- rounded-lg w-64 flex flex-row align-middle gap-2 justify-center my-3"}>
							<h1>Payouts are not enabled!</h1>
							<DisabledSymbol size={20} color={"red"} className={"my-auto"}/>
						</div>
					</TooltipTrigger>
					<TooltipContent className={"w-64"}>
						<p>Uh Oh! Seems that Stripe has not enabled payments on your account! If you have not completed
							onboarding yet, please do so there.</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	)

}