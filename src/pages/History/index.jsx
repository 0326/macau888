import { useEffect, useState } from 'react';
import LotteryItem from '../../components/LotteryItem'
import { getLotteryByYear } from '../../services/macau'

import './index.less'

const HistoryPage = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getLotteryByYear(2025).then(data => {
      setList(data)
    })
  }, [])
  console.log('list', list)
  return (
    <div>
      <div className='history-header flex-row'>
        <div className='qishu'>期数</div>
        <div className='pingma'>平码</div>
        <div className='tema'>特码</div>
        <div className='tema-danshuang'>单双</div>
        <div className='kaijiang-riqi'>开奖日期</div>
      </div>
      <div className='history-content'>
        {list.map((item) => <LotteryItem item={item} />)}
      </div>
    </div>
    
  );
};

export default HistoryPage;
