import React from 'react';
import {useTags} from '../../hooks/useTags';
import {useNavigate, useParams,} from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import Icon from '../../components/Icon';
import {Input} from '../../components/Input';
import {Center} from '../../components/Center';
import {Space} from '../../components/Space';
import {Button} from 'components/Button';

const Topbar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 20px;
  padding: 14px;
  background: white;
`;

const InputWrapper = styled.div`
  background: white;
  padding: 0 16px;
  margin-top: 8px;
`;

const Tag: React.FC = () => {
  const {findTag, updateTag, deleteTag} = useTags();
  let {id} = useParams();
  const tag = findTag(parseInt(id as string));
  const tagContent = (tag: { id: number, name: string }) => (
    <div>
      <InputWrapper>
        <Input label="标签名" type="text" placeholder="标签名" value={tag.name}
               onChange={
                 (e) => {
                   updateTag(tag.id, {name: e.target.value});
                 }
               }/>
      </InputWrapper>

      <Center>
        <Space/>
        <Space/>
        <Space/>
        <Button onClick={() => {
          deleteTag(tag.id);
        }}>删除标签</Button>
      </Center>
    </div>
  );
  const navigate = useNavigate();

  return (
    <Layout>
      <Topbar>
        <Icon name="left" onClick={() => navigate(-1)}/>
        <span>编辑标签</span>
        <Icon/>
      </Topbar>

      {tag ? tagContent(tag) : <Center>tag 不存在</Center>}

    </Layout>
  );
};

export {Tag};