import React, { useEffect } from 'react';
import { Tabs, Slider, Select, Flex, Typography } from 'antd';
import type { TabsProps } from 'antd';
import ReactECharts from 'echarts-for-react'; 
import { d20212024 } from './origindata'
import { getBarOptions, getPieOptions } from './options';
import { getLotteryByYear } from '../../services/macau';
import { calcN5, N1, N2, N3, N4, N5 } from './newrule';

const expectOptions = [
    { value: 5, label: '近5期' },
    { value: 50, label: '近50期' },
    { value: 100, label: '近100期' },
    { value: 200, label: '近200期' },
    { value: 500, label: '近500期' },
    { value: 1000, label: '近1000期' },
    { value: 0, label: '所有期数' },
]
// 定义一个函数式组件（FC）
const Chart: React.FC = () => {
  const [data, setData] = React.useState<any>([]);
  const [expectLength, setExpectLength] = React.useState(50); // 期数范围
  const [startExp, setStartExp] = React.useState(0); // 起点期数
  useEffect(() => {
    getLotteryByYear(2025).then((res) => {
        setData([...res, ...d20212024]);
    });
  }, []);
const onChange = (key: string) => {
    console.log(key);
}

const handleSliderChange = (value) => {
  console.log('handleSliderChange', value);
  setStartExp(value);
}

const handleExpectChange = (value) => {
    setExpectLength(value == 0 ? data?.length : value);
}
const rdata = data?.slice(startExp, startExp + expectLength);
// 上一个周期的数据
const prevData = data?.slice(startExp + expectLength, startExp + 2*expectLength);
const expText = expectOptions.find((item) => item.value == expectLength)?.label;
const items: TabsProps['items'] = [
    {
      key: '1',
      label: '数字号码分析',
      children: (
        <div>
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                    {expText}中奖特码(号码/期数)
                </Typography.Title>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, '',)} />
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                    {expText}特码出现次数(次数/号码)
                </Typography.Title>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, 'tm' /**prevData */)} />
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                    {expText}特码头出现次数(次数/头号)
                </Typography.Title>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, 'tmt')} />
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                    {expText}特码尾出现次数(次数/尾号)
                </Typography.Title>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, 'tmw')} />
        </div>
      ) as any,
    },
    {
      key: '2',
      label: '生肖波段分析',
      children: (
        <div>
            <div style={{width: 400, display: 'inline-block'}}>
                <Flex justify='center'>
                    <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                        {expText}中奖波色分析
                    </Typography.Title>
                </Flex>
                <ReactECharts option={getPieOptions(rdata)} />
            </div>
            <div style={{width: 400, display: 'inline-block'}}>
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                    {expText}中奖生肖分析
                </Typography.Title>
            </Flex>
            <ReactECharts option={getPieOptions(rdata, 'sx')} />
            </div>
        </div>
      ) as any,
    },
    {
      key: '3',
      label: '算法预测开奖',
      children: (
        <div>
            
            <Flex justify='center'>
                <div style={{ textAlign: 'center'}}>
                    重新定义五个数字N1-N5，分别对应1-49个数字，分析N1-N5的出现规律。
                    <div>const N5 = <b>{N5.join(',')}</b>  const N4 = {N4.join(',')}</div>
                    <div>const N3 = {N3.join(',')} const N2 = {N2.join(',')} const N1 = {N1.join(',')}</div>
                    <div>{calcN5(rdata).map(n => <div>{n}</div>)}</div>
                    <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                        {expText}特码出现次数(次数/N号码)
                    </Typography.Title>
                </div>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, 'ntm')} />
            
            <Flex justify='center'>
                <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>
                {expText}中奖特码(N号码/期数)
                </Typography.Title>
            </Flex>
            <ReactECharts option={getBarOptions(rdata, 'n')} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
     <Flex justify='center' align='middle'>
        <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>请选择起点期数：</Typography.Title>
       <Slider
            defaultValue={0}
            min={0}
            max={data?.length}
            step={1}
            tooltip={{
                formatter: (value) => `${data?.[value]?.expect}期`,
            }}
            onChangeComplete={handleSliderChange}
            style={{ width: 400 }}
        />
       <Typography.Title style={{ margin: 0, lineHeight: '32px' }} level={5}>请选择统计范围：</Typography.Title>
        <Select 
            defaultValue={50}
            style={{ width: 110 }}
            onChange={handleExpectChange}
            options={expectOptions}
        />
    </Flex>
      <Tabs  centered defaultActiveKey="1" items={items} onChange={onChange} />;
    </div>
  );
};

export default Chart;
