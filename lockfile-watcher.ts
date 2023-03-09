import { exec } from "child_process";
import * as z from "zod";
import * as fs from "fs";
import * as os from "os";

const lockfileSchema = z.string().array().min(5);

const DEFAULT_PATH = "C:/Riot Games/League of Legends/lockfile";

const getProcessLocation = (processName: string) => {
  return new Promise((resolve, reject) => {
    const listCommand =
      os.platform() === "win32"
        ? `wmic process where name='${processName}' get commandline`
        : `ps -A | grep ${processName}`;

    exec(listCommand, (err, stdout: string, _) => {
      if (err) reject(err);

      if (stdout.includes('"')) {
        resolve(
          stdout
            .split('"')[1]
            .split(stdout.split('"')[1].includes("\\") ? "\\" : "/")
            .slice(0, -1)
            .join("/")
        );
      } else reject("Process not found");
    });
  });
};

export const getLockfileLocation = async () => {
  if (fs.existsSync(DEFAULT_PATH)) return DEFAULT_PATH;
  try {
    const location = await getProcessLocation("LeagueClientUx.exe");
    return location + "/lockfile";
  } catch (error) {
    throw new Error(
      "Lockfile not found, please run League of Legends Client first!"
    );
  }
};

export const parseLockfile = async (path: string) => {
  try {
    const fileData = fs.readFileSync(path, "utf8").split(":");
    const parsedData = lockfileSchema.parse(fileData);
    return {
      port: Number(parsedData[2]),
      password: parsedData[3],
    };
  } catch (error) {
    throw new Error("Error reading lockfile");
  }
};
