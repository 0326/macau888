import { redNums, greenNums, blueNums } from './origindata'
import { N1, N2, N3, N4, N5, S1, S2, S3 } from './newrule'

interface LotteryItem {
    expect: string;
    openTime: string;
    codes: string[];
    waves: string[];
    zodiacs: string[];
}

function getBoColorByValue(value: number) {
    if (redNums.includes(value)) {
        return 'red';
      } else if (greenNums.includes(value)) {
        return 'green';
      } else if (blueNums.includes(value)) {
        return 'blue';
      }
      return 'black';
}

function getSnumberColor(value: number) {
    if (S3.includes(value)) {
        return '#000';
      } else if (S2.includes(value)) {
        return '#888';
      } else if (S1.includes(value)) {
        return '#eee';
      }
      return '#eee';
}

// 获取特码出现频次数据
function getTmData(data: LotteryItem[]) {
    const result = new Array(49).fill(0);
    data.map(item => {
        const code = Number(item.codes[6]);
        result[code - 1]++;
    })
    return result.map((item, index) => {
        return {
            expect: index + 1,
            num: item,
        }
    }).sort((a, b) => b.num - a.num);
}
// 获取特码尾号出现频次数据
function getTmwData(data: LotteryItem[]) {
    const result = new Array(10).fill(0);
    data.map(item => {
        const codew = Number(item.codes[6]) % 10;
        result[codew]++;
    })
    return result.map((item, index) => {
        return {
            expect: `${index}尾`,
            num: item,
        }
    }).sort((a, b) => b.num - a.num);
}

// 获取特码头号出现频次数据
function getTmtData(data: LotteryItem[]) {
    const result = new Array(5).fill(0);
    data.map(item => {
        const codet = Math.floor(Number(item.codes[6]) / 10);
        result[codet]++;
    })
    return result.map((item, index) => {
        return {
            expect: `${index}头`,
            num: item,
        }
    }).sort((a, b) => b.num - a.num);
}

function getNData(rdata: LotteryItem[]) {
    const data =  rdata.map(item => {
        const code = Number(item.codes[6]);
        let num = '';
        if (N5.includes(code)) {
            num = '5';
        } else if (N4.includes(code)) {
            num = '4';
        } else if (N3.includes(code)) {
            num = '3';
        } else if (N2.includes(code)) {
            num = '2';
        } else if (N1.includes(code)) {
            num = '1';
        }
        return { ...item, num }
    })

    return data;
}

function getSData(rdata: LotteryItem[]) {
    const data =  rdata.map(item => {
        const code = Number(item.codes[6]);
        let num = '';
        if (S3.includes(code)) {
            num = '3';
        } else if (S2.includes(code)) {
            num = '2';
        } else if (S1.includes(code)) {
            num = '1';
        }
        return { ...item, num }
    })

    return data;
}

function getNtmData(data: LotteryItem[]) {
    const result = new Array(5).fill(0);
    data.map(item => {
        const code = Number(item.num);
        result[code - 1]++;
    })
    return result.map((item, index) => {
        return {
            expect: index + 1,
            num: item,
        }
    }).sort((a, b) => b.num - a.num);
}


function getStmData(data: LotteryItem[]) {
    const result = new Array(3).fill(0);
    data.map(item => {
        const code = Number(item.num);
        result[code - 1]++;
    })
    return result.map((item, index) => {
        return {
            expect: index + 1,
            num: item,
        }
    }).sort((a, b) => b.num - a.num);
}

export const getBarOptions = (rdata: LotteryItem[], action?: string, prevData?: LotteryItem[]) => {
    let data = rdata;
    let pdata = null;
    if (action === 'tm') {
        data = getTmData(rdata);
        pdata = getTmData(prevData || [])
    } else if (action === 'tmw') {
        data = getTmwData(rdata);
    } else if (action === 'tmt') {
        data = getTmtData(rdata);
    } else if (action === 'n') {
        data = getNData(rdata);
    } else if (action === 'ntm') {
        data = getNtmData(getNData(rdata));
    } else if (action === 'stm') {
        data = getStmData(getSData(rdata));
    }
    console.log('nowData, prevData', data, pdata)
    const series = [
    {
        type: 'bar',
        name: '近50期',
        label: {
            show: true,
            position: 'top',
            color: '#333'
        },
        itemStyle: prevData ? {} : {
            color: (params) => {
                if (action === 'sall') {
                    return getSnumberColor(params.value);
                }
                if (action === 'tm') {
                    return getBoColorByValue(Number(params.name));
                }
                if (action === 'tmw' || action === 'tmt' || action === 'ntm') {
                    return '#ff7500';
                }
            return getBoColorByValue(params.value);
            }
        },
        data: data?.map(item => item.num || Number(item.codes?.[6])),
        large: true
    }
    ]

    if (pdata) {
        series.push({
            ...series[0],
            name: '上50期',
            data: pdata?.map(item => item.num || Number(item.codes?.[6])),
        })
    }
    
    const barOption = {
        // title: {
        //   text: '历年中奖特码分布(号码/期数)',
        //   left: 'center'
        // },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
            top: 20,
          bottom: 90
        },
        dataZoom: [
          {
            type: 'inside'
          },
          {
            type: 'slider',
            // 设置无效？
            // rangeMode: ['value', 'value'],
            // startValue: '2024366',
            // endValue: '2024360',
          }
        ],
        xAxis: {
          data: data?.map(item => item.expect),
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series,
      };
      return barOption;      
}


export const getPieOptions = (rdata: LotteryItem[], action?: string) => {
    let data = rdata;
    const boseData = {};
    rdata.map(item => {
        const wave = action == 'sx' ? item.zodiacs[6] : item.waves[6];
        if (!boseData[wave]) {
            boseData[wave] = 1;
        } else {
            boseData[wave as keyof typeof boseData]++;
        }
    })
    return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
        },
        grid: {
          top: 0,
        },
        series: [
          {
            name: '波色',
            type: 'pie',
            radius: '50%',
            data: Object.keys(boseData).map(key => {
                return {
                    value: boseData[key as keyof typeof boseData],
                    name: key,
                }
            }),
            itemStyle: {
                color: action === 'sx' ? undefined : (params) => {
                  return params.name;
                }
              },
          }
        ]
      }
}

export function getBar2Options(data: LotteryItem[], action?: string) {
    const sMap = {};
    data?.map(item => {
        const code = Number(item.codes[6]);
        let num = '';
        if (S3.includes(code)) {
            sMap['S3'] === undefined ? (sMap['S3'] = 1) : sMap['S3']++;
        } else if (S2.includes(code)) {
            sMap['S2'] === undefined? (sMap['S2'] = 1) : sMap['S2']++;
        } else if (S1.includes(code)) {
            sMap['S1'] === undefined? (sMap['S1'] = 1) : sMap['S1']++;
        }
    })
    console.log('sMap', sMap, data.length)
    const sdata = [sMap['S3']/data.length, sMap['S2']/data.length, sMap['S1']/data.length]
    const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        xAxis: {
          type: 'category',
          data: ['S3', 'S2', 'S1']
        },
        series: [
          {
            name: '当前概率',
            type: 'bar',
            data: sdata,
          },
          {
            name: '历史平均概率',
            type: 'bar',
            data: [0.39367, 0.30267, 0.28418]
          }
        ]
      };
      return option;
}