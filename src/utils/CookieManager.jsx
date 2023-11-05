import { useCookies } from "react-cookie";

const TOKEN_COOKIE_NAME = 'token_cookie'

const setCookie = (name, value, options) => {
  const [cookies, setCookie] = useCookies([name])
  setCookie(name, value, options)
}

const getCookie = (name) => {
  const [cookies] = useCookies([name])
  return cookies[name] || null
}

const removeCookie = (name) => {
  const [, removeCookie] = useCookies([name])
  removeCookie(name)
}

export default (
  TOKEN_COOKIE_NAME,
  setCookie,
  getCookie,
  removeCookie
)