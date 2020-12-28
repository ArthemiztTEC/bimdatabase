import React, { useEffect, useState } from 'react'

import { List, Typography, Divider, Space, Tag, Table } from 'antd'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'

const IssueText = styled.div`
  text-align: center;
  background-color: #ffeee9;
  color: red;
  width: 100px;
  padding: 10px;
  border-radius: 50px;
`
const ContentText = styled.div`
  text-align: center;
  width: 120px;
  padding: 10px;
`
const ActivityList = (props) => {
  console.log('Activity Props', props)




  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: text =>  <IssueText>แจ้งซ่อม</IssueText>
      ,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
    },

  ];


  return (
    <Table style={{
      width:'100%'
    }} columns={columns} dataSource={props.repairList} />
  )
}
export default ActivityList
