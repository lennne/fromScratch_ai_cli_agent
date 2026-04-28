## Technologies

### Frontend
Next.js
Authentication
microservices
express
zod
commandjs

### Backend
Cors
Express
Better-Auth
Prisma
PostgreSQL Database - Neon DB(Serverless)

## Steps

# Chapter 1
1. Initialize Next.js
2. Setup Shadcn UI
3. Initialize server
    4. go into the package.json file and change "type" from "commonjs" to "module"

# Chapter 2
1. Installl prisma and prisma client
2. Initialize database inside express application(server)
2. get db url from neon db
3. Make a test migration

# Chapter 3 - SetUp Better Auth and Login Page 
1. Install Better-auth - Follow docs - #complete
    2. implementing a cli auth flow
2. Setup cors in your express application - #complete
    2. add the client url "localhost:3000" to trusted Origins in ![[auth.js]](./server/src/lib/auth.js)
3. Setup better auth into express - #complete
    2. when setting up better-auth into express, during setting up with the database(postgresql - neon serverless service)
        better-auth creates the accounts, sessions etc. that need to go into the database
    3. use social provider oauth (github)
        3. register new oauth app with github(such as homepage url, callback url, device flow) 
    4. implement better-auth in express
        4. simple example of bootstrapping express with better-auth
        4. read the caution above before the server.ts
4. Make login and Home page ui - For user/device(client) flow
    1. Setup better-auth in the client as well
        1. create auth-client.ts in the client folder
        1. build the authorization in the auth-client file
    2. inside the app folder, create a group folder called auth `(auth)`
        2. inside the `(auth)` create a simple segment named `sign-in`
        2. in the `(auth)` add a layout file - ![[layout.tsx]](./client/orbital-cli/app/(auth)/sign-in/layout.tsx)
        2. update ![[layout.tsx]](./client/orbital-cli/app/(auth)/sign-in/layout.tsx) to render only children but center everything and set it to h-screen to only apply the full viewport height to the specific element it is attached to;
        2. inside ![[sign-in]](./client/orbital-cli/app/(auth)/sign-in) create a new file ![[page.tsx]](./client/orbital-cli/app/(auth)/sign-in/page.tsx)
5. implement authclient in nextjs
    5. inside the login form import the `authclient`
    5. Setup dark mode - use shadcn - follow the docs
6. Completion - add some checks to make sure you executed the above correctly