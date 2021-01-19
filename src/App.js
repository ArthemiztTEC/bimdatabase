import React, { useContext, useState } from 'react'
import logo from './logo.svg'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import * as firebase from 'firebase'
import styled from 'styled-components'

import './App.css'
import Landing from './Landing'
import Home from './page/Home'
import Account from './page/Account'
import AccountAdd from './page/AccountAdd'
import LoadingOverlay from 'react-loading-overlay'
import { BounceLoader } from 'react-spinners'
import { LoadingContext, LoadingProvider } from './components/LoadingProvider'
import Layout from './Layout'
import MenuBar from './components/MenuBar'
import Scurve from './page/Scurve'

import Manageuser from './page/Manageuser';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyDYI_T1lhuiUgZXHfFdSd3X2uLc_pzL3AA',
  authDomain: 'bim-database.firebaseapp.com',
  databaseURL: 'https://bim-database.firebaseio.com',
  projectId: 'bim-database',
  storageBucket: 'bim-database.appspot.com',
  messagingSenderId: '169456967812',
  appId: '1:169456967812:web:b51a32b0ff44dd77b0e2d1',
  measurementId: 'G-Q2F7JHDD1D',
})
firebase.analytics()

function App() {
  const StyledLoader = styled(LoadingOverlay)`
    ._loading_overlay_overlay {
      position: fixed;
      padding: 0;
      margin: 0;

      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
    }
  `
  const { loading } = useContext(LoadingContext)
  console.log('Loading', loading)
  return (
    <StyledLoader active={loading} spinner={<BounceLoader />}>
      <Router>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/scurve" exact component={Scurve} />
          <Route path="/dashboard" render={(props) => <Home sceneKey={'dashboard'} {...props} />} />
          <Route path="/repair" render={(props) => <Home sceneKey={'repair'} {...props} />} />
          <Route
            path="/issue/:id/:model"
            render={(props) => <Home sceneKey={'issue'} {...props} />}
          />
          <Route
            path="/comingsoon"
            render={(props) => (
              <div align={'center'}>
                <Layout />
                <MenuBar {...props} />
                <p style={{ fontSize: 30 }}>กำลังจัดทำ</p>
              </div>
            )}
          />
          <Route
            path="/account"
            exact
            render={(props) => <Account sceneKey={'account'} {...props} />}
          />
          <Route
            path="/account/add"
            exact
            render={(props) => <AccountAdd sceneKey={'account'} {...props} />}
          />
          <Route
            path="/manageuser"
            exact
            render={(props) => <Manageuser sceneKey={'manageuser'} {...props} />}
          />
        </Switch>
      </Router>
    </StyledLoader>
  )
}

export default App;
