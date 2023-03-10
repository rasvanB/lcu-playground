import { exec } from "child_process";
import * as z from "zod";
import * as fs from "fs";

const lockfileSchema = z.string().array().min(5);

const DEFAULT_PATH = "C:/Riot Games/League of Legends/lockfile";

const getProcessLocation = (processName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const listCommand = `wmic process where name='${processName}' get commandline`;

    exec(listCommand, (err, stdout: string, _) => {
      if (err) reject(err);
      let output = stdout.replace("CommandLine", "").trim();

      if (output.includes('"')) {
        resolve(output.split('"')[1].replace(processName, ""));
        return;
      }
      reject("Process not found");
    });
  });
};

export const getLockfileLocation = async () => {
  if (fs.existsSync(DEFAULT_PATH)) return DEFAULT_PATH;
  try {
    const location = await getProcessLocation("LeagueClientUx.exe");
    return location + "lockfile";
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
