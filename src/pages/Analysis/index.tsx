import { useEffect, useState } from "react";
import LotteryItem from "../../components/LotteryItem/index2";
import { getAllHistoryData } from "../../services/macau";
import { baseMoney, calc, yuce, winRate, xiaoNum, kuNum } from "./calc";

import "./index.less";

const HistoryPage = () => {
  const [cutLen, setCutLen] = useState(50);
  const [list, setList] = useState([]);

  useEffect(() => {
    // const p = new URLSearchParams(location.search)
    getAllHistoryData().then((d) => {
      setList(d);
    });
  }, []);

  const onExpectClick = (e) => {
    console.log(e.target.dataset.len);
    var l = Number(e.target.dataset.len) || -1;
    setCutLen(l);
  };

  const cutList = cutLen > 0 ? list?.slice(0, cutLen + 10) : list;
  const len = cutList?.length;
  const calcList = calc(cutList);

  const countMap = {};
  let zsyCount = 0; // 正收益
  let fsyCount = 0; // 负收益
  for (let i = calcList.length - 1; i >= 0; i--) {
    const item = calcList[i];
    if (item.sy > 0) {
      zsyCount++;
      countMap[fsyCount] = (countMap[fsyCount] || 0) + 1;
      fsyCount = 0;
    } else if (item.sy < 0) {
      fsyCount--;
      countMap[zsyCount] = (countMap[zsyCount] || 0) + 1;
      zsyCount = 0;
    }
  }
  console.log("countMap", countMap);

  return (
    <div>
      <div className="history-dashboard">
        <div onClick={onExpectClick} className="expect-nums flex-row">
          {[30, 50, 100, 365, 1000, -1].map((n) => (
            <span data-len={n} className={cutLen == n ? "active" : ""}>
              {n > 0 ? `近${n}期` : "所有数据"}
            </span>
          ))}
        </div>
        <div>
          笑数：{xiaoNum.join(", ")}；<br />
          哭数：{kuNum.join(", ")}
        </div>
        <div>
          <b>购买策略:</b>
          <br /> 1. 上期出哭数就买哭数，上期出笑数就买笑数。
          <br /> 2. 如果连续三期都没中，则跟上一期买相反数。
          <br /> 3. 每注基本金25，上一期不中下期需要加倍投注，直到中奖后恢复基本金投注。
        </div>
        <div>
          <b>
            结果分析(期数：{cutList[len - 1]?.expect} ~ {cutList[0]?.expect}，共计{len} 期):
          </b>
          <br /> 1. 按46倍率计算，每注基础本金{baseMoney}, 中了+{baseMoney * winRate}，亏了-{baseMoney}，累计{len}
          期收益：
          {calcList[0]?.ljsy || 0} 元
          <br /> 2. 连续中奖次数统计：
          {Object.keys(countMap)
            .sort((a, b) => b - a)
            .filter((key) => key != 0)
            .map((key) => (
              <div key={key}>
                连续{Math.abs(key)}次{key > 0 ? "中" : "不中"}：{countMap[key]} 次
              </div>
            ))}
        </div>
      </div>
      <div className="history-header flex-row">
        <div className="qishu">期数</div>
        <div className="pingma">平码</div>
        <div className="tema">特码</div>
        <div className="tema-danshuang">单双</div>
        {/* <div className="tema-danshuang">大小</div> */}
        {/* <div className="tema-danshuang">合单双</div> */}
        <div className="tema-danshuang">哭笑数</div>
        <div className="tema-danshuang">押注</div>
        {/* <div className="tema-danshuang">合大小</div> */}
        <div className="tema-shouyi">推测结果</div>
        <div className="tema-shouyi">累计收益</div>
      </div>
      <div className="history-content">
        <LotteryItem
          key="today"
          item={{
            expect: "下期预测",
            num: "-",
            codes: ["-", "-", "-", "-", "-", "-", "-"],
            waves: ["-", "-", "-", "-", "-", "-", "-"],
            zodiacs: ["-", "-", "-", "-", "-", "-", "-"],
            ds: "-",
            hds: yuce(calcList[0], calcList[1], calcList[2]),
            sy: "-",
            zslzs: yuce(calcList[0], calcList[1], calcList[2]),
          }}
        />
        {calcList.slice(0, calcList.length - 10).map((item) => (
          <LotteryItem key={item.expect} item={item} />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
