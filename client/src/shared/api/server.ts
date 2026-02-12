import { treaty } from "@elysiajs/eden";
import type { App } from "../../../../server/src";

export const api = treaty<App>("localhost:3001", {
  fetch: {
    credentials: "include",
  },
});
