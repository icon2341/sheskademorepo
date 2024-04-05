import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function RootLayout({
	                                   children,
                                   }: {
	children: React.ReactNode
}) {

	// Check if a user has completed onboarding
	// If yes, redirect them to /home
	if ((auth().sessionClaims?.metadata.onboardingComplete ?? false)) {
		redirect("/home")
	}

	return <>{children}</>
}