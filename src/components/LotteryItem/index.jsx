import { useEffect, useState } from 'react';
import './index.less'

const LotteryItem = ({ item }) => {
  return (
    <div className='lottery-item flex-row'>
        <div className='expect'>
            <div>{item.expect}</div>
            <div className='date'>{item.openTime}</div>
        </div>
        <div className='codes flex-row'>
            {item.codes.map((num, index) => (
                <div className={`code-num-box`} key={num+index}>
                    <div className={`code-num ${item.waves[index]}`}>{num}</div>
                    <div className="code-zodiac">{item.zodiacs[index]}</div>
                </div>
            ))}
        </div>
        <div className='te-danshuang'>
            {item.codes[6] % 2 > 0 ? '单': '双'}
        </div>
        {/* <div className='kaijiang-date'>
            {item.openTime}
        </div> */}
    </div>
  );
};

export default LotteryItem;
