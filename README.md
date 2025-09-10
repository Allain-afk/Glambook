  ## Running the code (Local Mode)

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## About Local Mode

  - Supabase integration has been removed. No external services are required.
  - Local auth, session, and data storage are implemented in `src/lib/localApi.ts` using `localStorage`.
  - Default login: Email `owner@example.com`, Password `password`.
  - Clearing browser site data resets the application state.
  
