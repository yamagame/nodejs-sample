/**
 * CSVマクロパーサー
 * 文字列の比較のみ可能なエクセル風数式パーサ。
 */
const TOKEN = {
  add: "add",
  string: "string",
  open: "open",
  close: "close",
  separator: "separator",
  number: "number",
  space: "space",
  word: "word",
  eq: "eq",
  not: "not",
  end: "end",
  and: "and",
  or: "or",
};

const token = function (str) {
  let token = [];
  let word = "";
  const push = (str, type) => {
    if (word !== "") {
      token.push({ word, type: TOKEN.word });
      word = "";
    }
    token.push({ word: str, type });
  };
  for (var i = 0; i < str.length; i++) {
    if (str[i] == "+") {
      push(str[i], TOKEN.add);
    } else if (str[i] == "(") {
      push(str[i], TOKEN.open);
    } else if (str[i] == ")") {
      push(str[i], TOKEN.close);
    } else if (str[i] == ",") {
      push(str[i], TOKEN.separator);
    } else if (str[i] == "'" || str[i] == '"') {
      let s = "";
      for (var j = i + 1; j < str.length; j++) {
        if (str[j] === "\\") {
          j++;
          if (j < str.length) {
            const escapeSequence = {
              b: "\b",
              t: "\t",
              n: "\n",
              r: "\r",
              f: "\f",
              "'": "'",
              '"': '"',
              "`": "`",
              "\\": "\\",
              0: "\0",
            };
            if (escapeSequence[str[j]]) {
              s += escapeSequence[str[j]];
            } else {
              s += str[j];
            }
            j++;
          }
          continue;
        } else if (str[j] === str[i]) {
          break;
        }
        s += str[j];
      }
      i = j;
      push(s, TOKEN.string);
    } else {
      const tokens = [
        { reg: /^[0-9]*/, type: TOKEN.number },
        { reg: /^==/, type: TOKEN.eq },
        { reg: /^!=/, type: TOKEN.not },
        { reg: /^&&/, type: TOKEN.and },
        { reg: /^||/, type: TOKEN.or },
        { reg: /^\s*/, type: TOKEN.space },
      ];
      if (
        !tokens.some(token => {
          const w = str.substr(i).match(token.reg);
          if (w && w[0] !== "") {
            i += w[0].length - 1;
            if (token.type === TOKEN.number && word !== "") {
              word += w[0];
            } else if (token.type !== TOKEN.space) {
              push(w[0], token.type);
            }
            return true;
          }
        })
      ) {
        word += str[i];
      }
    }
  }
  push("", TOKEN.end);
  return token;
};

// #EBNF
// func  = word "(" args ")"
// args = param ( , param)*
// param = func | expr
// expr = logic ( + logic )*
// logic = prim ( op prim)*
// prim = value | "(" expr ")"
// value = num | string | func | range
// op = "==" | "!=" | "&&" | "||"

const expression = function (token) {
  let p = 0;

  function func() {
    let node = word();
    if (node) {
      if (token[p].type === TOKEN.open) {
        p++;
        node = ["func", node, args()];
        if (token[p].type === TOKEN.close) {
          p++;
          return node;
        }
      }
      p--;
    }
    return null;
  }

  function args() {
    let node = ["args", expr()];
    if (node) {
      while (true) {
        if (token[p].type === TOKEN.separator) {
          p++;
          node.push(expr());
        } else {
          return node;
        }
      }
    }
    return null;
  }

  function expr() {
    let node = logic();
    if (node) {
      while (true) {
        if (token[p].type === TOKEN.add) {
          p++;
          node = ["add", node, logic()];
        } else {
          return node;
        }
      }
    }
    return null;
  }

  function logic() {
    let node = prim();
    if (node) {
      while (true) {
        if (token[p].type === TOKEN.eq) {
          p++;
          node = ["eq", node, prim()];
        } else if (token[p].type === TOKEN.not) {
          p++;
          node = ["not", node, prim()];
        } else if (token[p].type === TOKEN.and) {
          p++;
          node = ["and", node, prim()];
        } else if (token[p].type === TOKEN.or) {
          p++;
          node = ["or", node, prim()];
        } else {
          return node;
        }
      }
    }
    return null;
  }

  function prim() {
    if (token[p].type === TOKEN.open) {
      p++;
      let node = expr();
      if (token[p].type === TOKEN.close) {
        p++;
        return node;
      }
    } else {
      let node = value();
      return node;
    }
    return null;
  }

  function word() {
    if (token[p].type === TOKEN.word) {
      const { word } = token[p++];
      return ["word", { word }];
    }
    return null;
  }

  function range() {
    if (token[p].type === TOKEN.word) {
      const { word } = token[p++];
      return ["range", { word, range: parseRange(word) }];
    }
    return null;
  }

  function value() {
    if (token[p].type === TOKEN.number) {
      return ["number", { num: token[p++].word }];
    }
    if (token[p].type === TOKEN.string) {
      return ["string", { string: token[p++].word }];
    }
    let node = func();
    if (node) {
      return node;
    }
    node = range();
    if (node) {
      return node;
    }
    return null;
  }

  return expr();
};

