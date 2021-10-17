const util = require("util");
const { exec, execFile, spawn } = require("child_process");

// exec ブロッキング実行
function execCommand1(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(0);
    });
  });
}

// exec ブロッキング実行（その２）
async function execCommand2(command) {
  const exec = util.promisify(require("child_process").exec);
  const { stdout, stderr } = await exec(command);
  console.log("stdout:", stdout);
  console.error("stderr:", stderr);
}

// execFile ブロッキング実行
async function execFileCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      resolve(0);
    });
  });
}

// spwan ストリーム実行
function spawnCommand(command, args = []) {
  return new Promise(resolve => {
    const ls = spawn(command, args);

    ls.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", data => {
      console.error(`stderr: ${data}`);
    });

    ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
      resolve(code);
    });
  });
}

async function main() {
  console.log("# execCommand1");
  await execCommand1("ls -h");
  /*出力例
  # execCommand1
  stdout: process.js

  stderr:
  */

  console.log("# execCommand2");
  await execCommand2("ls -h");
  /*出力例
  # execCommand2
  stdout: process.js

  stderr:
  */

  console.log("# execFileCommand");
  await execFileCommand("ls", ["-h"]);
  /*出力例
  # execFileCommand
  stdout: process.js
  */

  console.log("# spawnCommand");
  await spawnCommand("ls", ["-h"]);
  /*出力例
  # execCommand2
  stdout: process.js

  child process exited with code 0
  */
}

console.log("## start");
main().then(() => {
  console.log("## end");
});
