import f from "../mod.ts";

// Get information required to connect to the Deno Deploy API
const accessToken = Deno.env.get("DENO_DEPLOY_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");

// Init a fetchling client
const api = f("https://api.deno.com/v1", {
  json: true,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Create a new project
const projRequest = await api(`organizations/${orgId}/projects`).post({
  jsonBody: { name: null }, // null name auto-generates a project name
});

// Create a deployment to the project
const deployments = api(`projects/${projRequest.data.id}/deployments`);
const deploymentRequest = await deployments.post({
  jsonBody: {
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content": `Deno.serve(() => new Response("Hello, World!"));`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  },
});

// Deployment is async, actual creation may take a moment after success
console.log(deploymentRequest.status);
