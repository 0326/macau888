import { useEffect, useState } from 'react';
import LotteryItem from '../../components/LotteryItem'
import utils from '../../utils'
import { getAllHistoryData } from '../../services/macau'

import './index.less'

const HistoryPage = () => {
  const [cutLen , setCutLen] = useState(-1);
  const [list, setList] = useState([]);

  useEffect(() => {
    // const p = new URLSearchParams(location.search)
    getAllHistoryData().then((d) => {
      setList(d)
    })
  }, [])

  const onExpectClick = (e) => {
    console.log(e.target.dataset.len)
    var l = Number(e.target.dataset.len) || -1;
    setCutLen(l)
  }


  const cutList = cutLen > 0 ? list?.slice(0, cutLen) : list
  const len = cutList?.length

  return (
    <div>
      <div className='history-dashboard'>
        <div onClick={onExpectClick} className='expect-nums flex-row'>
          {[30, 50, 100, 365, 1000, -1].map((n) => (
            <span data-len={n} className={cutLen == n ? 'active' : ''}>{n > 0 ? `近${n}期` : '所有数据'}</span>
          ))}
        </div>
        <div>
          累计数据：{cutList[len-1]?.expect} ~ {cutList[0]?.expect}，共计 {len} 期
        </div>
        <div>
          {utils.totalTips(cutList).split('\n').map(s => <p>{s}</p>)}
        </div>
        <div>
          {utils.temasx(cutList).split('\n').map(s => <p>{s}</p>)}
        </div>
      </div>
      <div className='history-header flex-row'>
        <div className='qishu'>期数</div>
        <div className='pingma'>平码</div>
        <div className='tema'>特码</div>
        <div className='tema-danshuang'>单双</div>
        {/* <div className='kaijiang-riqi'>开奖日期</div> */}
      </div>
      <div className='history-content'>
        {cutList.map((item) => <LotteryItem key={item.expect} item={item} />)}
      </div>
    </div>
    
  );
};

export default HistoryPage;
