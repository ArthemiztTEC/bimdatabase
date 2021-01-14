import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import * as qs from 'query-string'
import styled from 'styled-components'
import { useFormik } from 'formik'
import _ from 'lodash'
import { SocialIcon } from 'react-social-icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ButtonToggle,
  FormGroup,
  Label,
} from 'reactstrap'
import './Landding.css'
import firebase from 'firebase'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import moment from 'moment'
const LandingGrid = styled(Grid)`
  padding-left: 50px;
  margin-top: 50px;
`

const LoginGrid = styled(Grid)`
  margin-left: 50px;
`
export const Title = styled.div`
  font-size: 24px;
`
export const ForgetTitle = styled.div`
  font-size: 20px;
`
export const SubTitle = styled.div`
  font-size: 0.875rem;
  line-height: 1.43;
`
export const InputGroupIcon = styled(InputGroupText)`
  background: none;
  border-right: 0px;
  border-radius: 50px;
`
export const InputGroupIconNoRound = styled(InputGroupText)`
  background: none;
  border-right: 0px;
`
export const InputField = styled(Input)`
  border-left: 0px;
  border-radius: 50px;
`
export const NoIconInputField = styled(Input)`
  border-radius: 50px;
`
export const InputGrid = styled(InputGroup)`
  margin-top: 10px;
`
const Link = styled.a`
  text-decoration: underline;
  color: black;
`
export const FullWidthButton = styled(ButtonToggle)`
  width: 100%;
  border-radius: 50px;
  margin-bottom: 10px;
`
const SocialGrid = styled(Grid)`
  margin-top: 10px;
`
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
export const WhiteBox = styled(Box)`
  width: ${({ size = 600 }) => size}px;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 20px;
`
function Landing(props) {
  const classes = useStyles()
  const { history, location } = props
  console.log('gggggg' + props)
  const [register, setRegister] = useState(false)
  const [forgetPassword, toggleForgetPassword] = useState(false)
  const [isResetPassword, toggleResetPasswordUI] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setResetCode] = useState('')
  const [resetInput, setResetInput] = useState({ password: '', confirmPassword: '' })
  useEffect(() => {
    document.getElementsByTagName('body')[0].className = 'home'
    const parsed = qs.parse(location.search)
    console.log(parsed)
    if (parsed.oobCode) {
      firebase
        .auth()
        .verifyPasswordResetCode(parsed.oobCode)
        .then(function (email) {
          setResetCode(parsed.oobCode)
          setEmail(email)
          console.log('Reset password of ', email)
          toggleResetPasswordUI(true)
        })
        .catch(function () {
          // Invalid code
        })
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastname: '',
      phone: '',
      company: '',
      taxnumber: '',
      status: '0',
    },

    onSubmit: (values) => {
      if (register) {
        if (
          values.password === values.confirmpassword &&
          values.firstName &&
          values.lastname &&
          values.company
        ) {
          var reg = new RegExp('^\\d+$')
          if (reg.test(values.taxnumber) && reg.test(values.phone)) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(values.email, values.password)
              .then((res) => {
                const input = values
                delete input.password
                delete input.confirmpassword
                firebase.database().ref(`/user/${res.user.uid}`).set(input)
                history.push('/dashboard')
              })
              .catch((e) => {
                alert(e.message)
              })
          } else {
            alert('กรุณากรอกตัวเลข')
          }
        } else {
          for (let [key, value] of Object.entries(values)) {
            if (_.isEmpty(value)) {
              alert(`กรุณากรอก ${key}`)
            }
            console.log(`${key}: ${value}`)
          }
        }
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then((result) => {
            console.log('Succesfully Signin', result)
            const now = moment().format('YYYY-MM-DD')
            console.log('login on', now)
            firebase
              .database()
              .ref(`/history/${now}/${result.user.uid}`)
              .set({
                loginDate: moment().format('HH:MM'),
              })
            history.push('/dashboard')
          })
          .catch((e) => {
            alert(e.message)
          })
      }
    },
  })
  return (
    <LandingGrid container>
      <Modal
        className={classes.modal}
        open={isResetPassword}
        onClose={() => {
          toggleResetPasswordUI(false)
        }}
      >
        <WhiteBox size={400}>
          <Grid container justify={'center'}>
            <ForgetTitle>{email} ตั้งรหัสผ่านใหม่​</ForgetTitle>
            <Grid
              container
              justify={'center'}
              style={{
                marginTop: 20,
              }}
            >
              <InputGrid>
                <NoIconInputField
                  placeholder="password"
                  type="password"
                  value={resetInput.password}
                  onChange={(e) => {
                    setResetInput({ ...resetInput, password: e.target.value })
                  }}
                />
              </InputGrid>
            </Grid>
            <Grid container justify={'center'}>
              <InputGrid>
                <NoIconInputField
                  placeholder="confirmPassword"
                  type="password"
                  value={resetInput.confirmPassword}
                  onChange={(e) => {
                    setResetInput({ ...resetInput, confirmPassword: e.target.value })
                  }}
                />
              </InputGrid>
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
                    toggleResetPasswordUI(false)
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
                    if (resetInput.password === resetInput.confirmPassword) {
                      firebase
                        .auth()
                        .confirmPasswordReset(code, resetInput.password)
                        .then(function () {
                          alert('รหัสผ่านถูกเปลี่ยนแล้วคุณสามารถล้อกอินได้ด้วยรหัสผ่านใหม่')
                          toggleResetPasswordUI(false)
                        })
                        .catch(function () {
                          alert('ล้มเหลว')
                          toggleResetPasswordUI(false)
                        })
                    } else {
                      alert('รหัสผ่านไม่ตรงกัน')
                    }
                  }}
                >
                  ตกลง
                </FullWidthButton>
              </Grid>
            </Grid>
          </Grid>
        </WhiteBox>
      </Modal>
      <Modal
        className={classes.modal}
        open={forgetPassword}
        onClose={() => {
          toggleForgetPassword(false)
        }}
      >
        <WhiteBox>
          <Grid container justify={'center'}>
            <ForgetTitle>กรุณาใส่ อีเมล เพื่อรีเซ็ตรหัสผ่าน​</ForgetTitle>
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
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
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
                    firebase
                      .auth()
                      .sendPasswordResetEmail(email)
                      .then((res) => {
                        alert('ข้อมูลการ รีเซ็ตพาสเวริดได้ถูกส่งไปที่ อีเมลของคุณแล้ว')
                        toggleForgetPassword(false)
                      })
                  }}
                >
                  ตกลง
                </FullWidthButton>
              </Grid>
            </Grid>
          </Grid>
        </WhiteBox>
      </Modal>
      <Grid container>
        <img src={'/logo.png'} />
      </Grid>
      <LoginGrid container>
        {register ? (
          <>
            {' '}
            <Grid container>
              <Title className="text-success">สมัครสมาชิก SIGN UP<br /> <SubTitle className="text-muted">กรุณาป้อนข้อมูลจริงเพื่อเป็นประโยชน์กับการใช้งานระบบของคุณ</SubTitle></Title>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                  
                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        ชื่อจริง
                      </Label>

                      <NoIconInputField                          
                          name={'firstName'}
                          value={formik.values.firstname}
                          onChange={formik.handleChange}
                        />
                    </InputGrid>
                  </Grid>


                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        นามสกุล
                      </Label>

                      <NoIconInputField                          
                          name={'lastname'}
                          value={formik.values.lastname}
                          onChange={formik.handleChange}
                        />
                    </InputGrid>
                  </Grid> 


                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        บริษัท
                      </Label>

                      <NoIconInputField                       
                        name={'company'}
                        value={formik.values.company}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>

                  
                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        ที่อยู่บริษัท
                      </Label>

                      <NoIconInputField
                        name={'companyAddress'}
                        value={formik.values.companyAddress}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        เลขผู้เสียภาษี
                      </Label>

                      <NoIconInputField
                        name={'taxnumber'}
                        value={formik.values.taxnumber}
                        onChange={(e) => {
                          formik.handleChange(e)
                        }}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        เบอร์โทรศัพท์
                      </Label>

                      <NoIconInputField
                        name={'phone'}
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container>
                    <InputGrid>
                      <Label for="company" sm={3}>
                        อีเมล
                      </Label>

                      <NoIconInputField
                        type={'email'}
                        name={'email'}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container>
                    <InputGrid>
                      <Label for="password" sm={3}>
                        รหัสผ่าน
                      </Label>

                      <NoIconInputField
                        type={'password'}
                        name={'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container>
                    <InputGrid>
                      <Label for="password" sm={3}>
                        ยืนยันรหัสผ่าน
                      </Label>

                      <NoIconInputField
                        type={'password'}
                        name={'confirmpassword'}
                        value={formik.values.confirmpassword}
                        onChange={formik.handleChange}
                      />
                    </InputGrid>
                  </Grid>

                  <br />
                  <Grid container justify={'center'}>
                    <FullWidthButton color="warning" type={'submit'}>
                      สมัครสมาชิก
                    </FullWidthButton>
                  </Grid>
                  <Grid container justify={'center'}>
                    <FullWidthButton
                      color="secondary"
                      onClick={() => {
                        setRegister(false)
                      }}
                    >
                      ยกเลิก
                    </FullWidthButton>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            {' '}
            <Grid container>
              <Title >
                เข้าสู่ระบบ <br /> <SubTitle className="text-muted">ป้อนบัญชีผู้ใช้ Username และ Password ของคุณเพื่อเข้าสู่ระบบ</SubTitle>
              </Title>
            </Grid>
            <Grid container>
              <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                  <InputGrid>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupIcon>
                        <img width={20} src={'/user.png'} />
                      </InputGroupIcon>
                    </InputGroupAddon>
                    <InputField
                      placeholder="USERNAME"
                      name={'email'}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                  </InputGrid>
                  <InputGrid>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupIcon>
                        <img width={20} src={'/lock.png'} />
                      </InputGroupIcon>
                    </InputGroupAddon>
                    <InputField
                      placeholder="PASSWORD"
                      type={'password'}
                      name={'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                  </InputGrid>
                  <InputGrid>
                  <Grid container justify={'center'}>
                    <FullWidthButton color="warning" type={'submit'}>
                      เข้าสู่ระบบ
                    </FullWidthButton>
                  </Grid>
                  </InputGrid>

                  <div className="text-right">
                  <Link
                      href={'#'}
                      onClick={() => {
                        toggleForgetPassword(true)
                      }}
                    >
                      ลืมรหัสผ่าน
                    </Link> 
                        
                    <span> | </span>
                    
                  <Link
                      href={'#'}
                      onClick={(e) => {
                        e.preventDefault()
                        setRegister(true)
                      }}
                    >
                      สมัครสมาชิก
                    </Link>
                    </div>
                  {/*<SocialGrid container justify={'flex-start'}>*/}
                  {/*  <Grid item>*/}
                  {/*    <SocialIcon*/}
                  {/*      network="facebook"*/}
                  {/*      style={{ height: 40, width: 40, marginRight: 10 }}*/}
                  {/*    />*/}
                  {/*  </Grid>*/}
                  {/*  <Grid item>*/}
                  {/*    <SocialIcon network="google" style={{ height: 40, width: 40 }} />*/}
                  {/*  </Grid>*/}
                  {/*</SocialGrid>*/}
                </form>
              </Grid>
            </Grid>
          </>
        )}
      </LoginGrid>
    </LandingGrid>
  )
}

export default Landing
