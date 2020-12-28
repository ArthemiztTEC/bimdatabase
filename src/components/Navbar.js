import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from '../Landing'
import Home from '../page/Home'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

const MenuGrid = styled(Grid)`
  margin-bottom: 50px;
`
const MenuStyle = styled(Menu)`
  background: transparent; 
`


function Navbar(props) {
  console.log(props)
  const handleClick = (e) => {
    console.log('click ', e)
    if (props.tabs) {
      props.setMode(e.key)
    } else {
      if (e.key !== 'issue') {
        props.history.push(`/${e.key}`)
        props.setMode('3d')
      }
    }
  }
  let Tabs = [
    {
      title: 'หน้าแรก',
      id: 'dashboard',
      icon: 'Home',
    },
    {
      title: 'แจ้งซ่อม',
      id: 'repair',
      icon: 'Inform',
    },
    {
      title: 'จัดการ Account',
      id: 'account',
      icon: 'manage',
    },
    {
      title: 'ทดสอบเพิ่มเมนู',
      id: 'report',
      icon: 'manage',
    },
  ]
  if (!props.tabs) {
    if (props.sceneKey === 'issue') {
      Tabs = [
        {
          title: 'หน้าแรก',
          id: 'dashboard',
          icon: 'Home',
        },
        {
          title: 'แจ้งซ่อม',
          id: 'repair',
          icon: 'Inform',
        },
        {
          title: 'รายงานแจ้งซ่อม',
          id: 'issue',
          icon: 'Inform',
        },
        {
          title: 'จัดการ Account',
          id: 'account',
          icon: 'manage',
        },
      ]
    }
  }

  return (
    <>
    <div>test เอาhtml มาผสม</div>

        <div className='navbar'>
          <a to='#' className='menu-bars'>
            <a />
          </a>
        </div>
        <nav className='nav-menu active'>
          <ul className='nav-menu-items' >
            <li className='navbar-toggle'>
              <a className='menu-bars'>
               
              </a>
            </li>
          </ul>
        </nav>

    <MenuGrid container >

      <Grid item xs={2} style={{backgroundColor: "lightblue"}}>
      <MenuStyle onClick={handleClick} selectedKeys={props.sceneKey} mode="inline">
        {props.tabs
          ? props.tabs.map((item, index) => {
              return <Menu.Item key={item.id}>{item.title}</Menu.Item>
            })
          : Tabs.map((item, index) => (
              <Menu.Item key={item.id}>
                <img
                  height={20}
                  // src={`/asset/${item.icon}${props.sceneKey === item.id ? '_select' : ''}.png`}
                />{' '}
                {item.title}
              </Menu.Item>
            ))}
      </MenuStyle>
      </Grid>
      
    </MenuGrid>
    </>
  )
}

export default Navbar
