import React from 'react'

export const SignIn = ({ onSignIn }) => {
  return (
    <div className="d-flex justify-content-center mt-5">
      <button className="btn btn-primary btn-lg" onClick={onSignIn}>
        로그인하기
      </button>
    </div>
  )
}
