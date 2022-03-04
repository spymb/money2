import React from 'react';
import Icon from '../../components/Icon';
import styled from 'styled-components';
import {mainColor} from '../../color';
import {RecordItem, useRecords} from '../../hooks/useRecords';
import {useTags} from '../../hooks/useTags';

const Wrapper = styled.ol`
  border-top: 1px solid #eeeeee;
  padding: 10px;

  > li {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 10px 0;
    border-bottom: 1px solid #eeeeee;

    .icon-wrapper {
      width: 40px;
      height: 40px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      margin-right: 10px;

      .icon {
        fill: ${mainColor};
      }
    }

    .info {
      flex: 1;

      .text-info {
        display: flex;
        align-items: center;

        .percent {
          font-size: 12px;
          margin-left: 6px;
        }

        .amount {
          margin-left: auto;
        }
      }

      .percent-bar {
        margin: 4px 0;
        height: 6px;
        width: 100%;
        border-radius: 5px;
        background-color: ${mainColor};
      }
    }
  }
`;

interface Props {
  day: Date;
  dateType: 'month' | 'year';
  category: '-' | '+';
}

const RankList: React.FunctionComponent<Props> = (props) => {
  const {getRecordsByTime, getRecordsByCategory} = useRecords();
  const {findTag} = useTags();
  const {dateType, day, category} = props;
  const getSumForTags = (records: RecordItem[]) => {
    const initial: { [tagID: string]: number } = {};
    return records.reduce((pre, record) => {
      if (pre[record.tagID] !== undefined) {
        pre[record.tagID] += record.amount;
      } else {
        pre[record.tagID] = record.amount;
      }
      return pre;
    }, initial);
  };
  const recordsByTime = getRecordsByTime(day, dateType);
  const recordsByCategory = getRecordsByCategory(recordsByTime, category);
  const sumForTags = getSumForTags(recordsByCategory);
  const kvArray = Object.entries(sumForTags);
  kvArray.sort((a, b) => b[1] - a[1]);
  const total = kvArray.reduce((acc, [, sum]) => acc + sum, 0);
  const tagRankData = kvArray.map(item => {
    const [tagID, sum] = item;
    return {
      tag: findTag(parseInt(tagID)),
      sum,
      percent: sum / total * 100
    };
  });

  return (
    <Wrapper>
      <div>
        {category === '-' ? '支出' : '收入'}排行
      </div>

      {tagRankData.map(item => {
        return (
          <li className="rank-list-item" key={item.tag.id}>
            <div className="icon-wrapper">
              <Icon className="icon" size="24px" name={item.tag.icon}/>
            </div>

            <div className="info">
                      <span className="text-info">
                        <span className="icon-name">{item.tag.name}</span>
                        <span className="percent">{item.percent.toFixed(2)}%</span>
                        <span className="amount">￥{item.sum}</span>
                      </span>

              <div className="percent-bar" style={{width: item.percent + '%'}}/>
            </div>

          </li>
        );
      })}
    </Wrapper>
  );
};

export {RankList};