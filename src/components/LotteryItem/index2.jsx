import { useEffect, useState } from "react";
import "./index.less";
// 表格模式
const sum = (codes) => {
  const r = codes.map(Number).reduce((a, b) => a + b, 0);
  return r;
};

const LotteryItem = ({ item }) => {
  return (
    <div className="lottery-item flex-row">
      <div className="expect">
        <div>{item.expect}</div>
        <div className="date">{item.openTime}</div>
      </div>
      <div className="codes flex-row">
        {[item.codes[6]].map((num, index) => (
          <div className={`code-num-box`} key={num + index}>
            <div className={`code-num ${item.waves[index]}`}>{num}</div>
            <div className="code-zodiac">{item.zodiacs[index]}</div>
          </div>
        ))}
      </div>
      <div className="te-danshuang">{item.ds}</div>
      {/* <div className="te-danshuang">{item.dx}</div> */}
      <div className="te-danshuang">{item.rdm}</div>
      <div className="te-danshuang">{item.yazhu}</div>
      {/* <div className="te-danshuang">{item.hdx}</div> */}
      {/* <div className="te-danshuang">{item.sy}</div> */}
      <div className="te-danshuang" style={{ color: item.zslzs > 0 ? "red" : "green" }}>
        {typeof item.zslzs === "string" ? item.zslzs : item.zslzs > 0 ? "对" : "错"}
      </div>
      <div className="te-danshuang">{item.ljsy}</div>
      {/* <div className='kaijiang-date'>
            {item.openTime}
        </div> */}
    </div>
  );
};

export default LotteryItem;
