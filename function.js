function hello1() {
  console.log("Hello 1");
}
hello1();
/*出力結果
Hello 1
*/

const hello2 = function () {
  console.log("Hello 2");
};
hello2();
/*出力結果
Hello 2
*/

const hello3 = () => {
  console.log("Hello 3");
};
hello3();
/*出力結果
Hello 3
*/

// 引数
const add1 = (v1, v2) => {
  return v1 + v2;
};
console.log(add1(100, 300));
/*出力結果
400
*/

// 引数（オブジェクト渡し）
const add2 = ({ v1, v2 }) => {
  return v1 + v2;
};
console.log(add2({ v1: 100, v2: 300 }));
/*出力結果
400
*/

// 引数（配列渡し）
const add3 = ([v1, v2]) => {
  return v1 + v2;
};
console.log(add3([100, 300]));
/*出力結果
400
*/
