const sum = (codes: string[]) => {
  const r = codes.map(Number).reduce((a, b) => a + b, 0);
  return r;
};
export const baseMoney = 25;
export const winRate = 0.84; // 46倍率, 扣除本金25，净赚21，21/25=0.84

export const yuce = (last1, last2, last3) => {
  let currentDs =
    last1.hds === last2.hds && last1.hds === last3.hds ? last1.hds : last1.hds === "合单" ? "合双" : "合单";

  // 预判庄家，结果取反
  currentDs = currentDs === "合单" ? "合双" : "合单";

  // 结果矫正，如果连续3期都没中，本期结果再取反
  if (last1.sy < 0 && last2.sy < 0 && last3.sy < 0) {
    currentDs = currentDs === "合单" ? "合双" : "合单";
  }
  return currentDs;
};

export function calc(list?: any[]) {
  if (!list?.length) return [];

  // 计算单双、大小、合单双、合大小
  const result = list.map((item) => {
    return {
      ...item,
      ds: item.codes[6] % 2 > 0 ? "单" : "双",
      dx: item.codes[6] > 24 ? "大" : "小",
      hds: sum(item.codes) % 2 > 0 ? "合单" : "合双",
      hdx: sum(item.codes) / 7 > 24 ? "合大" : "合小",
    };
  });
  // 计算收益
  let total = 0;
  for (let i = result.length - 1; i >= 0; i--) {
    result[i].sy = 0;
    result[i].ljsy = 0;
    if (i >= result.length - 3) {
      continue;
    }
    const last1 = result[i + 1];
    const last2 = result[i + 2];
    const last3 = result[i + 3];

    // const preSy = last1.sy + last2.sy;
    let beilv = 1;
    // if (preSy < -50) {
    //   beilv = 3;
    // } else if (preSy < 0) {
    //   beilv = 2;
    // }
    let currentDs = yuce(last1, last2, last3);

    result[i].sy += currentDs === result[i].hds ? baseMoney * winRate * beilv : -baseMoney * beilv;

    // 累计收益
    total += result[i].sy;
    result[i].ljsy = total;
  }
  // 数据分析，统计result[i].sy 连续为正负数的情况：
  // 给result[i] 添加属性 zslzs（正数连续数）、fslzs（负数连续数）
  for (let i = result.length - 1; i >= 0; i--) {
    result[i].zslzs = 0;
    result[i].fslzs = 0;
    if (i >= result.length - 1) {
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
