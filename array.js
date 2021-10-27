const numbers = new Array(10).fill(0);

console.log(numbers);
/*出力結果
[
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0
]
*/

console.log(numbers.length);
/*出力結果
10
*/

const order = numbers.map((value, index) => {
  return index;
});

console.log(order);
/*出力結果
[
  0, 1, 2, 3, 4,
  5, 6, 7, 8, 9
]
*/

console.log(order.slice().reverse());
/*出力結果
[
  9, 8, 7, 6, 5,
  4, 3, 2, 1, 0
]
*/

console.log(order.some(v => v >= 3));
console.log(order.some(v => v >= 10));
/*出力結果
true
false
*/

console.log(order.find(v => v === 2));
/*出力結果
2
*/

const randomNumbers = new Array(10)
  .fill(0)
  .map(v => Math.floor(Math.random() * 100));
console.log(randomNumbers);
/*出力例
[
   0, 90, 82, 16, 97,
  15, 91,  5, 94,  8
]
*/

console.log(randomNumbers.sort((a, b) => a - b));
/*出力例
[
   0,  5,  8, 15, 16,
  82, 90, 91, 94, 97
]
*/

const series = new Array(10).fill(0).map((v, i) => i * 10);
console.log(series);
/*出力結果
[
   0, 10, 20, 30, 40,
  50, 60, 70, 80, 90
]
*/

console.log(series.slice(1, 3));
/*出力結果
[ 10, 20 ]
*/

console.log(series.slice(5));
/*出力結果
[ 50, 60, 70, 80, 90 ]
*/

console.log(series.slice(-1));
/*出力結果
[ 90 ]
*/

const top2 = series.splice(0, 2);
console.log(top2);
console.log(series);
/*出力結果
[ 0, 10 ]
[
  20, 30, 40, 50,
  60, 70, 80, 90
]
*/

console.log([...top2, ...series]);
/*出力結果
[
   0, 10, 20, 30, 40,
  50, 60, 70, 80, 90
]
*/
