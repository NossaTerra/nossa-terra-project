# How To Run

```console
# Initialize Environment Variables
cp .env.example .env

# Install deps
pnpm i

# Generate Prisma Client and Push
pnpm db:push

# Run the Development server
pnpm dev
```

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## How To Update the Schema?

Schema Changes and PlanetScale:

PlanetScale has the "Safe migrations" feature enabled on this project, which means that schema changes are not integrated directly into our database.

To do this, it is necessary to create branches in PlanetScale and perform deploy requests:

1. First Create a new Branch on Planet Scale:
   ![Captura de Tela 2024-04-12 às 20 46 51](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/be122d89-3ed4-4f0b-989a-be6394fc6fad)

2. Select the branch and tap Connect:
   ![Captura de Tela 2024-04-12 às 20 54 00](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/eb6081c8-011a-4eba-8046-d02bda1bd490)

3. Choose create password:

![Captura de Tela 2024-04-12 às 20 56 08](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/1b002ce4-923b-4633-ac46-e9b584258467)

4. Scroll down and select Prisma as Framework selection:
   ![Captura de Tela 2024-04-12 às 20 57 04](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/c142d1cc-8359-459f-9908-cd7047ed0b62)

5. Find the database URL generated secret and copy it:

![Captura de Tela 2024-04-12 às 20 58 12](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/4a94be69-d5f7-4695-b332-6daf7f67de5d)

6. Go to app .env and replace the secret, with the one you just copied for DatabseURL
7. Now guarantee that your local repo is with the correct state for the `schema.prisma` that you want the branch to be in.
8. Run `pnpm db:push`to push this local schema to the newly created branch
9. Select the new Branch on planet scale and tap to create a new Deploy request for it:
   ![Captura de Tela 2024-04-12 às 21 14 51](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/774ea9fe-69b2-4fcb-a0d5-5799cd87767c)

10. If the changes make sense, tap deploy changes:
    ![Captura de Tela 2024-04-12 às 21 15 36](https://github.com/NossaTerra/nossa-terra-project/assets/20156917/c5229bb4-7a19-41d7-9290-52da550b833f)

11. after changes are deployed you can put back the original value of the .env for DATABASE_URL (the one that actually points to the main branch)
12. To test if everything is working, set up the `DATABASE_URL` of the main branch and play with the `pnpm db:studio`
