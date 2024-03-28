import { StackContext, Api, EventBus, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
        }
      }
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /todos": "packages/functions/src/todos.handler",
      "POST /todos": "packages/functions/src/todos.handler",
    },
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebsiteUrl: web.url,
  });
}