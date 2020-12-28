import React, { useEffect, useRef, useState } from 'react'
import * as firebase from 'firebase'
import moment from 'moment'
import _ from 'lodash'
import { List, Table } from 'antd'
import { Comment, Tooltip, Avatar } from 'antd'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons'
import { Form, Button, Input } from 'antd'
import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import { FileBase64 } from 'react-file-base64'
import axios from 'axios'

const { TextArea } = Input
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
const Chat = (props) => {
  const messagesEndRef = useRef(null)

  const [comment, setComment] = useState('')
  const [image, setImage] = useState('')
  console.log('Current Image is', image)

  const [isSubmiting, setSubmiting] = useState(false)

  const { id, user } = props

  console.log('Chat Props is', props)
  const [chatData, setChat] = useState([])
  useEffect(() => {
    try {
      document.getElementsByClassName('comment-list')[0].scrollTo(0, 1000)
    } catch (e) {}
  }, [chatData])
  useEffect(() => {
    const fetchList = firebase.database().ref(`/chat/${id}/`)
    fetchList.on('value', (data) => {
      console.log(`/chat/${id}/`, data.val())

      setChat(
        _.map(data.val(), (item, index) => {
          const chatValue = {
            author: `${item.firstName} ${item.lastname}`,
            avatar: './user.png',
            content: (
              <p>
                {item.comment}{' '}
                {item.image ? (
                  <a
                    onClick={(e) => {
                      e.preventDefault()
                      var string = item.image
                      var iframe =
                        "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
                      var x = window.open()
                      x.document.open()
                      x.document.write(iframe)
                      x.document.close()
                    }}
                  >
                    <img height={200} width={200} src={item.image} />
                  </a>
                ) : (
                  ''
                )}
                {item.attach ? (
                  <a href={item.attach}>{_.get(item, 'attachName', 'ไฟลไม่มีชื่อ')}</a>
                ) : (
                  ''
                )}
              </p>
            ),
            datetime: (
              <Tooltip title={moment(item.date).format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment(item.date).fromNow()}</span>
              </Tooltip>
            ),
          }
          return { ...chatValue }
        })
      )
    })

    return () => {
      console.log('Unsub')
      fetchList.off('value', () => {})
    }
  }, [id])
  const uploadRef = React.createRef()
  console.log('accessList', chatData)

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <h2>Chat</h2>
      <List
        ref={messagesEndRef}
        className="comment-list"
        itemLayout="horizontal"
        dataSource={chatData}
        renderItem={(item) => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
      <>
        <Form.Item>
          <Grid container>
            <TextArea
              onChange={(e) => {
                setComment(e.target.value)
              }}
              value={comment}
            ></TextArea>
          </Grid>
        </Form.Item>
        <Form.Item>
          <Button
            style={{
              marginRight: 10,
            }}
            htmlType="submit"
            loading={isSubmiting}
            onClick={() => {
              if (comment !== '') {
                setSubmiting(true)

                firebase
                  .database()
                  .ref(`/chat/${id}/`)
                  .push({
                    comment,
                    ...user,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  })
                  .then((res) => {
                    const key = res.key
                    console.log('Key is ', key)
                    const storage = firebase.storage()

                    if (image !== '') {
                      if (_.includes(image.type, 'image')) {
                        toBase64(image).then((res) => {
                          firebase.database().ref(`/chat/${id}/${key}`).update({
                            image: res,
                          })
                          setImage('')
                        })
                      } else {
                        const uploadTask = firebase
                          .storage()
                          .ref(`/chat/${id}/${key}/${image.name}`)
                          .put(image)

                        uploadTask.on(
                          'state_changed',
                          (snapshot) => {
                            // progress function ...
                            const progress = Math.round(
                              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            )
                          },
                          (error) => {
                            // Error function ...
                            console.log(error)
                          },
                          () => {
                            // complete function ...
                            storage
                              .ref(`/chat/${id}/${key}`)
                              .child(image.name)
                              .getDownloadURL()
                              .then((url) => {
                                firebase.database().ref(`/chat/${id}/${key}/attach`).set(url)
                                firebase
                                  .database()
                                  .ref(`/chat/${id}/${key}/attachName`)
                                  .set(image.name)
                                setImage('')
                                setSubmiting(false)
                              })
                          }
                        )
                      }
                    } else {
                      setSubmiting(false)
                    }

                    setComment('')
                  })

                // if (image !== '') {
                //   toBase64(image).then((res) => {
                //     firebase
                //       .database()
                //       .ref(`/chat/${id}/`)
                //       .push({
                //         comment,
                //         image: res,
                //         ...user,
                //         date: moment().format('YYYY-MM-DD HH:mm:ss'),
                //       })
                //       .then((res) => {
                //         setComment('')
                //         setImage('')
                //         setSubmiting(false)
                //       })
                //   })
                // } else {
                //   firebase
                //     .database()
                //     .ref(`/chat/${id}/`)
                //     .push({
                //       comment,
                //
                //       ...user,
                //       date: moment().format('YYYY-MM-DD HH:mm:ss'),
                //     })
                //     .then((res) => {
                //       setComment('')
                //       setSubmiting(false)
                //     })
                // }
              }
            }}
            type="primary"
          >
            ส่งข้อความ
          </Button>
          <Button
            htmlType="submit"
            loading={isSubmiting}
            onClick={() => {
              console.log(uploadRef)
              try {
                uploadRef.current.input.click()
              } catch (e) {}
            }}
            type="primary"
          >
            <UploadOutlined /> แนบไฟล์
          </Button>

          <Input
            onChange={(e) => {
              var FileSize = e.target.files[0].size / 1024 / 1024 // in MB
              if (FileSize > 20) {
                alert('File size exceeds 20 MB')
                // $(file).val(''); //for clearing with Jquery
              } else {
                setImage(e.target.files[0])
              }
            }}
            ref={uploadRef}
            type={'file'}
            hidden
          />
          {image !== '' && _.includes(image.type, 'image') ? (
            <img height={200} width={200} src={URL.createObjectURL(image)} />
          ) : image !== '' ? (
            <div>{image.name} </div>
          ) : (
            ''
          )}
          {image !== '' ? (
            <a
              style={{
                color: 'red',
              }}
              onClick={() => {
                setImage('')
              }}
            >
              ลบ
            </a>
          ) : (
            ''
          )}
        </Form.Item>{' '}
      </>
    </div>
  )
}

export default Chat
