import axios from "axios";
import { Agent } from "https";
import { createLCUWebSocket } from "./lcu-websocket";
import { getLockfileLocation, parseLockfile } from "./lockfile-parser";

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
    const ws = createLCUWebSocket({ port, password });
    ws.on("message", (data) => {
      console.log(JSON.parse(data.toString()));
    });
  } catch (error) {
    console.log(error);
  }
})();
