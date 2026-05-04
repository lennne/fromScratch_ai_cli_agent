**Terms**
Zod - A schema declaration and validation library





# Debugging Issues
A report on some of the issues faced while building the AI Agent CLI.

## Issue-01
Defining a a **Zod Schema** (the blueprint), but trying to treat it like **Data** (the actual object).
##### Error raised
```typescript
Property 'serverUrl' does not exist on type 'ZodObject<{ serverUrl: ZodOptional<ZodString>; clientId: ZodOptional<ZodString>; }, $strip>'
```

```typescript
export async function loginAction(opts){

const options = z.object({
	'serverUrl': z.string().optional(),
	'clientId': z.string().optional()
});

const serverUrl = options.serverUrl || URL;
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
2. 