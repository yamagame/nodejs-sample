const data = require("./data.json");
console.log(data);
/*出力結果
{
  '文字列': '文字列です',
  '数値': 100,
  'オブジェクト': { '名前': '山田', '年齢': 24 },
  '配列': [ { '名前': '佐藤' }, { '名前': '鈴木' }, { '名前': '吉田' }, { '名前': '小林' } ]
}
*/

const path = require("path");
const fs = require("fs");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

// オブジェクトを表示
console.log(data);
/*出力結果
{
  '文字列': '文字列です',
  '数値': 100,
  'オブジェクト': { '名前': '山田', '年齢': 24 },
  '配列': [ { '名前': '佐藤' }, { '名前': '鈴木' }, { '名前': '吉田' }, { '名前': '小林' } ]
}
*/

// JSON文字列に整形して表示
console.log(JSON.stringify(data, null, "  "));
/*出力結果
{
  "文字列": "文字列です",
  "数値": 100,
  "オブジェクト": {
    "名前": "山田",
    "年齢": 24
  },
  "配列": [
    {
      "名前": "佐藤"
    },
    {
      "名前": "鈴木"
    },
    {
      "名前": "吉田"
    },
    {
      "名前": "小林"
    }
  ]
}
*/

// 名前プロパティを取り出す
console.log(data["オブジェクト"]["名前"]);
/*出力結果
山田
*/
console.log(data.オブジェクト.名前);
/*出力結果
山田
*/

// 配列のデータを取り出す
data.配列.forEach(function (people) {
  console.log(people);
});
/*出力結果
{ '名前': '佐藤' }
{ '名前': '鈴木' }
{ '名前': '吉田' }
{ '名前': '小林' }
*/

// アロー関数を使って配列のデータを取り出す
data.配列.forEach(pepole => console.log(pepole));
/*出力結果
{ '名前': '佐藤' }
{ '名前': '鈴木' }
{ '名前': '吉田' }
{ '名前': '小林' }
*/

// オブジェクトのキーを取り出す
console.log(Object.keys(data));
/*出力結果
[ '文字列', '数値', 'オブジェクト', '配列' ]
*/
