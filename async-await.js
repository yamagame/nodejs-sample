/**
 * 指定秒数待つ関数
 */
const wait = second => {
  console.log(`> start ${second}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(second);
      console.log(`> end ${second}`);
    }, second * 1000);
  });
};

/**
 * Promise で逐次実行
 */
function main() {
  return new Promise(resolve => resolve())
    .then(result => {
      return wait(1);
    })
    .then(result => {
      console.log(`==> result`, result);
      return wait(2);
    })
    .then(result => {
      console.log(`==> result`, result);
      return wait(3);
    })
    .then(result => {
      console.log(`==> result`, result);
    });
}

/**
 * Promise で逐次実行 callback地獄
 */
function callbackHell() {
  return new Promise(resolve => {
    wait(1).then(result => {
      console.log(`==> result`, result);
      wait(2).then(result => {
        console.log(`==> result`, result);
        wait(3).then(result => {
          console.log(`==> result`, result);
          resolve();
        });
      });
    });
  });
}

/**
 * await で逐次実行
 */
async function mainAsync() {
  console.log(`==> result`, await wait(1));
  console.log(`==> result`, await wait(2));
  console.log(`==> result`, await wait(3));
}

/**
 * await がないとバグる
 */
function bug() {
  console.log(`==> result`, wait(1));
  console.log(`==> result`, wait(2));
  console.log(`==> result`, wait(3));
}

main().then(result => {
  process.exit(result);
});
