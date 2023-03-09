import axios from "axios";
import { Agent } from "https";
import { getLockfileLocation, parseLockfile } from "./lockfile-watcher";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Endpoint = `${Method} ${string}`;

const agent = new Agent({
  rejectUnauthorized: false,
});

const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const BASE_URL = "https://127.0.0.1";
const URL_ADDRESS = `${BASE_URL}:${PORT}`;
const NAME = "riot";

const auth = Buffer.from(`${NAME}:${PASSWORD}`).toString("base64");

const sendRequest = async (endpoint: Endpoint) => {
  const [method, path] = endpoint.split(" ");
  try {
    const { data } = await axios.request({
      url: URL_ADDRESS + path,
      method,
      httpsAgent: agent,
      withCredentials: true,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    console.log(data);
    // return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  console.log(await parseLockfile(await getLockfileLocation()));
})();

module.exports = sendRequest;
