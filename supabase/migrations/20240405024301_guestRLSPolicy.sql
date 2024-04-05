create policy "Anybody can read an event"
on "public"."events"
as permissive
for select
to public
using (true);



