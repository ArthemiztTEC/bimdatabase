import React, { useEffect, useState } from 'react'
import crypto from 'crypto'
import {
  Collapse,
  Input,
  InputGroupAddon,
  InputGroupText,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  InputGroup,
  DropdownToggle,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import styled from 'styled-components'
import * as firebase from 'firebase'
import Grid from '@material-ui/core/Grid'
import { Button, Modal, notification } from 'antd'
import moment from 'moment'
import * as querystring from 'querystring'

const InputGroupIcon = styled(InputGroupText)`
  background: none;
  border-left: 0px;
  border-radius: 50px;
`
const InputField = styled(Input)`
  border-right: 0px;
  border-radius: 50px;
`
function Layout(props) {
  const { id } = props
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({})
  const [line, setLine] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`/user/${user.uid}`)
          .once('value', (data) => {
            console.log('current user', data.val())
            setUser({ ...data.val(), uid: user.uid })
          })
      } else {
        // No user is signed in.
      }
    })
  }, [])
  const toggle = () => setIsOpen(!isOpen)
  const { taxnumber = '', company = '', phone = '' } = user
  return (
    <Grid>
      <div>
        <Modal
          title="ตั้งค่าLine Notiy"
          visible={line}
          onOk={() => {
            firebase.database().ref(`/user/${user.uid}/token`).set(token)
            setLine(false)
          }}
          onCancel={() => {
            setLine(false)
          }}
        >
          <p>
            ลงทะเบียน รับ Token จากลิ้ง{' '}
            <a href={'https://notify-bot.line.me/th/'}>https://notify-bot.line.me/th/</a>
          </p>
          <Input
            placeholder="Line"
            value={token}
            onChange={(e) => {
              setToken(e.target.value)
            }}
          />
        </Modal>
      </div>
      <Navbar
        light
        expand="md"
        style={{
          width: '90%',
        }}
      >
        {/* <NavbarBrand href="/">
          <img height={'50px'} src={'/logo.png'} />
        </NavbarBrand> */}
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="justify-content-end" style={{ width: '100%' }} navbar>
            <NavItem>
              <UncontrolledButtonDropdown>
                <DropdownToggle tag="div">
                  <NavLink href="#">
                    <img src={'/user.png'} />
                    {'  '}
                    {user.firstName} 
                    
                    {/* status ตัวอย่าง */}
                  </NavLink>
                </DropdownToggle>
                <DropdownMenu
                  style={{
                    width: 300,
                    left: -200,
                  }}
                >
                  <DropdownItem>
                    ชื่อ {user.firstName} {user.lastname} 
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      const searchParams = querystring.stringify({
                        response_type: 'code',
                        client_id: 'tKhsV6OXEqm35U9WBF9mW6',
                        redirect_uri:
                          'https://us-central1-bim-database.cloudfunctions.net/lineRegister',
                        scope: 'notify',
                        state: `${crypto.randomBytes(5).toString('hex')}${user.uid}`,
                      })
                      window.open(`https://notify-bot.line.me/oauth/authorize?${searchParams}`)
                    }}
                  >
                    ตั้งค่า แจ้งเตือน Line
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      firebase
                        .database()
                        .ref(`/user/${user.uid}/lineToken`)
                        .set('')
                        .then((res) => {
                          notification.open({
                            message: 'ปิดการแจ้งเตือน',
                            description: 'ปิดการแจ้งเตือนแล้ว',
                            onClick: () => {
                              console.log('Notification Clicked!')
                            },
                          })
                        })
                    }}
                  >
                    ปิดการแจ้งเตือน
                  </DropdownItem>
                  <DropdownItem>บริษัท {company}</DropdownItem>
                  <DropdownItem>เลขประจำตัวผู้เสียภาษี {taxnumber}</DropdownItem>{' '}
                  <DropdownItem>เบอรโทรศัพท์ {phone}</DropdownItem>
                  <DropdownItem header>
                    <NavLink
                      href={'#'}
                      onClick={(e) => {
                        e.preventDefault()
                        if (user) {
                          firebase
                            .database()
                            .ref(`/history/${id}/${moment().format('YYYY-MM-DD')}/${user.uid}`)
                            .update({
                              ...user,
                              logoutDate: moment().format('HH:mm'),
                            })
                        }
                        firebase
                          .auth()
                          .signOut()
                          .then(() => {
                            window.location.replace('/')
                          })
                      }}
                    >
                      Logout
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </Grid>
  )
}

export default Layout
