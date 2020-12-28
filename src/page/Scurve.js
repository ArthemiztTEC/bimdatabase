import Layout from '../Layout'
import MenuBar from '../components/MenuBar'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import React from 'react'

const Scurve = (props)=>{
  return   <div
    style={{
      padding: 10,
      margin: 10,
    }}
  >
    <Layout />
    <MenuBar {...props} />
    <Breadcrumbs aria-label="breadcrumb">


    </Breadcrumbs>
  </div>
}
export default Scurve;