const executor = function (cell, node, range, callback) {
  const { x, y } = cell;
  const { p1, p2 } = range;
  if (p1 && p2) {
    if (p1.x > x || p1.y > y || p2.x < x || p2.y < y) return false;
  } else if (p1) {
    if (p1.x > x || p1.y > y) return false;
  }
  const exec = node => {
    switch (node[0]) {
      case "func": {
        const name = node[1][1].word;
        return callback(name, exec(node[2][1]));
      }
      case "range":
        return callback(node[0], node[1]);
      case "string":
        return node[1].string;
      case "add":
      case "and":
      case "or":
      case "eq":
      case "not":
        return callback(node[0], exec(node[1]), exec(node[2]));
      default:
        throw new Error(`undefined operator ${node[0]}`);
    }
  };
  return exec(node);
};

const operator = (offset, getCellText) => {
  const getCell = (x, y) => {
    try {
      return getCellText(x, y);
    } catch (err) {
      return "";
    }
  };
  return (operator, ...args) => {
    switch (operator) {
      case "CELL": {
        const p = parseRange(args[0]);
        const { x, y } = calcPosition(p.p1, offset);
        return getCell(x, y);
      }
      case "range":
        return value(args[0].range, offset, getCell);
      case "eq":
        return args[0] === args[1];
      case "not":
        return args[0] !== args[1];
      case "and":
        return args[0] && args[1];
      case "or":
        return args[0] || args[1];
      case "add":
        return args[0] + args[1];
      default:
        throw new Error(`undefined operator ${operator}`);
    }
  };
};

const position = pos => {
  const str = pos.toUpperCase();
  const aCode = "A".charCodeAt(0);
  const zCode = "Z".charCodeAt(0);
  const zeroCode = "0".charCodeAt(0);
  const nineCode = "9".charCodeAt(0);
  let x = 0;
  let y = 0;
  let step = 0;
  let absoluteX = false;
  let absoluteY = false;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (str[i] === "$") {
      if (step === 0) {
        absoluteX = true;
      } else {
        absoluteY = true;
      }
    } else if (c >= aCode && c <= zCode) {
      x *= zCode - aCode + 1;
      x += c - aCode;
      step = 1;
    } else if (c >= zeroCode && c <= nineCode) {
      y *= nineCode - zeroCode + 1;
      y += c - zeroCode;
    } else {
      throw new Error(`invalid range character code: ${str[i]}`);
    }
  }
  return { x, y, absolute: { x: absoluteX, y: absoluteY } };
};

const parseRange = range => {
  const w = range.toString().split(":");
  if (w.length >= 2) {
    if (w[0] === "") {
      return { p2: position(w[1]) };
    } else {
      return { p1: position(w[0]), p2: position(w[1]) };
    }
  }
  return { p1: position(w[0]) };
};

const calcPosition = (pos, offset) => {
  let x = pos.x;
  let y = pos.y;
  if (!pos.absolute.x) {
    x += offset.x;
  }
  if (!pos.absolute.y) {
    y += offset.y;
  }
  return { x, y };
};

const value = (range, offset, callback) => {
  const p1 = range.p1 ? range.p1 : { x: 0, y: 0 };
  const { x, y } = calcPosition(p1, offset);
  return callback(x, y);
};

module.exports.token = token;
module.exports.expression = expression;
module.exports.executor = executor;
module.exports.operator = operator;
module.exports.value = value;
module.exports.range = parseRange;
module.exports.compile = macro => {
  const step1 = token(macro);
  return expression(step1);
};

if (require.main === module) {
  const assert = (a, v, message) => {
    if (a !== v) {
      throw new Error(`NG: ${message}\n  expected: ${v}\n  actual: ${a}`);
    }
    console.log(`OK: ${message}`);
  };

  /**
   * 以下、使用例
   */
  const offset = {
    x: 0,
    y: 0,
  };
  const table = [
    [1, 2, 3, 4],
    ["A", "B", "C", "D"],
    [1, 2, 3, 4],
    ["A", "B", "C", "D"],
  ];
  const execMacro = (offset, table, macro) => {
    const step1 = token(macro);
    // console.log(step1);
    const step2 = expression(step1);
    // console.dir(step2, { depth: null });
    const getCellText = (x, y) => {
      return table[y][x];
    };
    const step3 = executor(
      { x: 0, y: 0 },
      step2,
      parseRange(""),
      operator(offset, getCellText)
    );
    // console.dir(step3, { depth: null });
    return step3;
  };
  if (process.argv[2]) {
    execMacro(offset, table, process.argv[2]);
    process.exit(0);
  }
  // prettier-ignore
  {
    assert(execMacro(offset, table, `CELL("A0")`), 1, `CELL("A0") : 1`);
    assert(execMacro(offset, table, `CELL(C1+B0)`), 3, `CELL(C1+B0) : 3`);
    assert(execMacro(offset, table, `A0 == A2`), true, `A0 == A2 : true`);
    assert(execMacro(offset, table, `(A1+A0) == (A3+A2)`), true,`(A1+A0) == (A3+A2) : true`);
    assert(execMacro(offset, table, `(A1+A0) != (A3+A2)`), false, `(A1+A0) != (A3+A2) : false`);
    assert(execMacro(offset, table, `("A" == A1) && ("B" == B1)`), true, `("A" == A1) && ("B" == B1) : true`);
    assert(execMacro({ x: 1, y: 3}, table, `CELL("$A$0")`), 1, `CELL("$A$0") : 1`);
    assert(execMacro({ x: 1, y: 3}, table, `CELL("A0")`), "B", `CELL("A0") : B`);
    assert(execMacro({ x: 1, y: 3}, table, `$A$0`), 1, `$A$0 : 1`);
    assert(execMacro({ x: 1, y: 3}, table, `A0`), "B", `A0 : B`);
  }
}
