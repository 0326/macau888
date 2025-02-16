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

export const inPrevNum = (data) => {
    const res = {
        te: 0, // 特码连续出现两次数量
        yes: 0, // 特码在上一期出现过
        perTe: 0,
        perYes: 0,
    }
    for(let i = 0; i < data.length - 1; i++) {
        let te = data[i][6]
        if (data[i+1].includes(te)) {
            res.yes++
            if (te === data[i+1][6]) {
                res.te++
            }
        }
    }
    res.perTe = ((res.te / data.length) * 100).toFixed(2)
    res.perYes = ((res.yes / data.length) * 100).toFixed(2)
    return res
}

export const totalTips = (data) => {
    let str = ''
    const te = data.map(i => i.codes[6])
    const d1 = danshuang(te)
    console.log('分析数据（特码单双）：', d1)
    str += `特码单双分析：出单${d1.dan}次，出双${d1.shuang}次；最大连续出单${d1.maxDan}次,连续双${d1.maxShuang}次` + '\n'
    const d2 = inPrevNum(data.map(i => i.codes))
    console.log('分析数据（特码在上一期出现的概率）：', d2)
    str += `特码数字分析：上期数字包含本期特码出现过${d2.yes}次(${d2.perYes}%),连续两期特码相同出现过${d2.te}次(${d2.perTe}%)`
    return str
}

export default {
    danshuang,
    totalTips,
}