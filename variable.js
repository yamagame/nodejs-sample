// var は使わない
var v1 = 100;

// let は書き換え可能な変数
let v2 = 100;

// const は書き換え不可な変数
const v3 = 200;

// 文字列の定義
const s0 = "です";
const s1 = "'文字列'" + s0;
const s2 = '"文字列"' + s0;
const s3 = `文字列${s0}`;

// 配列
const array = [1, 2, 3, 4, 5, 6];

// 配列要素の取り出し（その１）
const a3 = array[3];
console.log(a3);
/*出力結果
4
*/

// 配列要素の取り出し（その２）
const [a1, a2] = array;
console.log(a1, a2);
/*出力結果
1 2
*/

// オブジェクト(連想配列)
const obj = {
  a: 100,
  b: 200,
};

// パラメータの取り出し（その１）
console.log(obj.a);
/*出力結果
100
*/

// パラメータの取り出し（その２）
const { a, b } = obj;
console.log(a, b);
/*出力結果
100 200
*/

// 閑居変数
console.log(process.env.USER);
/*出力例
user1
*/

// コマンドライン引数
console.log(process.argv[0]);
/*出力k例
/usr/bin/ndoe
*/
