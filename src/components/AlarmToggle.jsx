import React from 'react'
import './AlarmToggle.css'

export const AlarmToggle = ({isAlarmOn, toggleAlarm}) => {
  return (
    <div>
      <label>알람설정</label>
      <label className="switch">
        <input type="checkbox" checked={isAlarmOn} onChange={toggleAlarm}/>
        <span className="slider round"></span>
      </label>
    </div>
  )
}
