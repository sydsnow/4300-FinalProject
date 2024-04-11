import { StackContext, Api, EventBus, StaticSite, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {

  const audience = `api-todo-list-${stack.stage}`;

  const assetsBucket = new Bucket(stack, "assets");

  console.log("audience", audience)
  const api = new Api(stack, "api", {
    authorizers: {
      myAuthorizer: {
        type: "jwt",
        jwt: {
          issuer: "https://mytodoapp.kinde.com",
          audience: [audience],
        },
      },
    },
    defaults: {
      authorizer: "myAuthorizer",
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
        }
      }
    },
    routes: {
      "GET /": {
        authorizer: "none",
        function: {
          handler: "packages/functions/src/lambda.handler"
        }
      },
      "GET /todos": "packages/functions/src/todos.handler",
      "POST /todos":{
        // authorizer: "none",
        function: {
          handler:  "packages/functions/src/todos.handler"
        }
      },
      "POST /signed-url":{
        function: {
          environment: {
            BUCKET_NAME: assetsBucket.bucketName,
          },
          handler: "packages/functions/src/s3.handler",
        }
      }
    },
  });

  api.attachPermissionsToRoute("POST /signed-url", [assetsBucket, "grantPut"])

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_KINDE_AUDIENCE: audience,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebsiteUrl: web.url,
  });
}