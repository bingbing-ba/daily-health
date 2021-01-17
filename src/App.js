import React, { useState } from 'react'
import axios from 'axios'
import { getWithExpiry, setWithExpiry } from './utils'
import './App.css'
export default function App() {
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
          {professors.map((professor, index) => {
            const { name, region } = professor
            const prevRegion = index === 0 ? '' : professors[index - 1].region
            return (
              <>
                {region === prevRegion ? null : (
                  <hr data-content={region} class="hr-text"></hr>
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
