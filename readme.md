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
    2. add the client url "localhost:3000" to trusted Origins in [[auth.js]](./server/src/lib/auth.js)
3. Setup better auth into express - #complete
    2. when setting up better-auth into express, during setting up with the database(postgresql - neon serverless service)
        better-auth creates the accounts, sessions etc. that need to go into the database
    3. use social provider oauth (github)
        3. register new oauth app with github(such as homepage url, callback url, device flow) 
    4. implement better-auth in express
	    1. simple example of bootstrapping express with better-auth
        2. read the caution above before the server.ts
4. Make login and Home page ui - For user/device(client) flow
    1. Setup better-auth in the client as well
	    1. create auth-client.ts in the client folder
        2. build the authorization in the auth-client file
    2. inside the app folder, create a group folder called auth `(auth)`
	    1. inside the `(auth)` create a simple segment named `sign-in`
        2. in the `(auth)` add a layout file - [[layout.tsx]](./client/orbital-cli/app/(auth)/sign-in/layout.tsx)
        3. update [[layout.tsx]](./client/orbital-cli/app/(auth)/sign-in/layout.tsx) to render only children but center everything and set it to h-screen to only apply the full viewport height to the specific element it is attached to;
        4. inside [[sign-in]](./client/orbital-cli/app/(auth)/sign-in) create a new file [[page.tsx]](./client/orbital-cli/app/(auth)/sign-in/page.tsx)
6. implement authclient in nextjs - #complete
    1. inside the login form import the `authclient`
    2. Setup dark mode - use shadcn - follow the docs
    3. Inside the [[main app page]](./client/orbital-cli/app/page.tsx), we are going to display the currently logged in user
        1. get the data of the currently logged in user
            1. to get the data of the currently logged in user we'll need to retrieve their session from `authClient.useSession()`.
            2. this async function returns an object and since we just need `{data, isPending}` we perform object(json) destructuring to retrieve the data.
            ```
                const { data, isPending } = authClient.useSession()
            ```
        2. mark [[page.tsx]](./client/orbital-cli/app/page.tsx) as "use client" since we're going to be utilizing browser/client side functionalities that do not exist on server side
        3. if `isPending` is true it means we're waiting for the data, therefore return a spinner.(in other words if it is not pending then we have received the data and can display the results).
	        1. In the same document check if, `isPending` is false(meaning it has completed the async call), then check if the `user data` has been retrieved, if it hasn't we need to make sure that our `protected UI` does not flash(show for a brief moment), [[why it flashes]]()
        4. if we're not waiting for the data (after a page reload),
             that is if the api request to fetch the data in `sign-in` has been resolved and we have `authClient.useSession()` has returned something, it'll change the state of `isPending` causing the page to reload since `isPending` is most likely a useState variable and its value is `false` allowing the code to go to the next function 
            check if the `session` and `user` has been retrieved, if they have not been retrieved, 
                it means there's no user logged in
            then route the page back to the sign-in page using `useRouter().push('sign-in')`, which can be found on client side code(Client Components), so that the user can log in
            1. make sure to wrap `useRouter().push('sign-in')` in a useEffect, so that it'll run after the page has been loaded else Next.js or React will continue rendering the `home page` and since you navigated to the `sign-in` page, it'll also render that page, making both pages render simultaneously.
            2. since we're wrapping the navigation functionallity in a `useEffect` it'll be the last to run and this means our `protected UI` will show. Therefore we need to write another safe guard which ensures that if there's `isPending` is false and we don't have any data, which is the last flow above, then we `return null`
        5. now if we have `session` and `user` data, then we will display the ` protected UI`
    5. Now in the [[sign-in]](./client/orbital-cli/app/(auth)/sign-in/page.tsx) page, ensure that, if the user is already logged in, they will be navigated to the [[main-page]](./client/orbital-cli/app/page.tsx)
        1. Add your `useEffect ` which will contain the safe guard
            1. make sure that your dependency array contains the variables and objects that'll you'll use inside the `useEffect`
        2. check if `isPending` is true, if it is return a spinner(same meaning as the previous)
        3. if it's `false` then check if we have the `user` and `session` data, if we do, then navigate back to the [[main page]](./client/orbital-cli/app/page.tsx)
    Caveats: 
    6. Ensure that your backend server has been configured with the correct better-auth url, and what is the better-auth url? it is the server url that handles the authentication and it is the url that github will use to resolve the `redirect_uri`.
    7. make sure that cors has been setup on the backend server so that it allows the client app(nextjs) to talk with it, if not the connection will be refused on the browser(throwing a cors policy error) and the server
    8. make sure you've configured the correct callback in the [[login-form]](./client/orbital-cli/components/Login/login-form.tsx) for better-auth cause that is what tells github that after all the authentication process return to the client app(nextjs)
8. Completion - add some checks to make sure you executed the above correctly

# Chapter 4 - Implemement Device Flow
What is device Flow and ?
Device flow(OAuth 2.0 Device Authorization Grant) is an authentication method used by apps that that simply do not have browser or ui available(limited input capabilities), unable to easily handle traditional browser-based login. Examples are CLI tools, TVs, gaming consoles, IoT devices etc.

why we use device flow?
traditional OAuth flow uses the browser since this is impractical for some devices, device flow splits authentication across two devices, one with limited capabilities example(tv, cli) and then noe with full capabilities(phone, laptop)

