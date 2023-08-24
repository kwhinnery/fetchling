import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.199.0/assert/mod.ts";
import f from "./mod.ts";

// Localhost web server for testing
Deno.serve({ port: 8888 }, async (request: Request): Promise<Response> => {
  if (request.method === "POST") {
    if (request.url.endsWith("/food.json")) {
      return new Response(JSON.stringify({
        pizza: "delicious",
      }));
    } else if (request.url.endsWith("/animal")) {
      const b = await request.json();
      return new Response(JSON.stringify({
        name: b.name,
      }));
    } else {
      return new Response(JSON.stringify({
        method: "POST",
      }));
    }
  } else if (request.method === "GET") {
    if (request.url.endsWith("/txt")) {
      return new Response("plaintext");
    } else if (request.url.endsWith("/headers")) {
      return new Response(
        JSON.stringify(Object.fromEntries(request.headers)),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else if (request.url.endsWith("/index.html")) {
      return new Response("<html><body><p>hi</p></body></html>");
    } else if (request.url.indexOf("/animal?") >= 0) {
      const params = new URLSearchParams(
        request.url.substring(request.url.indexOf("?")),
      );
      return new Response(
        JSON.stringify({
          name: params.get("name"),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      return new Response(JSON.stringify({
        method: "GET",
      }));
    }
  } else {
    return new Response("", { status: 404 });
  }
});

Deno.test("Basic fetch with zero config.", async () => {
  const api = f("http://localhost:8888/txt");
  const { data } = await api.fetch();
  assertEquals(data, "plaintext");
});

Deno.test("JSON auto-parse", async () => {
  const api = f("http://localhost:8888/", { json: true });
  const { data } = await api.fetch();
  assertEquals(data.method, "GET");
});

Deno.test("JSON auto-parse with accept header", async () => {
  const api = f("http://localhost:8888/", {
    headers: {
      "Accept": "application/json",
    },
  });
  const { data } = await api.fetch();
  assertEquals(data.method, "GET");
});

Deno.test("Plain text with unknown header", async () => {
  const api = f("http://localhost:8888/index.html", {
    headers: {
      "Accept": "text/html",
    },
  });
  const { data } = await api.fetch();
  assert(data.endsWith("</html>"));
});

Deno.test("Custom URL object", async () => {
  const api = f(new URL("http://localhost:8888/index.html"));
  const { data } = await api.fetch();
  assert(data.endsWith("</html>"));
});

Deno.test("404 on unknown HTTP method", async () => {
  const api = f(new URL("http://localhost:8888/index.html"), {
    method: "PATCH",
  });
  const r = await api.fetch();
  assertEquals(r.status, 404);
});

Deno.test("Create and fetch a subresource", async () => {
  const api = f(new URL("http://localhost:8888"));
  const page = api("index.html");
  const { data } = await page.fetch();
  assert(data.endsWith("</html>"));
});

Deno.test("Get JSON from a subresource", async () => {
  const api = f(new URL("http://localhost:8888"), {
    headers: {
      "Accept": "application/json",
    },
  });
  const food = api("food.json", {
    method: "POST",
  });
  const { data } = await food.fetch();
  assertEquals(data.pizza, "delicious");
});

Deno.test("Get JSON with query parameters", async () => {
  const api = f(new URL("http://localhost:8888"), { json: true });
  const animal = api("animal", {
    query: {
      name: "dog",
    },
  });
  const { data } = await animal.fetch();
  assertEquals(data.name, "dog");
});

Deno.test("POST a JSON body", async () => {
  const api = f(new URL("http://localhost:8888"), { json: true });
  const animal = api("animal", {
    method: "POST",
    jsonBody: {
      name: "dog",
    },
  });
  const { data } = await animal.fetch();
  assertEquals(data.name, "dog");
});

Deno.test("New URL, same init params", async () => {
  const api = f(new URL("http://localhost:8888"), {
    json: true,
    headers: {
      "X-Shenanigans": "None",
    },
  });

  const { data } = await api.fetchUrl("http://localhost:8888/headers");
  assertEquals(data["x-shenanigans"], "None");
});

Deno.test("Same URL, different init params", async () => {
  const api = f(new URL("http://localhost:8888/headers"), {
    json: true,
    headers: {
      "X-Shenanigans": "None",
    },
  });

  const { data } = await api.fetch({
    headers: {
      "X-Shenanigans": "Some",
    },
  });
  assertEquals(data["x-shenanigans"], "Some");
});

Deno.test("GET method passthrough", async () => {
  const api = f(new URL("http://localhost:8888/headers"), {
    json: true,
    headers: {
      "X-Shenanigans": "None",
    },
  });

  const { data } = await api.get();
  assertEquals(data["x-shenanigans"], "None");
});

Deno.test("POST method passthrough", async () => {
  const api = f(new URL("http://localhost:8888"), { json: true });
  const animal = api("animal");
  const { data } = await animal.post({
    jsonBody: {
      name: "dog",
    },
  });
  assertEquals(data.name, "dog");
});
