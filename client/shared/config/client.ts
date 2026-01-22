import { treaty } from "@elysiajs/eden";
import { type App } from "../../../server/src/index";

const client = treaty<App>("localhost:3001");

const chat = client.chat.subscribe();

chat.subscribe((message) => {
  console.log("got", message);
});

chat.on("open", () => {
  chat.send("hello from client");
});
