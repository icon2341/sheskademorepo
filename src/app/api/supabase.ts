import {createClient} from "@supabase/supabase-js";


export const supabaseClient = async (supabaseAccessToken : any) => {
    const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
        global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    })

    return supabase
}