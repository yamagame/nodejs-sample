const { load } = require("./libs/env-parser");

console.log(load("./data.env"));
/*出力結果
[
  { key: 'ENV1', value: 'Hello Env1', quoted: '"' },
  { key: 'ENV2', value: 'Hello Env2', quoted: '' }
]
*/
