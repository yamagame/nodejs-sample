process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => {
  process.stdout.write(chunk.toUpperCase());
});
process.stdin.on("end", function () {
  console.log("### END");
});

/*
# 名前付き fifo を使った例

# fifo を作成
$ mkfifo /tmp/testfifo

# fifo からの入力を待つ
$ node stdin.js < /tmp/testfifo

# fifo に入力する
$ echo hello > /tmp/testfifo
*/
