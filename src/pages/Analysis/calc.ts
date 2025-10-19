const sum = (codes: string[]) => {
  const r = codes.map(Number).reduce((a, b) => a + b, 0);
  return r;
};
export const baseMoney = 25;
export const winRate = 0.84; // 46倍率, 扣除本金25，净赚21，21/25=0.84
// 哭笑算法
export const yuce = (last1, last2, last3) => {
  let currentDs = last1?.rdm;
  // let currentDs =
  //   last1?.rdm === last2?.rdm && last1?.rdm === last3?.rdm ? last1?.rdm : last1?.rdm === "笑数" ? "哭数" : "笑数";

  // 预判庄家，结果取反
  // currentDs = currentDs === "笑数" ? "哭数" : "笑数";

  // 结果矫正，如果连续3期都没中，本期结果再取反
  if (last1?.sy < 0 && last2?.sy < 0 && last3?.sy < 0) {
    currentDs = currentDs === "笑数" ? "哭数" : "笑数";
  }
  return currentDs;
};
// 合单双算法
// export const yuce = (last1, last2, last3) => {
//   let currentDs =
//     last1?.hds === last2?.hds && last1?.hds === last3?.hds ? last1?.hds : last1?.hds === "合单" ? "合双" : "合单";

//   // 预判庄家，结果取反
//   currentDs = currentDs === "合单" ? "合双" : "合单";

//   // 结果矫正，如果连续3期都没中，本期结果再取反
//   if (last1?.sy < 0 && last2?.sy < 0 && last3?.sy < 0) {
//     currentDs = currentDs === "合单" ? "合双" : "合单";
//   }
//   return currentDs;
// };

// 和大小算法
// export const yuce = (last1, last2, last3) => {
//   let currentDs =
//     last1?.hdx === last2?.hdx && last1?.hdx === last3?.hdx ? last1?.hdx : last1?.hdx === "合大" ? "合小" : "合大";

//   // 预判庄家，结果取反
//   currentDs = currentDs === "合大" ? "合小" : "合大";

//   // 结果矫正，如果连续3期都没中，本期结果再取反
//   if (last1?.sy < 0 && last2?.sy < 0 && last3?.sy < 0) {
//     currentDs = currentDs === "合大" ? "合小" : "合大";
//   }
//   return currentDs;
// };

// 合小 24个
export const hexiaoNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20, 21, 22, 23, 30, 31, 32, 40, 41, 42];
// 合双 24个
export const heshuangNum = [2, 4, 6, 8, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 31, 33, 35, 37, 39, 40, 42, 44, 46, 48];

// 随机数24个, 定义为笑数
export const xiaoNum = [1, 2, 5, 7, 8, 11, 13, 14, 17, 19, 20, 22, 24, 26, 28, 29, 32, 34, 35, 39, 41, 45, 46, 47];
// 剩下25个, 定义为哭数
export const kuNum = [3, 4, 6, 9, 10, 12, 15, 16, 18, 21, 23, 25, 27, 30, 31, 33, 36, 37, 38, 40, 42, 43, 44, 48, 49];

export function calc(list?: any[]) {
  if (!list?.length) return [];

  // 计算单双、大小、合单双、合大小
  const result = list.map((item) => {
    const tema = Number(item.codes[6]);
    const heshu = Math.floor(tema / 10) + (tema % 10);
    return {
      ...item,
      ds: tema % 2 > 0 ? "单" : "双",
      dx: tema > 24 ? "大" : "小",
      hds: heshu % 2 > 0 ? "合单" : "合双",
      rdm: xiaoNum.includes(tema) ? "笑数" : "哭数",
      hdx: hexiaoNum.includes(tema) ? "合小" : "合大",
    };
  });
  // 计算收益
  let total = 0;
  for (let i = result.length - 1; i >= 0; i--) {
    result[i].sy = 0;
    result[i].ljsy = 0;
    if (i >= result.length - 10) {
      continue;
    }
    const last1 = result[i + 1];
    const last2 = result[i + 2];
    const last3 = result[i + 3];
    const last4 = result[i + 4];
    const last5 = result[i + 5];
    const last6 = result[i + 6];
    const last7 = result[i + 7];
    const last8 = result[i + 8];
    const last9 = result[i + 9];
    const last10 = result[i + 10];

    // const preSy = last1.sy + last2.sy;
    let beilv = 1;
    if (last1.sy < 0) {
      beilv = 2;
      if (last2.sy < 0) {
        beilv = 4;
        if (last3.sy < 0) {
          beilv = 8;
          if (last4.sy < 0) {
            beilv = 16;
            if (last5.sy < 0) {
              beilv = 32;
              if (last6.sy < 0) {
                beilv = 64;
                if (last7.sy < 0) {
                  beilv = 128;
                  if (last8.sy < 0) {
                    beilv = 256;
                    if (last9.sy < 0) {
                      beilv = 512;
                      if (last10.sy < 0) {
                        beilv = 1024;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let currentDs = yuce(last1, last2, last3, last4, last5);

    // result[i].sy += currentDs === result[i].hds ? baseMoney * winRate * beilv : -baseMoney * beilv;
    result[i].sy += currentDs === result[i].rdm ? baseMoney * winRate * beilv : -baseMoney * beilv;
    result[i].yazhu = baseMoney * beilv; // 本次押注
    // 累计收益
    total += result[i].sy;
    result[i].ljsy = total;
  }
  // 数据分析，统计result[i].sy 连续为正负数的情况：
  // 给result[i] 添加属性 zslzs（正数连续数）、fslzs（负数连续数）
  for (let i = result.length - 1; i >= 0; i--) {
    result[i].zslzs = 0;
    result[i].fslzs = 0;
    if (i >= result.length - 10) {
      result[i].sy = 0;
      result[i].zslzs = "-";
      continue;
    }
    if (result[i].sy > 0) {
      result[i].zslzs = result[i + 1].sy > 0 ? result[i + 1].zslzs + 1 : 1;
    } else if (result[i].sy < 0) {
      result[i].fslzs = result[i + 1].sy < 0 ? result[i + 1].fslzs + 1 : 1;
    }
  }

  return result;
}
