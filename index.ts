import axios from "axios";
import { Agent } from "https";
import { WebSocket } from "ws";
import { getLockfileLocation, parseLockfile } from "./lockfile-watcher";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const agent = new Agent({
  rejectUnauthorized: false,
});

const BASE_URL = "https://127.0.0.1";

export const callAPI = async (
  method: Method,
  path: string,
  auth: string,
  port: number
) => {
  try {
    const { data } = await axios.request({
      url: `${BASE_URL}:${port}` + path,
      method,
      httpsAgent: agent,
      withCredentials: true,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  try {
    const { port, password } = await parseLockfile(await getLockfileLocation());
    console.log({ port, password });
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    const ws = new WebSocket(
      `wss://riot:${password}@127.0.0.1:${port}/`,
      "wamp"
    );
    ws.on("open", () => {
      const json = JSON.stringify([5, "OnJsonApiEvent"]);
      ws.send(json);
    });
    ws.on("message", (data) => {
      console.log(JSON.parse(data.toString()));
    });
    ws.on("error", (error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
})();
