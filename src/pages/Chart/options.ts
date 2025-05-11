import { redNums, greenNums, blueNums } from './origindata'
import { N1, N2, N3, N4, N5 } from './newrule'

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