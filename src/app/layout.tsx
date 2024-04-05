import type {Metadata} from "next";
import localFont from "next/font/local";
import {Inter, Roboto} from "next/font/google"
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import NavBar from "@/app/components/Nav/NavBar";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Toaster} from "@/components/ui/toaster";

//meaningless comment

const Butler = localFont(
	{
		src: [
			{
				path: './fonts/Butler.woff2',
				weight: '400',
				style: 'normal',
			},
			{
				path: './fonts/Butler-Black.woff2',
				weight: '900',
				style: 'black',
			},
		],
		display: "swap",
		variable: '--font-butler'
	}
)

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: "swap"
},)

const roboto = Roboto({
	subsets: ['latin'],
	variable: '--font-roboto',
	display: "swap",
	weight: "300"
},)


export const metadata: Metadata = {
	title: "Sheska",
	description: "Raise Funds, Manage Guests, Communicate Effectively; Stop doing things the hard way.",
	icons: ['./icon.ico'],
};
export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {



	return (
		<ClerkProvider appearance={{variables: { colorPrimary: '#0F172A' },}}>
			<html lang="en" className={""}>
			{/*<body className={`${Butler.variable} ${inter.className} ${roboto.className}`}>*/}
			<body className={`${Butler.variable} ${inter.variable} ${roboto.variable} font-roboto`}>
			<NavBar/>
			{children}
			<Toaster/>
			<SpeedInsights/>
			<Analytics/>
			</body>
			</html>
		</ClerkProvider>


	);
}
