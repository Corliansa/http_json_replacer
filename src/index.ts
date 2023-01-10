import { Traefik } from "./type";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import fastify from "fastify";
import { request } from "undici";
import { replacer } from "./replacer";

const server = fastify();
const data: Traefik = require(process.env.JSON_PATH ?? "../data") ?? {};

console.log("loaded data:\n", JSON.stringify(data, null, 1));

server.get("/", async (req, res) => {
  const result = await request(
    process.env.HTTP_PATH ?? "http://coolify:3000/webhooks/traefik/main.json"
  );
  console.log(req.url);
  const body: Traefik = await result.body.json();
  return res.send(replacer(body, data));
});

server.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});