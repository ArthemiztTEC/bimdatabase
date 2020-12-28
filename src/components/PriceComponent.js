import React, { useContext, useEffect, useRef, useState } from 'react'

import { List, Typography, Divider, Table, InputNumber } from 'antd'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import _ from 'lodash'
import firebase from 'firebase'
import { Modal, Button, Carousel, Popconfirm, message } from 'antd'
import { LoadingContext } from './LoadingProvider'
import { Form, Input, Checkbox } from 'antd'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const PriceComponent = (props) => {
  const { repairForm, setRepairForm, isReUse = false } = props
  let { priceList = [] } = repairForm
  const [addModal, toggleModal] = useState(false)
  const [selecteditem, setitem] = useState(-1)
  const onFinish = (values) => {
    console.log('Success:', values)
    console.log('Success:', typeof id)
    if (selecteditem !== -1) {
      priceList[selecteditem] = { ...values }
    } else {
      priceList.push({
        id: priceList.length + 1,
        ...values,
      })
    }
    setitem(-1)
    toggleModal(false)
    setRepairForm({
      ...repairForm,
      priceList: priceList,
    })
  }
  const [form, setForm] = useState({ tool: '', price: 0 })
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const data = _.map(repairForm.priceList, (item, index) => {
    console.log('Item', index)
    return {
      ...item,
      manage: { item, id: index },
      id: index,
    }
  })
  console.log('repairFormdata', data)
  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      key: 'id',
      render: (text) => text + 1,
    },
    {
      title: 'อุปกรณ์',
      dataIndex: 'tool',
      key: 'tool',
      render: (text) => text,
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text,
    },
    {
      title: 'manage',
      dataIndex: 'manage',
      key: 'manage',
      render: (text) => {
        return (
          <Grid container spacing={1}>
            <Grid item>
              <a
                onClick={() => {
                  console.log('Set From', text)
                  setForm(text)
                  setitem(text.id)
                  toggleModal(true)
                }}
              >
                <img src={'/asset/Edit.png'} />
              </a>
            </Grid>
            <Grid item>
              <Popconfirm
                title="Are you sure delete this issue?"
                onConfirm={() => {
                  const index = text.id
                  priceList.splice(index, 1)
                  setRepairForm({
                    ...repairForm,
                    priceList,
                  })
                  message.success('Delete form list')
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
            </Grid>
          </Grid>
        )
      },
    },
  ]
  const formRef = useRef(null)
  return (
    <div>
      <Button type="primary" onClick={toggleModal}>
        เพิ่ม ราคา
      </Button>
      <Modal
        title="Add"
        visible={addModal}
        onOk={() => {
          console.log('Ok', formRef)
          formRef.current.submit()
        }}
        onCancel={() => {
          toggleModal(false)
          console.log('cancel')
        }}
      >
        <Form
          ref={formRef}
          {...layout}
          name="basic"
          initialValues={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="ชื่ออุปกรณ์"
            name="tool"
            rules={[{ required: true, message: 'กรุณากรอก ชื่ออุปกรณ์' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ราคา"
            name="price"
            rules={[{ required: true, message: 'กรุณรากรอก ราคา' }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} pagination={{ position: ['bottomRight'] }} dataSource={data} />
    </div>
  )
}

export default PriceComponent
