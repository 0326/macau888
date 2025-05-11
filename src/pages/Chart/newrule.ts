/**
 * 新规则，根据历史出现数据频次从高到低，划分新的数据
 */
export const N5 = [49,39,46,14,20,1,3,4,6,5]
export const N4 = [30,21,48,19,35,10,40,8,9,44]
export const N3 = [2,16,41,31,45,11,17,28,22,24]
export const N2 = [27,37,43,18,32,7,25,26,42,13]
export const N1 = [33,36,47,34,12,23,15,29,38]

/**
 * 新规则，根据历史出现数据频次从前到后，平均分配概率
 */
// export const N5 = [49,39,46,14,12,23,15,29,38]
// export const N4 = [30,21,48,19,7,25,26,42,13]
// export const N3 = [2,16,41,31,45,11,17,28,22,24]
// export const N2 = [27,37,43,18,32,35,10,40,8,9,44]
// export const N1 = [33,36,47,34,20,1,3,4,6,5]




export const N = [...N5,...N4,...N3,...N2,...N1]

interface LotteryItem {
    expect: string;
    openTime: string;
    codes: string[];
    waves: string[];
    zodiacs: string[];
}

// 中奖数据转化成新规则的数据
function formatNData(data: LotteryItem[]): number[] {
    return data.map(item => {
        const code = Number(item.codes[6]);
        if (N5.includes(code)) {
            return 5;
        } else if (N4.includes(code)) {
            return 4;
        } else if (N3.includes(code)) {
            return 3;
        } else if (N2.includes(code)) {
            return 2;
        } else if (N1.includes(code)) {
            return 1;
        }
        return 0;
    })
}

// 计算近data.length 期 N5的出现情况
export function calcN5(data: LotteryItem[]) {
    const ns = formatNData(data);
    const result = {
        lianxu2: { name: '连续两次出现N5概率：', value: '', last: '' },
        range5: { name: '5期内出现N5概率：', value: '', last: '' }, 
        lianxuCount: { name: '最多连续出现N5期数：', value: 0, last: '' },
        lianxuNotCount: { name: '最多连续不出现N5期数：', value: 0, last: '' }, 
    }
    let lianxu2Count = 0;
    for (let i = 0; i < ns.length - 1; i++) {
        if (ns[i] === 5 && ns[i + 1] === 5) {
            if (!result.lianxu2.last) {
                result.lianxu2.last = `前${i}天`;
            }
            lianxu2Count++;
        }
    }
    result.lianxu2.value = (lianxu2Count / ns.length).toFixed(2);

    let range5 = 0;
    for (let i = 0; i < ns.length - 1; i += 5) {
        for(let j = i; j < i + 5; j++) {
            if (j >= ns.length - 1) {
                break;
            }
            if (ns[j] === 5) {
                range5++;
                break;
            }
        }
    }
    result.range5.value = (range5 / (ns.length/5)).toFixed(2);

    for (let i = 0; i < ns.length; i++) {
        let count = 0;
        while (ns[i] === 5 && i < ns.length) {
            count++;
            i++;
        }
        if (count > result.lianxuCount.value) {
            result.lianxuCount.value = count;
            result.lianxuCount.last = `前${i}天`;
        }
    }
    for (let i = 0; i < ns.length; i++) {
        let count = 0;
        while (ns[i] !== 5 && i < ns.length) {
            count++;
            i++;
        }
        if (count > result.lianxuNotCount.value) {
            result.lianxuNotCount.value = count;
            result.lianxuNotCount.last = `前${i}天`;
        }
    }

    console.log(result);
    return Object.keys(result).map(key => {
        const item = result[key as keyof typeof result];
        return `${item.name} ${item.value}, 出现时间：${item.last}`
    });
}