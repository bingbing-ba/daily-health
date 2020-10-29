import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  SignIn,
  Form,
  Spinner,
  AlarmToggle,
  ScheduleToggle,
} from './components'
import {
  googleLoginRedirect,
  checkIsLoggedInAndSetUser,
  getToken,
  professors,
  BASE_URL,
  isDev,
} from './utils'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toggleAlarm = () => {
    if (user) {
      axios({
        url: `${BASE_URL}/alarm`,
        method: 'POST',
        data: {
          uid: user.uid,
        },
      }).then(({ data }) => {
        if (data.status === 'ok') {
          setUser({ ...user, isAlarmOn: data.isAlarmOn })
        }
      })
    }
  }
  const onSubmit = () => {
    if (!user) {
      window.alert('로그인이 필요합니다')
      return
    }
    if (selected === '') {
      window.alert('선택하세요!')
      return
    }
    const url = `${BASE_URL}/form`

    if (window.confirm(`선택한 "${selected}"에 설문하시겠습니까?`)) {
      if (user.submitToday) {
        if (!window.confirm('이미 오늘 제출하셨습니다. 계속하시겠습니까?')) {
          return
        }
      }
      axios({
        url,
        method: 'POST',
        data: {
          name: selected,
          isDev,
          uid: user.uid,
        },
      })
        .then(({ data }) => {
          if (data.status === 'ok') {
            setUser({ ...user, submitToday: true })
            window.alert('완료되었습니다')
          } else {
            window.alert('뭔가 문제가 발생했어요ㅠㅠ')
          }
        })
        .catch((err) => console.error(err))
    }
  }
  useEffect(() => {
    if (!user) {
      setIsLoading(true)
      checkIsLoggedInAndSetUser(setUser, setIsLoading)
    } else {
      if (user.isAlarmOn) {
        getToken(user, setUser)
      }
    }
  }, [user])
  return (
    <div className="container">
      <h3 className="text-center my-4">데일리 건강 설문</h3>
      {isLoading ? (
        <Spinner />
      ) : user?.uid ? (
        <>
          <AlarmToggle isAlarmOn={user?.isAlarmOn} toggleAlarm={toggleAlarm} />
          <Form
            professors={professors}
            selected={selected}
            setSelected={setSelected}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        <SignIn onSignIn={googleLoginRedirect} />
      )}
      {user?.admin ? <ScheduleToggle /> : null}
    </div>
  )
}
