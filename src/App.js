import React, { useState } from 'react'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'

import { getWithExpiry, setWithExpiry } from './utils'
import './App.css'

const firebaseConfig = {
  apiKey: "AIzaSyDAdldtN0OBY8hikjYLZxln7uZe0gdE9q0",
  authDomain: "ssafy-health-dev.firebaseapp.com",
  projectId: "ssafy-health-dev",
  storageBucket: "ssafy-health-dev.appspot.com",
  messagingSenderId: "710430201067",
  appId: "1:710430201067:web:d333b2d042c9ec541c5aae",
  measurementId: "G-41D46MHL0B"
}

firebase.initializeApp(firebaseConfig)

let mode = 'production'

if(process.env.NODE_ENV === 'development'){
  mode = 'local'
}
if(process.env.REACT_APP_SERVE_ENV === 'development'){
  mode = 'development'
}

let submitURL = 'https://us-central1-ssafy-health.cloudfunctions.net/submitForm'

if (mode === 'local'){
  submitURL = 'http://localhost:5001/ssafy-health-dev/us-central1/submitForm'
}
if (mode === 'development'){
  submitURL = 'https://us-central1-ssafy-health-dev.cloudfunctions.net/submitForm'
}

const professors = [
  { name: '김탁희', region: '서울', classNo: '1반' },
  { name: '오창희', region: '서울', classNo: '1반' },
  { name: '유태영', region: '서울', classNo: '2반' },
  { name: '변승환', region: '서울', classNo: '3반' },
  { name: '김준호', region: '서울', classNo: '4반' },
  { name: '김재석', region: '서울', classNo: '5반' },
  { name: '송빈산', region: '대전', classNo: '1반' },
  { name: '김선재', region: '대전', classNo: '2반' },
  { name: '이철민', region: '대전', classNo: '3반' },
  { name: '이민교', region: '광주', classNo: '1반' },
  { name: '유창오', region: '광주', classNo: '2반' },
  { name: '김도영', region: '구미', classNo: '1반' },
  { name: '김구현', region: '구미', classNo: '2반' },
]

export default function App() {
  const [selected, setSelected] = useState('')

  const onSubmit = () => {
    if (selected === '') {
      window.alert('선택하세요!')
      return
    }

    if (!window.confirm(`선택한 "${selected}"에 설문하시겠습니까?`)) {
      return
    }

    if (
      !getWithExpiry(selected) ||
      window.confirm('이미 오늘 제출하셨어요. 계속할까요?')
      // 오늘 아직 제출하지 않았거나 제출했는데도 한 번 더 제출하려고 할 때
    ) {
      axios
        .get(`${submitURL}?name=${selected}`)
        .then(({ data }) => {
          if (data.status_code === 200) {
            window.alert('완료되었습니다')
            setWithExpiry(selected)
          } else {
            window.alert('뭔가 문제가 발생했어요ㅠㅠ')
          }
          setSelected('')
        })
        .catch((err) => {
          console.error(err)
          setSelected('')
        })
    }
  }

  return (
    <div className="container">
      <h3 className="text-center my-4">데일리 건강 설문</h3>
      <div className="center">
        <div className="inputs">
          {professors.map((professor, index) => {
            const { name, region } = professor
            const prevRegion = index === 0 ? '' : professors[index - 1].region
            return (
              <>
                {region === prevRegion ? null : (
                  <hr data-content={region} className="hr-text"></hr>
                )}
                <button
                  className={
                    selected === name ? 'btn btn-success' : 'btn btn-secondary'
                  }
                  onClick={() => {
                    setSelected(name)
                  }}
                >
                  {name}
                </button>
              </>
            )
          })}
        </div>

        <button className="btn btn-primary" onClick={onSubmit}>
          제출
        </button>
      </div>
    </div>
  )
}
