import React from 'react';
import dayjs from 'dayjs';
import {RecordItem, useRecords} from '../../hooks/useRecords';
import styled from 'styled-components';
import {useTags} from '../../hooks/useTags';
import Icon from '../../components/Icon';
import {mainColor} from '../../color';

const Item = styled.div`
  border-bottom: 1px solid #c4c4c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  font-size: 18px;
  padding: 10px 16px;

  > .tags {
    display: flex;
    align-items: center;
    > .icon-wrapper {
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
  }
  
  > .notes {
    margin-right: auto;
    margin-left: 16px;
    color: #999;
  }
`;
const TimeAndMoney = styled.header`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px;

  > .money {
    > span {
      margin-left: 10px;
    }
  }
`;

interface Props {
  day: Date;
  dateType: 'year' | 'month' | 'date';
}

const RecordsList: React.FunctionComponent<Props> = (props) => {
  const {day, dateType} = props;
  const {getDaySum, getRecordsByTime} = useRecords();
  const {getTagName, findTag} = useTags();
  const recordsByTime = getRecordsByTime(day, dateType);
  const hash: { [K: string]: RecordItem[] } = {};

  recordsByTime.map(r => {
    const key = dayjs(r.createdAt).format('YYYY-MM-DD');
    if (!(key in hash)) {
      hash[key] = [];
    }
    hash[key].push(r);
  });
  const array = Object.entries(hash)
    .sort((a, b) => {
      if (a[0] === b[0]) return 0;
      if (a[0] > b[0]) return -1;
      if (a[0] < b[0]) return 1;
      return 0;
    });
  return (

    <div>
      {
        array.map(([date, records]) =>
          <div key={date}>
            <TimeAndMoney>
              <div className="time">
                {dayjs(date).format('YYYY年M月D日')}
              </div>

              <div className="money">
                <span>
                  支出￥{getDaySum(records, '-', date) || 0}
                </span>
                <span>
                  收入￥{getDaySum(records, '+', date) || 0}
                </span>
              </div>
            </TimeAndMoney>


            <div>
              {
                records.map(r => {
                  return <Item key={r.createdAt}>
                    <div className="tags">
                      <span className="icon-wrapper">
                        <Icon className="icon" name={findTag(r.tagID).icon}/>
                      </span>
                      <span>{getTagName(r.tagID)}</span>
                    </div>

                    {r.notes && <div className="notes">{r.notes}</div>}

                    <div className="amount">
                      {r.category}{r.amount}
                    </div>
                  </Item>;
                })
              }
            </div>
          </div>)
      }
    </div>
  );
};

export default RecordsList;