# Fetchling - syntactic sugar for `fetch`

Fetchling provides helpful syntactic sugar for the built-in browser
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API.
Available in modern browsers, [Deno](https://deno.com), and
[Node.js 18+](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch),
fetch has largely eliminated the need for HTTP client libraries in JavaScript
applications.

That being said, `fetch` does require a non-trivial amount of boilerplate.
Fetchling provides a tiny layer abstraction that helps remove some of that
boilerplate, especially when making similar requests to the same collection of
REST API endpoints.

## How it works

Let's see how Fetchling works by writing some code that interacts with the
extremely useful [D&D Fifth Edition API](https://www.dnd5eapi.co/).

The following example sets up a reusable `api` object (a Fetchling instance) and
uses it to make a GET request to a resource within the API.

```ts
import f from "https://deno.land/x/fetchling/mod.ts";

const api = f("https://www.dnd5eapi.co/api", { json: true });
const { data } = await api("monsters/adult-black-dragon").get();

console.log("Name:", data.name);
```

Already, this is a bit nicer than `fetch` because of the `{ json: true }`
configuration option. That option will set the `Accept` header for us, and
automatically JSON parse the response body.

Where this style of interface really becomes useful is when you have to make
multiple requests to the same API. Rather than having to manually construct
every input to `fetch`, you can create subresources to interact with specific
endpoints, and share the same configuration.

```ts
import f from "https://deno.land/x/fetchling/mod.ts";

const api = f("https://www.dnd5eapi.co/api", { json: true });
const monsters = api("monsters");

const abolethData = (await monsters("aboleth").get()).data;
const dragonData = (await monsters("adult-black-dragon").get()).data;

console.log("Aboleth alignment:", abolethData.alignment);
console.log("Black Dragon alignment:", dragonData.alignment);
```

There's lots more to document and discover, but that will remain TODO for now :)

## License

MIT
