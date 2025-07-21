import { app } from "./app";
import { env } from "./config/env";

app.listen({ host: "0.0.0.0", port: env.API_PORT }).then(() => {
  console.log("🚀 HTTP Server running!");
});
