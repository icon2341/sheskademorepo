DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status_type') THEN
        CREATE TYPE transaction_status_type AS ENUM ('processing', 'succeeded', 'canceled','requires_payment_method',
            'requires_action', 'requires_capture', 'requires_confirmation');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
        CREATE TYPE payment_method_type AS ENUM ('card', 'paypal', 'acss_debit', 'affirm', 'afterpay_clearpay', 'klarna', 'link', 'us_bank_account' );
        END IF;
END$$;

create table
  public.events (
    id uuid not null default gen_random_uuid (),
    organizer_id text null,
    title text null,
    description text null,
    address text null,
    created_at timestamp with time zone not null default now(),
    total_raised numeric(10,2) null default '0.00'::numeric,
    transaction_count bigint null default '0'::bigint,
    num_guests bigint null default '0'::bigint,
    constraint events_pkey primary key (id),
    constraint events_organizer_id_fkey foreign key (organizer_id) references users (id) on update cascade on delete cascade
  ) tablespace pg_default;


  create table
    public.guests (
      id text not null,
      event uuid null,
      created_at timestamp with time zone not null default now(),
      first_name text null,
      last_name text null,
      email text null,
      number text null,
      constraint guests_pkey primary key (id),
      constraint guests_event_fkey foreign key (event) references events (id) on update cascade on delete cascade
    ) tablespace pg_default;

create table
  public.transactions (
    id uuid not null default gen_random_uuid (),
    event_id uuid null,
    guest_id text null,
    user_id text null,
    amount numeric not null default '0'::numeric,
    transaction_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    status public.transaction_status_type not null,
    payment_method public.payment_method_type not null,
    created_at timestamp with time zone not null default now(),
    constraint transactions_pkey primary key (id),
    constraint transactions_event_id_fkey foreign key (event_id) references events (id) on update cascade on delete set null,
    constraint transactions_guest_id_fkey foreign key (guest_id) references guests (id) on update cascade on delete set null,
    constraint transactions_user_id_fkey foreign key (user_id) references users (id) on update cascade on delete cascade
  ) tablespace pg_default;
