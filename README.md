This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Local Enviornment

### Working with Supabase DB

To start and stop subspace run:
Note: Docker must be running

```bash
supabase.ts start
# or
supabase.ts stop
```

### Working with Supabase Functions
to deploy functions run

```bash
supabase.ts functions deploy
```

For local development of functions, you can serve them with the following command
Note: you will need to have a `.env.local` file in the `supabase` directory.
There is env.example file in the `supabase` directory to help you get started.

```bash
supabase functions serve --env-file ./supabase/.env.local

````

Make sure to keep migrations in tact see [Supabase Docs on Local Development](https://supabase.com/docs/guides/cli/local-development) for more details.

### Local Tunneling to expose local endpoints to clerk
Note: when developing locally you will need to tunnel with ngrok

```bash
ngrok http --domain=heroic-divine-thrush.ngrok-free.app http://localhost:54321
```
Which will map the given url to the passed url for api development, its a pain but you will have to revert whatever webhook or external online tool you are testing to a real development url when you are done.

To test supabase functions locally using postman you must:

1. enter sheska and authenticate
2. enter the command into the console in dev tools
   ```await window.Clerk.session.getToken({ template: "<the template name you chose on clerk JWT>" });```
3. copy the token and use it in the header of the postman request as a bearer token```

### Stripe Listener

To set up and test stripe webhooks:

run the following command to start the stripe listener

```bash
stripe listen --forward-connect-to  http://127.0.0.1:54321/functions/v1/stripe_webhook
```

To test webhooks you can use the following command

```bash
stripe trigger <event name>
```

Ex.

```bash
stripe trigger payment_intent.succeeded
```

Override syntax:

```bash
stripe trigger charge.succeeded --override payment_intent:transfer_data.destination=acct_1OvA2WCZSXPS10lY  --override payment_intent:amount=3667  --override payment_intent:application_fee_amount=183
```






