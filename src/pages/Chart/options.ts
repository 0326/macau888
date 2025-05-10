import { redNums, greenNums, blueNums } from './origindata'

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

export const getBarOptions = (rdata: LotteryItem[], action?: string) => {
    let data = rdata;
    if (action === 'tm') {
        data = getTmData(rdata);
    } else if (action === 'tmw') {
        data = getTmwData(rdata);
    } else if (action === 'tmt') {
        data = getTmtData(rdata);
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
        dataZoom: action ? false : [
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
        series: [
          {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                color: '#333'
              },
              itemStyle: {
                color: (params) => {
                    if (action === 'tm') {
                        return getBoColorByValue(Number(params.name));
                    }
                    if (action === 'tmw' || action === 'tmt') {
                        return '#ff7500';
                    }
                  return getBoColorByValue(params.value);
                }
              },
            data: data?.map(item => item.num || Number(item.codes?.[6])),
            large: true
          }
        ]
      };
      return barOption;      
}
