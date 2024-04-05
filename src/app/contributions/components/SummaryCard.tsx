import {Icon} from "react-feather";
import {supabaseClient} from "@/app/api/supabase";
import {auth} from '@clerk/nextjs';


function timeout(ms : number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
export default async function SummaryCard(props: {title : any, icon : Icon, isDollar: boolean, schema_column_name: string, schema_table:string}) {
    const {userId, getToken} = auth();

    const supabaseAccessToken = await getToken({ template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME! });
    const supabase = await supabaseClient(supabaseAccessToken);
    const { data, error } = await supabase.from(props.schema_table).select(props.schema_column_name)
	// await timeout(200000)


	if (error || !data) {
		await console.log('error', error)
		return (
			<div className={"flex flex-col p-4 bg-card rounded-lg border-gray-200 border shadow-card w-full hover:scale-110 transition hover:shadow-2xl hover:bg-primary hover:text-white"}>
				<div className={"flex flex-row justify-between items-baseline"}>
					<h3 className={"font-sans text-md mb-3"}>{props.title}</h3>
					<props.icon size={14} color={"gray"}/>
				</div>
				<h3 className={"font-sans text-2xl font-bold"}>ERROR</h3>
			</div>

		)
	}

	await console.log('result', data[0])

    return (
        <div className={"flex flex-col p-4 bg-card rounded-lg border-gray-200 border shadow-card w-full hover:scale-110 transition hover:shadow-2xl hover:bg-primary hover:text-white"}>
            <div className={"flex flex-row justify-between items-baseline"}>
                <h3 className={"font-sans text-md mb-3"}>{props.title}</h3>
                <props.icon size={14} color={"gray"}/>
            </div>

	        {!error ?
		        <h3 className={"font-sans text-2xl font-bold"}>
			        {props.isDollar ? '$ ' + (Object.values(data[0])[0] as unknown as number / 100) : Object.values(data[0])[0] ?? '0.00'}
		        </h3>
		        :
		        <h3 className={"font-sans text-2xl font-bold"}>ERROR</h3>
	        }

        </div>
    )
}