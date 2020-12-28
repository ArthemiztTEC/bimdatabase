import React, { useContext, useEffect, useState } from 'react'

import { List, Typography, Divider, Table } from 'antd'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import _ from 'lodash'
import firebase from 'firebase'
import { Modal, Button, Carousel, Popconfirm, message } from 'antd'
import { LoadingContext } from './LoadingProvider'

const RepairTable = (props) => {
  const { showloading, hideloading } = useContext(LoadingContext)

  const [OpenImage, ToggleImage] = useState(false)
  const [isEdit, ToggleEdit] = useState(false)
  const [carousalImage, setImages] = useState([])

  const showModal = () => {
    ToggleImage(true)
  }
  const [user, setUser] = useState({})

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`/user/${user.uid}`)
          .once('value', (data) => {
            console.log('current user', data.val())
            setUser(data.val())
          })
      } else {
        // No user is signed in.
      }
    })
  }, [])
  const { select, repairList } = props
  const [priceModal, TogglePriceModal] = useState(false)

  const data = _.map(repairList, (item) => {
    return {
      date: item.date,
      project: select.projectName,
      title: item.label,
      description: item.description,
      priority: _.get(item, 'priority', 1),
      price: _.get(item, 'price', '0'),
      priceList: _.get(item, 'priceList', []),
      status: item.status,
      images: item.images,
      option: { ...item },
    }
  })

  const [priceList, setpricelist] = useState([])

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text,
    },
    {
      title: 'โครงการตึก',
      dataIndex: 'project',
      key: 'project',
      render: (text) => text,
    },
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text) => text,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text,
    },
    {
      title: 'ราคาประเมิน',
      dataIndex: 'priceList',
      key: 'priceList',
      render: (text) => {
        let data = 0
        _.forEach(text, (item) => {
          data += Number(item.price)
        })
        return (
          <a
            href={'#'}
            onClick={() => {
              setpricelist(text)
              TogglePriceModal(true)
            }}
          >
            {data}
          </a>
        )
      },
    },
    {
      title: 'ความเร่งด่วน',
      dataIndex: 'priority',
      key: 'priority',
      render: (text) => {
        if (`${text}` === '1') {
          return (
            <p
              style={{
                backgroundColor: 'yellow',
              }}
            >
              ด่วน
            </p>
          )
        } else if (`${text}` === '2') {
          return (
            <p
              style={{
                backgroundColor: 'orange',
              }}
            >
              ด่วนมาก
            </p>
          )
        }
        return (
          <p
            style={{
              backgroundColor: 'red',
              color: 'white',
            }}
          >
            ด่วนที่สุด
          </p>
        )
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const result =
          text === 'created' ? (
            <p style={{ color: 'red' }}>แจ้งซ่อม</p>
          ) : (
            <p style={{ color: 'green' }}>ซ่อมเสร็จแล้ว</p>
          )

        return result
      },
    },
    {
      title: 'จัดการ',
      dataIndex: 'option',
      key: 'option',
      render: (item) => {
        return (
          <Grid container spacing={1}>
            {item.images ? (
              <Grid item>
                <a
                  onClick={() => {
                    showModal()
                    setImages(item.images)
                  }}
                >
                  <img src={'/asset/Vire.png'} />
                </a>
              </Grid>
            ) : (
              ''
            )}

            <Grid item>
              <a
                onClick={() => {
                  props.setIssue(item)
                }}
              >
                <img src={'/asset/Edit.png'} />
              </a>
            </Grid>
            <Grid item>
              <Popconfirm
                title="Are you sure delete this issue?"
                onConfirm={() => {
                  console.log(
                    'Confirm fetch on path',
                    `/model/${item.selectedmodel}/${item.modelNumber}/${item.date}/${item.keyid}`
                  )
                  message.success('Click on Yes')
                  const issue = firebase
                    .database()
                    .ref(
                      `/model/${item.selectedmodel}/${item.modelNumber}/${item.date}/${item.keyid}`
                    )
                  issue.once('value', (snap) => {
                    firebase
                      .database()
                      .ref(
                        `/deleteHistory/${item.selectedmodel}/${item.modelNumber}/${item.date}/${item.keyid}`
                      )
                      .set({
                        ...snap.val(),
                        deleteBy: user,
                      })
                      .then((snap) => {
                        issue.set(null)
                        props.setList(_.filter(repairList, (issue) => issue.keyid !== item.keyid))
                      })
                    console.log('Found', snap.val())
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
            </Grid>
          </Grid>
        )
      },
    },
  ]
  const ModalImage = styled.div``
  const priceListColumn = [
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
  ]

  return (
    <div>
      <Modal
        title="รายละเอียด"
        width={'600px'}
        visible={priceModal}
        onOk={() => {
          TogglePriceModal(false)
        }}
        onCancel={() => {
          TogglePriceModal(false)
        }}
      >
        <Table
          columns={priceListColumn}
          pagination={{ position: ['bottomRight'] }}
          dataSource={priceList}
        />
      </Modal>
      <Modal
        title="รูป"
        width={'600px'}
        visible={OpenImage}
        onOk={() => {
          ToggleImage(false)
        }}
        onCancel={() => {
          ToggleImage(false)
        }}
      >
        <Carousel>
          {_.map(carousalImage, (image) => {
            return (
              <ModalImage align={'center'}>
                <a href={image}>
                  <img height={300} src={image} />
                </a>
              </ModalImage>
            )
          })}
        </Carousel>
      </Modal>
      <Table columns={columns} pagination={{ position: ['bottomRight'] }} dataSource={data} />
    </div>
  )
}

export default RepairTable