1. Follow the better-auth for device authorization(device flow)
2. After you copy and paste the client plugin.
	1. execute `npx auth generate` and then
    2. `npx prisma migrate dev`
3. install the following
	1. commander
    2. boxen
    3. chalk
    4. yocto-spinner
    5. @clack/prompts
    6. figlet
    7. open - open any urls from your cli
    8. zod - input verifications
4. inside the lib folder, create another folder called cli
	1. inside cli, create main.js and a commands folder
    2. inside main.js paste the following text `#!/usr/bin/env node` at the top of the file
5. Inside the [[main.js]](./server/src/lib/cli/main.js) file we're going to setup our console UI.
	1. we'll need to test implementation by setting up a banner in the console
		1. hello
    2. we begin by creating a main function and making turning it into an executable command
	    1. inside this function we are `console logging` another function.(in other words, we're passing another function inside the `console.log(another_function)`)
        2. the function that we pass inside is the `chalk.cyan()` function. (let's agree that since we know anything ending with `()` is a function we don't need to repeat function from now on.)
        3. and then inside `chalk.cyan()` we pass the object with it's parameters, in this case `{font, horizontalLayout}`
        4. add a new `command` named `orbital`, with a `description` and `version`.
        5. in the terminal type `chmod +x ./main.js` to make the main.js file executable ^a4ebaf
        6. go to package.json in the server folder and add `"bin": {"orbital": "./src/cli/main.js"}`
        7. now you can run the command `npm link` in the terminal
6. We will now set up the login functionality.
	1. We start with the loginAction functionality
		1. Create two new folders inside [[cli/commands]](/server/src/cli/commands/), namely `ai` and `auth`
		    1. create [[login.js]](/server/src/cli/commands/auth/login.js)
		    2. inside [[login.js]], import the essential packages
			    1. what you need is your URL, CLIENT_ID, CONFIG_DIR, TOKEN_FILE(stored in database)(although better-auth also wants you to store it inside this token file), you need to create them as `constants`
			    2. create the login commands
				    1. create a zod object
			        2. define the parameters(accepted) by the `zod object` which you would like to **validate**
				        1.  `serverUrl` - an optional string 
				        2. `clientId` - an optional string
					3. now that we have validated the parameters we need, it's time to assign them to the respective variables using the data object returned from `zod`, which in this case is `options` and it contains the `serverUrl` and `clientId` attributes. 
						1. for each of the variables, if the two optional variables above do not exist, then assign the predefined variables
							1. `serverUrl = options.serverUrl || URL`
							2. `clientId = options.clientId || CLIENT_ID`
			3. when someone selects the action, then 
			4. display an intro
				1. using chalk: display the text `"Auth Cli Login"` in bold
					1. `chalk.bold(text)` takes in the parameter `text`
				2. `intro()` takes in the parameters `(title, opts, undefined)`
			5. we need to protect our application, by providing a safeguard that checks if **a user's token exists** or **if the token is expired**.
				1. create a constant `existingToken` with the value `false`, this behaviour is such that if a user is already logged in this would be `true`   
				2. create another variable `expired` which will be false
				3. Check - if there's an existing token and it has not expired - then :
					1. we will display the message `You are already logged in. Do you want to log in again?`. 
						1. To do this we will create a constant `shouldReAuth` and assign it the result of an awaited async functionYou `confirm()` which passes in a data object with two **attributes** , `message` and `initialValue`. 
						2.  `message: "You are already logged in. Do you want to log in again?"`
						3. `initialValue: false`
					2. Check - if the user cancelled the action, by checking the result of `isCancel(shouldReAuth)` (isCancel takes in a parameter named `value`) , or `!shouldReAuth`(whether there's no shouldReAuth), then
						1. cancel the login steps
							1. execute `cancel("Login Canceled)`
						2. and then exit the process by executing `process.exit(0)`
							my question is why aren't we returning but we're exiting the node process
					3. # new line
					4. no new line
	2. we will now complete setting up the `login` command by exporting `login` 
		 1. by providing a name for the command.
				 1. to provide a name we must first create a constant that will store the new command, then **initialize a new Command and pass in the name we would like to use** inside the **initializer function** `new Command("login")`
		 2. by providing a description for the command
				 1. to provide the "Login to Better Auth" description for the `"login"` command, we simply chain another command to the previous initialization by executing `new Command("login").description("Login to Better Auth")`
		 3. by providing options for the command, this is essentially how you would add the `serverUrl` and the `clientId` to the `login` command
				 1. to do this we will chain `.option("--server-url <url>", "The Better Auth server URL", URL)` to the `description()` function.
				 2. we will add another chained function `.option("--client-id <id>", "The OAuth client ID", CLIENT_ID)`
				 3. then, the last function we will chain is `.action(loginAction)` , the `loginAction` being passed is the name of the function we first described. 
		 4. To register the `login` command we simply open the file [[main.js]](/server/src/cli/main.js) and navigate to `program.version()` and chain the command `addCommand(login)` having passed in [[login]](/server/src/cli/commands/auth/login.ts)
			 1. To [[#^a4ebaf|turn it into an executable command ]]
	 3. **Issues faced and changes**: 
		 1. **debbugging ** 
		 2. 
7. 