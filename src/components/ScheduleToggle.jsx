import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils'

export const ScheduleToggle = () => {
  const [schedule, setSchedule] = useState(false)
  useEffect(() => {
    axios({
      url: `${BASE_URL}/schedule`,
      method: 'GET',
    })
      .then(({ data }) => {
        setSchedule(data.schedule)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])
  const toggleSchedule = () => {
    axios({
      url: `${BASE_URL}/toggleSchedule`,
      method: 'GET',
    })
      .then(({ data }) => {
        if (data.status === 'ok') {
          setSchedule(data.schedule)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <>
      <label>스케줄설정</label>
      <label className="switch">
        <input type="checkbox" checked={schedule} onChange={toggleSchedule} />
        <span className="slider round"></span>
      </label>
    </>
  )
}
