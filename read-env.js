const { load } = require("./libs/env-parser");

console.log(load("./data.env"));
/*εΊεη΅ζ
[
  { key: 'ENV1', value: 'Hello Env1', quoted: '"' },
  { key: 'ENV2', value: 'Hello Env2', quoted: '' }
]
*/
