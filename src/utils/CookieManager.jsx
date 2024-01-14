import { useCookies } from "react-cookie";

export const TOKEN_COOKIE_NAME = 'token_cookie'

export const setCookie = (name, value, options) => {
  const [, setCookie] = useCookies([name])
  setCookie(name, value, options)
}

export const getCookie = (name) => {
  const [cookies] = useCookies([name])
  return cookies[name] || null
}

export const removeCookie = (name) => {
  const [, removeCookie] = useCookies([name])
  removeCookie(name)
}

export const getTokenFromCookie = () => {
  const cookies = document.cookie.split('; ')
  const tokenCookie = cookies.find(cookie => cookie.startsWith(`${TOKEN_COOKIE_NAME}=`))

  if (tokenCookie) {
    const [, token] = tokenCookie.split('=')
    return token
  }

  return null
}

export const removeTokenFromCookie = () => {
  const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith(`${TOKEN_COOKIE_NAME}=`));

  if (tokenCookie) {
    const [, token] = tokenCookie.split('=');
    document.cookie = `${TOKEN_COOKIE_NAME}=/`;
  }
}