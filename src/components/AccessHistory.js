import React, { useEffect, useState } from 'react'
import * as firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'
import { DatePicker, Table } from 'antd'

const AccessHistory = (props) => {
  console.log('History Props is', props)
  const { id } = props
  const [accessList, setAccessList] = useState([])
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  useEffect(() => {
    console.log('fetch ', `/history/${id}/${date}`)
    const fetchList = firebase
      .database()
      .ref(`/history/${id}/${date}`)
      .once('value', (data) => {
        console.log('fetchList of', id, data.val())
        setAccessList(
          _.map(data.val(), (item, index) => {
            return { ...item, uid: index }
          })
        )
      })
  }, [date, id])

  const columns = [
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'เวลา',
      dataIndex: 'loginDate',
      key: 'loginDate',
    },
    {
      title: 'เวลาออก',
      dataIndex: 'logoutDate',
      key: 'logoutDate',
    },
  ]
  console.log('accessList', accessList)
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <h2>การเข้าใช้งาน</h2>
      <DatePicker
        onChange={(e) => {
          try {
            console.log('Date', e.format('YYYY-MM-DD'))
            setDate(e.format('YYYY-MM-DD'))
          } catch (e) {}
        }}
      />
      <Table dataSource={accessList} columns={columns} />
    </div>
  )
}

export default AccessHistory
