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
5. implement authclient in nextjs - #complete
    1. inside the login form import the `authclient`
    2. Setup dark mode - use shadcn - follow the docs
    3. Inside the ![[main app page]](./client/orbital-cli/app/page.tsx), we are going to display the currently logged in user
        1. get the data of the currently logged in user
            1. to get the data of the currently logged in user we'll need to retrieve their session from `authClient.useSession()`.
            2. this async function returns an object and since we just need `{data, isPending}` we perform object(json) destructuring to retrieve the data.
            ```
                const { data, isPending } = authClient.useSession()
            ```
        2. mark ![[page.tsx]](./client/orbital-cli/app/page.tsx) as "use client" since we're going to be utilizing browser/client side functionalities that do not exist on server side
        3. if `isPending` is true it means we're waiting for the data, therefore return a spinner.(in other words if it is not pending then we have received the data and can display the results).
            3. In the same document check if, `isPending` is false(meaning it has completed the async call), then check if the `user data` has been retrieved, if it hasn't we need to make sure that our `protected UI` does not flash(show for a brief moment), ![[why it flashes]]()
        4. if we're not waiting for the data (after a page reload),
             that is if the api request to fetch the data in `sign-in` has been resolved and we have `authClient.useSession()` has returned something, it'll change the state of `isPending` causing the page to reload since `isPending` is most likely a useState variable and its value is `false` allowing the code to go to the next function 
            check if the `session` and `user` has been retrieved, if they have not been retrieved, 
                it means there's no user logged in
            then route the page back to the sign-in page using `useRouter().push('sign-in')`, which can be found on client side code(Client Components), so that the user can log in
            1. make sure to wrap `useRouter().push('sign-in')` in a useEffect, so that it'll run after the page has been loaded else Next.js or React will continue rendering the `home page` and since you navigated to the `sign-in` page, it'll also render that page, making both pages render simultaneously.
            2. since we're wrapping the navigation functionallity in a `useEffect` it'll be the last to run and this means our `protected UI` will show. Therefore we need to write another safe guard which ensures that if there's `isPending` is false and we don't have any data, which is the last flow above, then we `return null`
        5. now if we have `session` and `user` data, then we will display the ` protected UI`
    4. Now in the ![[sign-in]](./client/orbital-cli/app/(auth)/sign-in/page.tsx) page, ensure that, if the user is already logged in, they will be navigated to the ![[main-page]](./client/orbital-cli/app/page.tsx)
        1. Add your `useEffect ` which will contain the safe guard
            1. make sure that your dependency array contains the variables and objects that'll you'll use inside the `useEffect`
        2. check if `isPending` is true, if it is return a spinner(same meaning as the previous)
        3. if it's `false` then check if we have the `user` and `session` data, if we do, then navigate back to the [[main page]](./client/orbital-cli/app/page.tsx)
    Caveats: 
    1. Ensure that your backend server has been configured with the correct better-auth url, and what is the better-auth url? it is the server url that handles the authentication and it is the url that github will use to resolve the `redirect_uri`.
    2. make sure that cors has been setup on the backend server so that it allows the client app(nextjs) to talk with it, if not the connection will be refused on the browser(throwing a cors policy error) and the server
    3. make sure you've configured the correct callback in the ![[login-form]](./client/orbital-cli/components/Login/login-form.tsx) for better-auth cause that is what tells github that after all the authentication process return to the client app(nextjs)
6. Completion - add some checks to make sure you executed the above correctly

# Chapter 4 - Implemement Device Flow
What is device Flow and ?
Device flow(OAuth 2.0 Device Authorization Grant) is an authentication method used by apps that that simply do not have browser or ui available(limited input capabilities), unable to easily handle traditional browser-based login. Examples are CLI tools, TVs, gaming consoles, IoT devices etc.

why we use device flow?
traditional OAuth flow uses the browser since this is impractical for some devices, device flow splits authentication across two devices, one with limited capabilities example(tv, cli) and then noe with full capabilities(phone, laptop)

1. Follow the better-auth for device authorization(device flow)
2. After you copy and paste the client plugin.
    2. execute `npx auth generate` and then
    2. `npx prisma migrate dev`
3. install the following
    3. commander
    3. boxen
    3. chalk
    3. yocto-spinner
    3. @clack/prompts
    3. figlet
4. inside the lib folder, create another folder called cli
    4. inside cli, create main.js and a commands folder
    4. inside main.js paste the following text `#!/usr/bin/env node` at the top of the file
5. Inside the [[main.js]](./server/src/lib/cli/main.js) file we're going to setup our console UI.
    5. we'll need to test implementation by setting up a banner in the console
    5. we began by creating a main function
        5. inside this function we are `console logging` another function.(in other words, we're passing another function inside the `console.log(another_function)`)
        5. the function that we pass inside is the `chalk.cyan()` function. (let's agree that since we know anything ending with `()` is a function we don't need to repeat function from now on.)
        5. and then inside `chalk.cyan()` we pass the object with it's parameters, in this case `{font, horizontalLayout}`
        5. add a new `command` named `orbital`, with a `description` and `version`.
        5. in the terminal type `chmod +x ./main.js` to make the main.js file executable
        5. go to package.json in the server folder and add `"bin": {"orbital": "./src/cli/main.js"}`
        5. now yoou can run the command `npm link` in the terminal