**Terms**
Zod - A schema declaration and validation library





# Debugging Issues
A report on some of the issues faced while building the AI Agent CLI.

## Issue-01

^579408

Defining a a **Zod Schema** (the blueprint), but trying to treat it like **Data** (the actual object).
##### Error raised
```typescript
Property 'serverUrl' does not exist on type 'ZodObject<{ serverUrl: ZodOptional<ZodString>; clientId: ZodOptional<ZodString>; }, $strip>'

short version
Property 'serverUrl' does not exist on type 'ZodObject<{}, V>'

```

```typescript
export async function loginAction(opts){

const schema = z.object({
	'serverUrl': z.string().optional(),
	'clientId': z.string().optional()
});

const serverUrl = options.serverUrl || URL; // specific line that caused error
const clientId = options.clientId || CLIENT_ID;

```


#### Breakdown of the error raised
1. It says a certain property does not exist on a type
2. The typescript object is `ZodObject` which represents a schema definition using `Zod`.
3. This object specifically defines **the shape** and **validation** rules for a configuration object.
4. And this configuration object is typically **used for API or client Authentication.**

**The Schema Shape**
1. The `ZodObject` created by z.object expects two specific keys, both of which are **optional**. This means an empty object will technically pass the validation. The keys are:
	1. `serverUrl`:
		1. **Type**: Must be a string if provided.
		2. **Requirement**: Optional-it can be **undefined** or **omitted** entirely
	2. `clientId`:
		1. **Type**: Must be a string if provided
		2. **Requirement**: Optional

**The `$strip` Logic**
The `$strip` designation refers to Zod's **strip** behaviour (which is default).
1. **What it does**: If an object passed to this schema contains extra keys not defined here (e.g., {serverUrl: "...", extraKey: "hidden"}), Zod will remove the unknown keys during validation automatically.
2. **The Result**:  The resulting output will only contain `serverUrl` and `clientId`

#### Why are you getting the error?
1. You’ve defined `options` as a **Zod Schema** (the blueprint), but you’re trying to treat it like the **Data** (the actual object). 
	1. A Zod schema is just a set of rules; it doesn’t actually contain the values from `opts` until you tell it to validate them.
		1. `opts` being the values you're receiving from your client. **Notice how the code does not use `opts` the parameter containing the data**

#### The Fix: Parse the data first
1. You need to run `schema.parse(opts)` in order to get the validated values 
	1. **what `schema.parse(opts)` does:** This creates a new object from the client's data that actually contains these validated values.
2. ```typescript
   // `z.object()` returns a schema(shape) of the object to be received
 const loginSchema = z.object({
        'serverUrl': z.string().optional(),
        'clientId': z.string().optional()
    });

	// `z.infer` - property - returns the type of the schema
	type LoginOptions = z.infer<typeof loginSchema>;
 
	export async function loginAction(opts: LoginOptions){
	  
	    const validatedData = loginSchema.parse(opts); // parse the data
	    const serverUrl = validatedData.serverUrl || URL; 
	    const clientId = validatedData.clientId || CLIENT_ID;

	   ```

