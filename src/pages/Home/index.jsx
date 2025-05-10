import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { getAllHistoryData } from '../../services/macau'

const columns = [
  {
    title: '期数',
    dataIndex: 'expect',
    key: 'expect',
    render: (_, { expect, openTime }) => {
        return (
        <div className='expect'>
            <div>{expect}</div>
            <div className='date' style={{ fontSize: 10 }}>{openTime}</div>
        </div>
        )
    },
  },
  {
    title: '平码 + 特码',
    dataIndex: 'codep',
    key: 'codep',
    render: (_, { waves, zodiacs, codes }) => {
        return (
            <div className='codes flex-row'>
            {codes.map((num, index) => (
                <div className={`code-num-box`} key={num+index}>
                    <div className={`code-num ${waves[index]}`}>{num}</div>
                    <div className="code-zodiac">{zodiacs[index]}</div>
                </div>
                ))}
            </div>
        )
    },
  },
  {
    title: '单双',
    key: 'danshuang',
    dataIndex: 'codes',
    render: (_, { codes }) => {
        return codes[6] % 2 > 0 ? '单': '双'
    },
  },
  {
    title: '大小',
    key: 'daxiao',
    dataIndex: 'codes',
    render: (_, { codes }) => {
        return codes[6] > 24 > 0 ? '大': '小'
    },
  },
  {
    title: '合单双',
    key: 'daxiao',
    dataIndex: 'codes',
    render: (_, { codes }) => {
        const d = codes[6].split('').map(Number)
        return (d[0]+d[1])%2 > 0 ? '单': '双'
    },
  },
  {
    title: '合大小',
    key: 'daxiao',
    dataIndex: 'codes',
    render: (_, { codes }) => {
        const d = codes[6].split('').map(Number)
        return (d[0]+d[1])%10 > 4 ? '大': '小'
    },
  },
];

const HomePage = () => {
    const [cutLen , setCutLen] = useState(-1);
    const [list, setList] = useState([]);

    useEffect(() => {
        // const p = new URLSearchParams(location.search)
        getAllHistoryData().then((d) => {
        setList(d)
        })
    }, [])

    // const onExpectClick = (e) => {
    //     console.log(e.target.dataset.len)
    //     var l = Number(e.target.dataset.len) || -1;
    //     setCutLen(l)
    //   }
    
    
    //   const cutList = cutLen > 0 ? list?.slice(0, cutLen) : list
    //   const len = cutList?.length

    return (
        <div>
            <Table columns={columns} dataSource={list} pagination={{ pageSize: 100, pageSizeOptions: [100, 300, 500, 1000] }} />
        </div>
    )
};
export default HomePage;