const { load } = require("./libs/csv-parser");

console.log(load("./data.csv"));
/*出力結果
[
  [
    { value: '0', quat: '' },
    { value: '1', quat: '' },
    { value: '2', quat: '' },
    { value: '3', quat: '' },
    { value: '4', quat: '' }
  ],
  [
    { value: 'aa', quat: '"' },
    { value: 'bb', quat: '"' },
    { value: 'cc', quat: '"' },
    { value: 'dd', quat: '"' },
    { value: 'ee', quat: '"' }
  ],
  [ { value: '', quat: '' } ]
]
*/
