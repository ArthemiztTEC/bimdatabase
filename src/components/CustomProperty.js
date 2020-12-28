import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { message, Popconfirm, Table } from 'antd'
import Grid from '@material-ui/core/Grid'
import firebase from 'firebase'

const CustomProperty = (props) => {
  let {
    data: {
      data: { properties },
    },
    selectedmodel,
    toggleInsert,
  } = props

  const [list, setList] = useState(properties)
  const data = firebase
    .database()
    .ref(`/modelProperty/${selectedmodel}/properties/${props.data.data.id}/`)
  useEffect(
    () => {
      data.on('value', (value) => {
        console.log('useEffect result')
        const remoteData = value.val()
        properties = _.filter(properties, (item) => !_.includes(item.displayCategory, '__'))
        _.forEach(remoteData, (item, index) => {
          let found = false
          _.forEach(properties, (property, pid) => {
            if (property.displayName === index) {
              properties[pid] = item
              found = true
            }
          })
          if (!found) {
            properties.push(item)
          }
        })
        properties = _.filter(properties, (item) => item.hidden === false)
        setList(properties)
        console.log('Final Data', properties)
      })
    },
    [props.data.data.id],
    selectedmodel
  )

  const columns = [
    {
      title: 'หัวข้อ',
      dataIndex: 'displayName',
      key: 'name',
    },
    {
      title: 'ข้อมูล',
      dataIndex: 'displayValue',
      key: 'displayValue',
      render: (text, record, index) => {
        return `${text}`
      },
    },
    {
      title: 'หน่วย',
      dataIndex: 'units',
      key: 'units',
      render: (text, record, index) => {
        return `${text}`
      },
    },
    {
      title: 'ประเภท',
      dataIndex: 'displayCategory',
      key: 'displayCategory',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record, index) => {
        return (
          <div>
            <a
              onClick={() => {
                props.edit({
                  ...props.data,
                  input: record,
                  isEdit: true,
                  editID: record.displayName,
                })
                toggleInsert(true)
                console.log(record)
              }}
            >
              <img src={'/asset/Edit.png'} />
            </a>
            <Popconfirm
              title="Are you sure delete this Property?"
              onConfirm={() => {
                console.log(
                  `/modelProperty/${props.selectedmodel}/properties/${props.data.data.id}/${record.displayName}`
                )
                message.success('Click on Yes')
                firebase
                  .database()
                  .ref(
                    `/modelProperty/${props.selectedmodel}/properties/${props.data.data.id}/${record.displayName}`
                  )
                  .set({
                    ...record,
                    hidden: true,
                  })
              }}
              onCancel={() => {
                console.log('Cancel')
                message.error('Click on No')
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                <img src={'/asset/Delete.png'} />
              </a>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  properties = _.filter(properties, (item) => !_.includes(item.displayCategory, '__'))
  console.log('properties', properties)

  return (
    <Table
      style={{
        width: '100%',
      }}
      dataSource={list}
      columns={columns}
    />
  )
}
export default CustomProperty
