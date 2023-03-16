import { WebSocket } from "ws";

type LCUWebSocketConfig = {
  port: number;
  password: string;
};

export const createLCUWebSocket = (config: LCUWebSocketConfig) => {
  const ws = new WebSocket(
    `wss://riot:${config.password}@127.0.0.1:${config.port}/`,
    "wamp"
  );

  ws.on("open", () => {
    ws.send(JSON.stringify([5, "OnJsonApiEvent"]));
  });

  ws.on("error", (error) => {
    console.log(error);
    ws.close();
  });

  return ws;
};
