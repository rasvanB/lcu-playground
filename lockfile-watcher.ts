const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

const DEFAULT_PATH = "C:/Riot Games/League of Legends/lockfile";

const getProcessLocation = (processName: string) => {
  return new Promise((resolve, reject) => {
    // get the command to list all running processes
    const listCommand =
      os.platform() === "win32"
        ? `wmic process where name='${processName}' get commandline`
        : `ps -A | grep ${processName}`;

    // execute the command and capture the output
    exec(listCommand, (err, stdout: string, _) => {
      if (err) {
        reject(err);
        return;
      }
      const location = stdout.split('"')[1].split("/").slice(0, -1).join("/");

      if (!location) reject("Process not found");
      resolve(location);
    });
  });
};

const getLockfileLocation = async () => {
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

const parseLockfile = async (path: string) => {
  try {
  } catch (error) {}
};
