import React, { Component, useState } from 'react'
import { Select } from 'antd'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import _ from 'lodash'

const qs = require('querystring')
const { Option } = Select
const HomeStyle = styled(Grid)`
  margin-left: 100px;
  height: 100px;
  width: 100px;
  margin-top: 10px;
`
const ViewerGrid = styled.div`
  display: block;
  height: 100px;
  width: 100px;
`
const Autodesk = window.Autodesk
let viewer

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: null,
      token: false,
    }
  }
  

  componentDidMount() {
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
      console.log('res', res.data)
      this.setState({ token: res.data })
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /**
     * Autodesk.Viewing.Document.load() failuire callback.
     */
    const onDocumentLoadFailure = (viewerErrorCode) => {
      console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
    }

    /**
     * viewer.loadModel() success callback.
     * Invoked after the model's SVF has been initially loaded.
     * It may trigger before any geometry has been downloaded and displayed on-screen.
     */
    const onLoadModelSuccess = (model) => {
      console.log('onLoadModelSuccess()!')

      console.log('Validate model loaded: ' + (viewer.model === model))
      console.log(model)
    }

    /**
     * Autodesk.Viewing.Document.load() success callback.
     * Proceeds with model initialization.
     */
    const onDocumentLoadSuccess = (doc) => {
      // A document contains references to 3D and 2D viewables.
      var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(
        doc.getRootItem(),
        { type: 'geometry' },
        true
      )
      if (viewables.length === 0) {
        console.error('Document contains no viewables.')
        return
      }

      // Choose any of the avialble viewables
      var initialViewable = viewables[0]
      var svfUrl = doc.getViewablePath(initialViewable)
      var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath(),
      }

      var viewerDiv = document.getElementById('MyViewerDiv')
      viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv)
      viewer.start(svfUrl, modelOptions, this.onLoadModelSuccess, this.onLoadModelError)
    
    }
    /**
     * viewer.loadModel() failure callback.
     * Invoked when there's an error fetching the SVF file.
     */
    const onLoadModelError = (viewerErrorCode) => {
      console.error('onLoadModelError() - errorCode:' + viewerErrorCode)
    }

    let options = {
      env: 'AutodeskProduction',
      accessToken: '',
    }
    let documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dHJpYnVja2V0L2Jhc2ljLnJ2dA'
    let token = _.get(this.state, 'token.access_token', false)
    if (token) {
      console.log('has token', document.getElementById('MyViewerDiv'))

      options = {
        env: 'AutodeskProduction',
        accessToken: token,
      }

      Autodesk.Viewing.Initializer(options, function onInitialized() {
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
      })
    }
  }

  render() {
    console.log(window)
    return (
      <div>
        <Narbar />
        <HomeStyle container align={'center'} justify={'center'}>
          <ViewerGrid>
            <div id={'MyViewerDiv'}></div>
          </ViewerGrid>
        </HomeStyle>
      </div>
    )
  }
}

export default Home;
