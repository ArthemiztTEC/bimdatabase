import Layout from '../Layout'
import MenuBar from '../components/MenuBar'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card } from '@material-ui/core'

import _ from 'lodash'
import firebase from 'firebase'
import LoadingOverlay from 'react-loading-overlay'

import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap'
import { FullWidthButton, InputGroupIconNoRound } from '../Landing'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'
import qs from 'querystring'
import { BounceLoader } from 'react-spinners'
import { LoadingContext } from '../components/LoadingProvider'



const InputGroupIcon = styled(InputGroupText)`
  background: none;
  border-left: 0px;
  border-radius: 50px;
`
const InputField = styled(Input)`
  border-right: 0px;
  border-radius: 50px;
`
const Text = styled.p`
  font-size: ${(props) => props.size}px;
  font-family: Kanit !important;
`
const ScrollingWrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
`

const Contents = styled(Grid)`
  background-color: #ffffff;
  padding: 20px;
  margin: 20px;
`

const CardItem = styled(Card)`
  display: inline-block;
  margin: 20px;
  padding: 10px;
  width: 200px;
`
const AccountAdd = (props) => {
  const { showloading, hideloading } = useContext(LoadingContext)

  const bucket = 'tribucket'
  const [form, setForm] = useState({})
  const [token, setToken] = useState({})
  const [file, setFile] = useState(null)
  const [user, setUser] = useState({})

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`/user/${user.uid}`)
          .once('value', (data) => {
            console.log('current user', data.val())
            setUser({...data.val(),uid:user.uid})
          })
      } else {
        // No user is signed in.
      }
    })
  }, [])
  console.log('Token', token)
  useEffect(() => {
    const result = axios.post(
      'https://developer.api.autodesk.com/authentication/v1/authenticate',
      qs.stringify({
        client_id: 'e9nb6uR1AOoFFY2vRoZspZA7RKRrwqxU',
        client_secret: '5jt07IIPgNjrshWN',
        grant_type: 'client_credentials',
        scope: 'data:read data:write data:create bucket:read bucket:create',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    result.then((res) => {
      setToken(res.data)
    })
  }, [])
  const attachRef = useRef(null)
  const [postion, setPosition] = useState('')
  useEffect(() => {
    document.getElementsByTagName('body')[0].className = 'defaultLayout'
  }, [])
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  console.log(form, file)

  return (
    <>
      <div
        style={{
          padding: 10,
          margin: 10,
        }}
      >
        <Layout />
        <MenuBar {...props} />
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/account">
            จัดการ Account
          </Link>
          <Link color="inherit" href="/account/add">
            เพิ่มโครงการ
          </Link>
        </Breadcrumbs>
        <Contents>
          <Text size={18}>เพิ่มโครงการ</Text>
          <Form>
            <FormGroup row>
              <Label for="projectName" sm={2}>
                ชื่อโครงการ บริษัท
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="projectName"
                  id="projectName"
                  onChange={handleChange}
                  value={form.projectName}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="projectName" sm={2}>
                อัพโหลดไฟล์ โมเดล
              </Label>
              <Col sm={1}>
                <input
                  ref={attachRef}
                  accept={'.ifc'}
                  style={{
                    display: 'none',
                  }}
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0])
                  }}
                />
                <FullWidthButton
                  color={'primary'}
                  onClick={() => {
                    attachRef.current.click()
                  }}
                >
                  อัพโหลด
                </FullWidthButton>
              </Col>
              <Col sm={1}>{_.get(file, 'name', '')}</Col>
            </FormGroup>
            <FormGroup row>
              <Label for="projectLocation" sm={2}>
                ที่อยู่โครงการ
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  name="text"
                  id="projectLocation"
                  onChange={handleChange}
                  value={form.projectLocation}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="projectOwner" sm={2}>
                หัวหน้าโครงการ
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="projectOwner"
                  id="projectOwner"
                  onChange={handleChange}
                  value={form.projectOwner}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="position" sm={2}>ตำแหน่ง</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  name="position"
                  id="position"
                  value={postion}
                  onChange={(e) => {
                    setPosition(e.target.value)
                  }}
                />
              </Col>
              <Col sm={2}>
                <FullWidthButton
                  onClick={() => {
                    let positionList = []
                    positionList = _.get(form, 'position', [])
                    if (postion) {
                      positionList.push(postion)
                      setPosition('')
                      setForm({
                        ...form,
                        position: positionList,
                      })
                    }
                  }}
                  color={'primary'}
                >
                  เพิ่ม
                </FullWidthButton>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="positionList" sm={2}></Label>
              <Col sm={10}>
                <ScrollingWrapper>
                  {_.map(form.position, (item, index) => {
                    return (
                      <CardItem key={index}>
                        <Grid container justify={'space-between'}>
                          <Text size={16}>{item}</Text>
                          <a
                            onClick={() => {
                              setForm({
                                ...form,
                                position: _.filter(form.position, (i, n) => n !== index),
                              })
                            }}
                            style={{
                              color: 'Red',
                            }}
                          >
                            <DeleteIcon />
                          </a>
                        </Grid>
                      </CardItem>
                    )
                  })}
                </ScrollingWrapper>
              </Col>
            </FormGroup>
            <Grid container justify={'flex-end'} spacing={1}>
              <Grid item xs={1}>
                <FullWidthButton
                  color={'primary'}
                  onClick={() => {
                    props.history.goBack()
                  }}
                >
                  กลับ
                </FullWidthButton>
              </Grid>
              <Grid item xs={1}>
                <FullWidthButton
                  color={'primary'}
                  onClick={() => {
                  const  positionList = _.get(form, 'position', [])
if(_.size(positionList)>0){
  if (file) {
    showloading()
    console.log({
      ...form,
      created_at: new Date(),
      user:user
    })
    firebase
      .database()
      .ref('/models')
      .push({
        ...form,
        created_at: new Date(),
        users:{
          owner:user
        }
      })
      .then((res) => {
        console.log(res)
        axios
          .put(
            `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${form.projectName}.ifc`,
            file,
            {
              headers: {
                'Content-Type': 'application/octet-stream',
                Authorization: `Bearer ${token.access_token}`,
              },
            }
          )
          .then((resp) => {
            firebase.database().ref(`/models/${res.key}/file`).set(resp.data)
            axios
              .post(
                'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
                {
                  input: {
                    urn: btoa(resp.data.objectId),
                    rootFilename: resp.data.objectKey,
                  },
                  output: {
                    destination: {
                      region: 'us',
                    },
                    formats: [
                      {
                        type: 'svf',
                        views: ['3d', '2d'],
                      },
                    ],
                  },
                },
                {
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token.access_token}`,
                    'x-ads-force': true,
                  },
                }
              )
              .then((jobres) => {
                console.log(jobres)
                firebase
                  .database()
                  .ref(`/models/${res.key}/value`)
                  .set(jobres.data.urn)
                hideloading()
                props.history.goBack()
              })
          })
          .catch((err) => console.log(err.response.data))
      })
  }

}else{
  alert('กรุณาเพิ่มตำแหน่ง 1 ตำแหน่ง ขึ้นไป')
}
                  }}
                >
                  เพิ่ม
                </FullWidthButton>
              </Grid>
            </Grid>
          </Form>
        </Contents>
      </div>
    </>
  )
}
export default AccountAdd;
