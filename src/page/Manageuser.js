import Layout from '../Layout'
import MenuBar from '../components/MenuBar'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card } from '@material-ui/core'
import _ from 'lodash'
import AWS from 'aws-sdk'
import Modal from '@material-ui/core/Modal'


import {
  ButtonToggle,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap'

import { FullWidthButton, InputGrid } from '../Landing'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import * as firebase from 'firebase'
import CardActionArea from '@material-ui/core/CardActionArea'
import DeleteIcon from '@material-ui/icons/Delete'
import { Table } from 'antd'
import { BitlyClient } from 'bitly'
import Navbar from '../components/Navbar'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/styles'


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
  white-space: pre-wrap;
  font-family: Kanit !important;
  font-size: ${(props) => props.size}px;
  margin-bottom: 0;
`
const ScrollingWrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
`
const CardItem = styled(Card)`
  display: inline-block;
  margin: 20px;
  padding: 20px;
  width: 400px;
  height: 200px;
  background-color: ${({ selected }) => {
    return selected ? '#29a2d7' : '#FFFFF'
  }}!important;
`
const Contents = styled(Grid)`
  -webkit-box-shadow: 0 4px 6px -6px #222;
  -moz-box-shadow: 0 4px 6px -6px #222;
  box-shadow: 0 4px 6px -6px #222;
  background-color: #ffffff;
  padding: 20px;
  margin: 20px;
`
export const WhiteBox = styled(Box)`
  width: ${({ size = 600 }) => size}px;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 20px;
`
export const ForgetTitle = styled.div`
  font-size: 20px;
`
export const NoIconInputField = styled(Input)`
  border-radius: 50px;
`
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

const SPACES_KEY = '7L5CXYDG6YD6ZT5I7NBA'
const SPACES_SECRET = 'jF0h/5ZWvGzhrisOjUdNzvP5S8IMfkoSni6seDS+FVk'
const SPACES_NAME = 'ndf.server.bim'
const SPACES_ENDPOINT = 'sgp1.digitaloceanspaces.com'
const url = 'https://ndf.server.bim.sgp1.cdn.digitaloceanspaces.com/'
const Manageuser = (props) => {
  const spacesEndpoint = new AWS.Endpoint(SPACES_ENDPOINT)

  const [user, setCurrentUser] = useState({})
  const bucketUrl = `https://${SPACES_NAME}.${SPACES_ENDPOINT}/`

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET,
  })

  const database = firebase.database()
  const [modelList, setModelList] = useState([])
  const [selected, setSelected] = useState('all')
  const [users, setUsers] = useState([])
  const [memberForm, setForm] = useState({})
  const [projectFile, setProjectFile] = useState(null)
  const [memberEditForm, setEditForm] = useState({})

  const [forgetPassword, toggleForgetPassword] = useState(false)
  // const [email, setEmail] = useState('')
  const classes = useStyles()
  


  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`/user/${user.uid}`)
          .once('value', (data) => {
            //console.log('current user', data.val())
            setCurrentUser({ ...data.val(), uid: user.uid })

            firebase
              .database()
              .ref('/models')
              .on('value', (snap) => {
                //console.log('setModelList', user)

                let output = []
                _.forEach(snap.val(), (item, index) => {
                  _.forEach(item.users, (member) => {
                    if (member.uid === user.uid) {
                      //console.log('Member', member.uid === user.uid)
                      output.push({ ...item, key: index })
                    }
                  })
                })
                setModelList(output)
              })
          })
      } else {
        // No user is signed in.
      }
    })

    database.ref('/user').once('value', (snap) => {
      setUsers(
        _.map(snap.val(), (item, index) => ({
          ...item,
          uid: index,
        }))
      )
    })

    document.getElementsByTagName('body')[0].className = 'defaultLayout'
  }, [])

  const columns = [
    {
      title: '#',

      render: (text) => <img src={'/user.png'} />,
    },
    {
      title: 'ชื่อ',

      render: (item) => {
        const { firstName = '', lastname = '' } = item
        //console.log('item', item)
        return `${firstName} ${lastname}`
      },
    },
    {
      title: 'บริษัท',
      render: (item) => {
        const { company = '' } = item
        //console.log('item', item)
        return `${company}`
      },
    },
    {
      title: 'โครงการ',

      render: (item) => {
        return _.map(modelList, (project) => {
          if (_.find(project.users, (user) => item.uid === user.uid)) {
            return `${project.projectName || project.name},`
          } else {
            return null
          }
        })
      },
    },
    {
      title: 'ข้อมูลผู้ใช้',
        render: (item) => <button type="button" className="btn btn-secondary" onClick={() => {
          const {uid='',email ='',firstName = '', lastname = '' ,company = '' ,phone = '',taxnumber ='',idnum =''} = item
          alert(
          "uid : "+uid+'\n'+
          "ชื่อ : "+firstName+" "+lastname+ '\n'+
          "ที่อยู่ : "+company+ '\n'+
          "อีเมล : "+email+ '\n'+
          "โทร : "+phone+ '\n'+
          "เลขบัตรประชาชน : "+idnum+ '\n'+
          "เลขผู้เสียภาษี : "+taxnumber+ '\n'
          );
        }}>ข้อมูล</button> ,
    },
    // {
    //   title: 'ข้อมูลผู้ใช้',
    //     render: (item) => <Link
    //     // href={'#'}
    //     className="btn btn-secondary"
    //     style={{ width: "100px", color:"white"}}
    //     onClick={() => {
    //       const {email ='',firstName = '', lastname = '' ,company = '' ,phone = '',taxnumber ='',idnum =''} = item
          
    //     }}
    //   >ข้อมูล</Link> 
    // },
    {
      title: 'สถานะ',
      render: (item) => {
        const { status = '' } = item
        if(status == 1){
          return <p className="text-success">อนุมัติแล้ว</p>
        }
        if(status == 0){
          return <button className="btn btn-primary">อนุมัติ</button>
          //กดแล้วเพิ่ม 1 เข้าไปใน status
        }
      }
      // render: (Button) => <button className="btn btn-secondary">อนุญาต</button>,
      // render: (item) => {
      //   const { approve = '' } = item
      //   //console.log('item', item)
      //   return `${approve}`
      // },
    },
  ]
  
  return ( 
    <div
      style={{
        padding: 0,
        margin: 0,
      }}
    >

      {/* ---------------------------------------------------------------------------------------- หน้า Layout ICon ขวามือ*/}
      <Layout />

      {/* ---------------------------------------------------------------------------------------- เปิดเมนู Navbar ชิดซ้ายที่จะทำขึ้นใหม่*/}
      <Navbar {...props} />
       {/* --------------------------------------------------------------------------------------- ปิดเมนู Navbar ชิดซ้ายที่จะทำขึ้นใหม่*/}

      {/* ---------------------------------------------------------------------------------------- หัวข้อTextแสดงในหน้า ManageAccount*/}
      <Breadcrumbs aria-label="breadcrumb" style={{ paddingLeft: "12em" }}>
        <Text size={18} style={{ paddingBottom: "1em" }}>จัดการ บัญชีผู้ใช้</Text>
      </Breadcrumbs>
      
      <Modal
        className={classes.modal}
        open={forgetPassword}
        onClose={() => {
          toggleForgetPassword(false)
        }}
      >
        <WhiteBox>
          <Grid container justify={'center'}>
            <ForgetTitle></ForgetTitle>
            <Grid
              container
              justify={'center'}
              style={{
                marginTop: 20,
              }}
            >
              <Grid xs={8}>
                <InputGrid>
                  <NoIconInputField 
                    // placeholder={email}
                    value = {props.firstName}
                    // onChange={(e) => {
                    //   setEmail(e.target.value)
                    // }}
                  />
                </InputGrid>
              </Grid>
            </Grid>

            <Grid
              container
              justify={'center'}
              style={{
                marginTop: 30,
              }}
            >
              <Grid
                xs={3}
                style={{
                  marginRight: 10,
                }}
              >
                <FullWidthButton
                  type={'submit'}
                  onClick={() => {
                    toggleForgetPassword(false)
                  }}
                >
                  ยกเลิก
                </FullWidthButton>
              </Grid>
              <Grid xs={3}>
                <FullWidthButton
                  color="warning"
                  type={'submit'}
                  onClick={() => {
                    // firebase
                    //   .auth()
                    //   .sendPasswordResetEmail(email)
                    //   .then((res) => {
                    //     alert('ข้อมูลการ รีเซ็ตพาสเวริดได้ถูกส่งไปที่ อีเมลของคุณแล้ว')
                    //     toggleForgetPassword(false)
                    //   })
                  }}
                >
                  ตกลง
                </FullWidthButton>
              </Grid>
            </Grid>
          </Grid>
        </WhiteBox>
      </Modal>


  
      
        <Table 
          style={{
            width: '100%',
            paddingLeft: "12em",
            paddingRight: "1.5em",
          }}
          columns={columns}
          dataSource={_.map(users, (item, index) => ({ ...item, id: index }))}
        />
      


    </div>
  )
}
export default Manageuser
