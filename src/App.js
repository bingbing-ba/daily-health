import React, { useState } from 'react'
import axios from 'axios'
import { getWithExpiry, setWithExpiry } from './utils'
import './App.css'
export default function App() {
  const professors = [
    '김탁희',
    '오창희',
    '유태영',
    '변승환',
    '김준호',
    '김재석',
    '송빈산',
    '김선재',
    '이철민',
    '이민교',
    '유창오',
    '김도영',
    '김구현',
  ]

  const [selected, setSelected] = useState('')

  const onSubmit = () => {
    if (selected === '') {
      window.alert('선택하세요!')
      return
    }

    if (window.confirm(`선택한 "${selected}"에 설문하시겠습니까?`)) {
      if (getWithExpiry(selected)) {
        if (window.confirm('이미 오늘 제출하셨습니다. 계속하시겠습니까?')) {
          axios
            .get(
              `https://us-central1-daily-health-e6043.cloudfunctions.net/submitForm?name=${selected}`
            )
            .then(({ data }) => {
              if (data.status_code === 200) {
                window.alert('완료되었습니다')
              } else {
                window.alert('뭔가 문제가 발생했어요ㅠㅠ')
              }
            })
            .catch((err) => console.error(err))
        }
      } else {
        axios
          .get(
            `https://us-central1-daily-health-e6043.cloudfunctions.net/submitForm?name=${selected}`
          )
          .then(({ data }) => {
            if (data.status_code === 200) {
              setWithExpiry(selected)
              window.alert('완료되었습니다')
            } else {
              window.alert('뭔가 문제가 발생했어요ㅠㅠ')
            }
          })
          .catch((err) => console.error(err))
      }
    }
  }

  return (
    <div className="container">
      <h3 className="text-center my-4">데일리 건강 설문</h3>
      <div className="center">
        <div className="inputs">
          {professors.map((professor) => (
            <button
              className={
                selected === professor ? 'btn btn-success' : 'btn btn-secondary'
              }
              onClick={() => {
                setSelected(professor)
              }}
            >
              {professor}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onSubmit}>
          제출
        </button>
      </div>
    </div>
  )
}
