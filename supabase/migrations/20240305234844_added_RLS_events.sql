create policy "users can manage their own events"
on "public"."events"
as permissive
for all
to public
using ((requesting_user_id() = organizer_id))
with check ((requesting_user_id() = organizer_id));