import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from '../Landing'
import Home from '../page/Home'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
const MenuGrid = styled(Grid)`
  margin-bottom: 50px;
`
const MenuStyle = styled(Menu)`
  background: transparent;
`

function MenuBar(props) {
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
    <MenuGrid container>
      <MenuStyle onClick={handleClick} selectedKeys={props.sceneKey} mode="horizontal">
        {props.tabs
          ? props.tabs.map((item, index) => {
              return <Menu.Item key={item.id}>{item.title}</Menu.Item>
            })
          : Tabs.map((item, index) => (
              <Menu.Item key={item.id}>
                <img
                  height={20}
                  src={`/asset/${item.icon}${props.sceneKey === item.id ? '_select' : ''}.png`}
                />{' '}
                {item.title}
              </Menu.Item>
            ))}
      </MenuStyle>
    </MenuGrid>
  )
}

export default MenuBar
