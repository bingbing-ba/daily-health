import React from 'react'

export const Form = ({professors, selected, setSelected, onSubmit}) => {
  return (
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
              key={professor}
            >
              {professor}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onSubmit}>
          제출
        </button>
      </div>
  )
}
