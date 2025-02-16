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

export {
    getLotteryByYear
}