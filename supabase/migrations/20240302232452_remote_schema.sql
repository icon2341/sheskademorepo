CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.requesting_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$ select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text; $function$
;

create policy "users can see their own User Data"
on "public"."users"
as permissive
for select
to public
using ((requesting_user_id() = id));



