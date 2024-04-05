alter table "public"."guests" drop constraint "guests_event_fkey";

alter table "public"."guests" drop column "event";

alter table "public"."guests" add column "event_id" uuid not null;

alter table "public"."guests" add column "organizer_id" text not null;

alter table "public"."guests" add constraint "public_guests_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guests" validate constraint "public_guests_organizer_id_fkey";

alter table "public"."guests" add constraint "guests_event_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guests" validate constraint "guests_event_fkey";

CREATE POLICY "Users can edit guests table"
ON "public"."guests"
AS PERMISSIVE
FOR ALL
TO public
USING (EXISTS (
     SELECT 1 FROM events ev
     WHERE ev.id = guests.event_id
       AND ev.organizer_id = requesting_user_id()
    )
)
WITH CHECK (EXISTS (
     SELECT 1 FROM events ev
     WHERE ev.id = guests.event_id
       AND ev.organizer_id = requesting_user_id()
    )
);


