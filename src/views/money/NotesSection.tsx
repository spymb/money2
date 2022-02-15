import styled from 'styled-components';
import React, {useRef, useState} from 'react';

const Wrapper = styled.section`
  background: #f5f5f5;
  padding: 0 16px;
  font-size: 14px;

  > label {
    display: flex;
    align-items: center;

    > span {
      margin-right: 16px;
      white-space: nowrap;
    }

    > input {
      display: block;
      width: 100%;
      height: 72px;
      background: none;
      border: none;
    }
  }
`;

type Props = {
  value: string
  onChange: (value: string) => void
}

const NotesSection: React.FC<Props> = (props) => {
  const notes = props.value;
  const refInput = useRef<HTMLInputElement>(null);
  const onBlur = () => {
    if (refInput.current !== null) {
      props.onChange(refInput.current.value);
    }
  };

  return (
    <Wrapper>
      <label>
        <span>备注</span>
        <input type="text" placeholder="在此添加备注"
               ref={refInput}
               defaultValue={notes}
               onBlur={onBlur}
        />
      </label>
    </Wrapper>
  );

};

export {NotesSection};