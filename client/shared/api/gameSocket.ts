import { api } from "./server";

let gameWebsocket: ReturnType<typeof api.game.subscribe> | null = null;

export const getGameWebsocket = () => {
  if (!gameWebsocket) {
    gameWebsocket = api.game.subscribe();
  }
  return gameWebsocket;
};
