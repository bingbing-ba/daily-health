import { initializeApp, auth, messaging as fbMessaging } from 'firebase'
import axios from 'axios'
export const isDev = true

export const getWithExpiry = (key) => {
  const itemStr = window.localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()

  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key)
    return null
  }
  return item.value
}

export const setWithExpiry = (key) => {
  const now = new Date()
  now.setHours(23, 59, 59)
  const item = {
    value: true,
    expiry: now.getTime(),
  }
  window.localStorage.setItem(key, JSON.stringify(item))
}

export const firebaseConfig = isDev
  ? {
      apiKey: 'AIzaSyDTdqf1cQq2bI2ueGPCNVIhWIQhXL7n0jY',
      authDomain: 'daily-health-dev.firebaseapp.com',
      databaseURL: 'https://daily-health-dev.firebaseio.com',
      projectId: 'daily-health-dev',
      storageBucket: 'daily-health-dev.appspot.com',
      messagingSenderId: '131724903679',
      appId: '1:131724903679:web:36ea3cdd951dca5045b8ca',
      measurementId: 'G-0CVXP4KLEJ',
    }
  : {
      apiKey: 'AIzaSyDyTgXGnB_DYnxC_6l2dfpie-eG7YrS7sg',
      authDomain: 'daily-health-e6043.firebaseapp.com',
      databaseURL: 'https://daily-health-e6043.firebaseio.com',
      projectId: 'daily-health-e6043',
      storageBucket: 'daily-health-e6043.appspot.com',
      messagingSenderId: '86351689997',
      appId: '1:86351689997:web:aab10a409ad41496fed844',
      measurementId: 'G-S637PK27PP',
    }
export const vapidKey = isDev
  ? 'BOvIu2Yv940ayAM_QP2VSMEemN3vShtO-cgUtIvMaCP0MEwSFTYing8DkH8GVluEhcaMb0x3ZB8T7zd1u7VDGBI'
  : 'BD3SGd80LYpNmiuEYMFvH6-lDqW9cIOf9ohkS7YRHD1fR9pEwdprvV6IDsqwjmTDna0woe7pHjwa-ITls2kK-n8'

initializeApp(firebaseConfig)
const messaging = fbMessaging()

export const googleLoginRedirect = () => {
  const provider = new auth.GoogleAuthProvider()
  auth().signInWithRedirect(provider)
}

export const googleSignOut = () => {
  auth()
    .signOut()
    .then((result) => {
      console.log('sign out result', result)
    })
    .catch((err) => console.error('signout failed', err))
}

let serviceWorker = null
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('worker.js').then((sw) => {
        serviceWorker = sw
      })
    })
  }
}

export const professors = [
  '변승환',
  '유창오',
  '김구현',
  '이철민',
  '송빈산',
  '김도영',
  '이민교',
  '오창희',
  '김준호',
  '김재석',
]
export const BASE_URL = isDev
  ? 'https://us-central1-daily-health-dev.cloudfunctions.net/dailyHealth'
  // ? 'http://localhost:5001/daily-health-dev/us-central1/dailyHealth'
  : 'https://us-central1-daily-health-e6043.cloudfunctions.net'

export const checkIsLoggedInAndSetUser = (setUser, setIsLoading) => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      axios({
        url: `${BASE_URL}/user`,
        method: 'GET',
        params: {
          uid: user.uid,
        },
      })
        .then(({ data }) => {
          setUser({ ...data.user, uid: user.uid })
        })
        .finally(() => setIsLoading(false))
    } else {
      setUser(null)
      setIsLoading(false)
    }
  })
}

export const getToken = async (user, setUser) => {
  const { uid, tokens } = user
  if (serviceWorker === null) {
    return
  }
  try {
    const currentToken = await messaging.getToken({
      vapidKey,
      serviceWorkerRegistration: serviceWorker,
    })
    if (currentToken) {
      if (tokens && Object.values(tokens).includes(currentToken)) {
        return
      }
      const { data } = await axios({
        url: `${BASE_URL}/token`,
        method: 'POST',
        data: {
          uid,
          token: currentToken,
        },
      })
      if (data.status === 'ok') {
        setUser({ ...user, tokens: data.user.tokens })
      } else {
        console.log('error:', data.error)
      }
    } else {
      console.log('fail to get token')
    }
  } catch (error) {
    console.log('getToken -> error', error)
  }
}
