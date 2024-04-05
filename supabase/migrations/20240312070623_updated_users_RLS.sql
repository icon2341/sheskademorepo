drop policy "users can see their own User Data" on "public"."users";

create policy "users can edit their own data"
on "public"."users"
as permissive
for all
to public
using ((requesting_user_id() = id))
with check ((requesting_user_id() = id));
