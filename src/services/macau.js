import { d2020, d2021, d2022, d2023, d2024, d2025 } from "./data"
const getLotteryByYear = async function (year) {
    var url = `https://history.macaumarksix.com/history/macaujc2/y/${year}`
    const res = await fetch(url)
    const data = await res.json()
    return data.data.map(item => ({
        expect: item.expect,
        openTime: item.openTime.split(' ')[0],
        codes: item.openCode.split(','),
        waves: item.wave.split(','),
        zodiacs: item.zodiac.split(','),
    }))
}

export const getAllDataSync = () => {
    return [...d2025,...d2024, ...d2023, ...d2022, ...d2021, ...d2020]
}

/**
 * 获取历史所有中奖记录，
 * @returns 
 */
const getAllHistoryData = async () => {
    const data = await getLotteryByYear(2025)
    const res = []
    for(let i = 0; i < data.length; i++) {
        if (data[i].expect === d2024[0].expect) {
            break;
        }
        res.push(data[i]);
    }
    res.push(...d2024, ...d2023, ...d2022, ...d2021, ...d2020)
    return res
}

export {
    getLotteryByYear,
    getAllHistoryData
}