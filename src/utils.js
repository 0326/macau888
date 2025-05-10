/**
 * 单双数据统计
 * @returns 
 */
export const danshuang = (data) => {
    const res = { dan: 0, shuang: 0, maxDan: 1, maxShuang: 1 }

    let maxDan = 1, maxShuang = 1;
    for(let i = 0; i < data.length; i++) {
        if (data[i]%2 === 1) {
            res.dan++
            if (i > 0 && data[i-1]%2 === data[i]%2) {
                maxDan++
            } else {
                res.maxDan = Math.max(res.maxDan, maxDan) 
                maxDan = 1
            }
            continue
        }
        
        res.shuang++
        if (i > 0 && data[i-1]%2 === data[i]%2) {
            maxShuang++
        } else {
            res.maxShuang = Math.max(res.maxShuang, maxShuang) 
            maxShuang = 1
        }
    }
    res.maxShuang = Math.max(res.maxShuang, maxShuang) 
    res.maxDan = Math.max(res.maxDan, maxDan) 
    console.log('danshuang', res)
    return res
}

// 当前特码在上一期的出现情况
export const inPrevNum = (data) => {
    const res = {
        te: 0, // 特码连续出现两次数量
        yes: 0, // 特码在上一期出现过
        yes3: 0, // 三期内出现过两次特码
        perTe: 0,
        perYes: 0,
        perYes3: 0,
    }
    for(let i = 0; i < data.length - 1; i++) {
        let te = data[i][6]
        if (data[i+1].includes(te)) {
            res.yes++
            if (te === data[i+1][6]) {
                res.te++
            }
        }
        // 三期内是否出现过2次特码
        if (i >=2 && (data[i-2][6] == data[i-1][6] || data[i-2][6] == data[i][6] || data[i-1][6] == data[i][6])) {
            res.yes3++
        }
    }
    res.perTe = ((res.te / data.length) * 100).toFixed(2)
    res.perYes = ((res.yes / data.length) * 100).toFixed(2)
    res.perYes3 = ((res.yes3 / data.length) * 100).toFixed(2)
    return res
}

/**
 * 按照特码的出现频率 从高到低排序进行排序
 * @returns 
 */
export function sortByFreq(data, start = 0, end = 100) {
    const te = data.slice(start, end).map(i => Number(i.codes[6]))
    const res = new Array(50).fill(0)
    te.forEach(num => {
        res[num]++
    });
    let result = [];
    res.map((count, index) => {
        if (index > 0) {
            result.push({ count, num: index })
        }
    })
    result = result.sort((a, b) => b.count - a.count)
    return result
}

// 根据数字出现的频率进行计算，取历史前100期数据排序，按照频率取前10+后10，并且排除上一期出现过的号码
export function  lotteryByFreq(data, expect = 200) {
    const lotteryRes = []
    const headOffset = 0
    const tailOffset = 10
    if (!data || !data.length) return ''
    for(let i = 0; i< expect - 3; i++) {
        // 保存前两期出现的数字
        const prev2 = [data[i+1][6], data[i+2][6]]
        // 计算前100期历史数据
        const sortData100 = sortByFreq(data, i+1, i+1+expect)
        // 在这100期里面取前面10+offset个+后面10+offset个
        const selects = []
        for(let i = 0; i < sortData100.length && selects.length < 24; i++) {
            const head = sortData100[i+headOffset].num
            const tail = sortData100[sortData100.length - i - 1 - tailOffset].num
            if (!prev2.includes(head)) {
                selects.push(head)
            }
            if (!prev2.includes(tail)) {
                selects.push(tail)
            }
        }
        // 判断当期数字是否在selects里面，是则中奖
        if (selects.includes(Number(data[i].codes[6]))) {
            lotteryRes.push(1)
        } else {
            lotteryRes.push(0)
        }
    }
    console.log(`中奖结果，共${lotteryRes.length}期，中奖 ${lotteryRes.filter(i => i > 0).length}次`)
    return lotteryRes
}


export const totalTips = (data) => {
    let str = ''
    if (!data || !data.length) return ''
    const te = data.map(i => i.codes[6])
    const d1 = danshuang(te)
    console.log('分析数据（特码单双）：', d1)
    str += `特码单双分析：出单${d1.dan}次，出双${d1.shuang}次；最大连续出单${d1.maxDan}次,连续双${d1.maxShuang}次` + '\n'
    const d2 = inPrevNum(data.map(i => i.codes))
    console.log('分析数据（特码在上一期出现的概率）：', d2)
    str += `特码数字分析：上期数字包含本期特码出现过${d2.yes}次(${d2.perYes}%),连续两期特码相同出现过${d2.te}次(${d2.perTe}%),三期内出现过相同特码${d2.yes3}次(${d2.perYes3}%)`
    console.log('lotteryByFreq', lotteryByFreq(data))
    return str
}

/**
 * 特码生肖在上期出现概率
 */
export const temasx =(data) => {
    let str = ''
    if (!data || !data.length) return ''
    const zodiacs = data.map(i => i.zodiacs)
    const len = zodiacs.length;
    let isInCount = 0
    for(var i = 0; i < len -1; i++) {
        const zst = zodiacs[i][6]
        // const isIn = zodiacs[i+1].indexOf(zst) >= 0
        const isIn = zodiacs[i+1][6] == zst
        if (isIn) {
            isInCount++
        }
    }
    str += `特码生肖分析：本期特码在上期出现过${isInCount}次，出现概率${isInCount/len}` + '\n'
    return str
}

export default {
    danshuang,
    totalTips,
    temasx,
}