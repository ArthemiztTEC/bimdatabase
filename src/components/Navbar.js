import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from '../Landing'
import Home from '../page/Home'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import styled from 'styled-components'
import firebase from 'firebase'
import Grid from '@material-ui/core/Grid'
import Layout from '../'
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
// import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import './Navbar.css';
import { useRadioGroup } from '@material-ui/core'

const MenuGrid = styled(Grid)`
  margin-bottom: 50px;
`
const MenuStyle = styled(Menu)`
  background: transparent; 
  color: white;
`

// import { FaBeer } from "@react-icons/all-files/fa/FaBeer";



function Navbar(props) {
  console.log(props)
  const handleClick = (e) => {
    // console.log('click ', e)
    if (props.tabs) {
      props.setMode(e.key)
    } else {
      if (e.key !== 'issue') {
        props.history.push(`/${e.key}`)
        // props.setMode('3d')
      }
    }
  }

//   const handleClickRe = (e) =>{
//   return (
//      <Menu.Item key='repair'>repair</Menu.Item>
//   )

//     // else {
//     //   if (e.key !== 'issue') {
//     //     props.history.push(`/${e.key}`)
//     //     props.setMode('3d')
//     //   }
//     // }
//  }
const [user, setUser] = useState({})
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
let Tabs = []
  if (user.status == 3){
    Tabs = [
      {
        title: ' หน้าแรก',
        id: 'dashboard',
        icon: 'Home_select',
      },
      {
        title: ' แจ้งซ่อม',
        id: 'repair',
        icon: 'Inform_select',
      },
      {
        title: 'จัดการโครงการ',
        id: 'account',
        icon: 'List_select',
      },
      {
        title: ' จัดการบัญชี',
        id: 'manageuser',
        icon: 'manage_select',
      },
    ]
  }
  if (user.status == 2){
    Tabs = [
      {
        title: ' หน้าแรก',
        id: 'dashboard',
        icon: 'Home_select',
      },
      {
        title: ' แจ้งซ่อม',
        id: 'repair',
        icon: 'Inform_select',
      },
      {
        title: 'จัดการโครงการ',
        id: 'account',
        icon: 'List_select',
      },
    ]
  }
  if (user.status == 1){
    Tabs = [
      {
        title: ' หน้าแรก',
        id: 'dashboard',
        icon: 'Home_select',
      },
      {
        title: ' แจ้งซ่อม',
        id: 'repair',
        icon: 'Inform_select',
      }
    ]
  }
  else if(user.status < 1){
    Tabs = [
      {
        title: ' หน้าแรก',
        id: 'dashboard',
        icon: 'Home_select',
      },
      
    ]
  }
   
  if (!props.tabs) {
    if (props.sceneKey === 'issue') {
      Tabs = [
        {
          title: ' หน้าหลัก',
          id: 'dashboard',
          icon: 'Home_select',
        },
        {
          title: ' แจ้งซ่อม',
          id: 'repair',
          icon: 'Inform_select',
        },
        {
          title: ' รายงานแจ้งซ่อม',
          id: 'issue',
          icon: 'Inform_select',
        },
      ]
    }
  }
  if (!props.tabs) {
    if (user.status == 3){
    if (props.sceneKey === 'issue') {
      Tabs = [
        {
          title: ' หน้าหลัก',
          id: 'dashboard',
          icon: 'Home_select',
        },
        {
          title: ' แจ้งซ่อม',
          id: 'repair',
          icon: 'Inform_select',
        },
        {
          title: ' รายงานแจ้งซ่อม',
          id: 'issue',
          icon: 'Inform_select',
        },
        {
          title: 'จัดการโครงการ',
          id: 'account',
          icon: 'List_select',
        },
        {
          title: ' จัดการบัญชี',
          id: 'manageuser',
          icon: 'manage_select',
        },
      ]
    }
  }
}


  return ( 
    <>
      <SideNav
        onSelect={selected => {

         }}
      >
        
        <SideNav.Nav>
                <> <img height={50} style={{ padding: "10px" }} src={`/logoMenu.png`}/> </>

            <MenuStyle onClick={handleClick} selectedKeys={props.sceneKey} mode="inline">
                {props.tabs ? props.tabs.map((item, index) => {
                      return <Menu.Item key={item.id}>{item.title}</Menu.Item>
                    })
                  : Tabs.map((item, index) => (
                    <Menu.Item key={item.id}>
                
                    <img style={{ marginRight:"5px" , paddingBottom: "5px" }}
                      height={20}
                      src={`/asset/${item.icon}${props.sceneKey === item.id ? '' : ''}.png`}
                    />{'  '}
                    {item.title} 
                  
                  </Menu.Item>
                    ))}
              </MenuStyle>
          {/* </NavItem> */}

        </SideNav.Nav>
      </SideNav>
    </>
  )
}

export default Navbar
