export const getToken = () => {
  const rawAuthentication = localStorage.getItem('authentication')
  if (!rawAuthentication) return undefined

  try {
    const data = JSON.parse(rawAuthentication)
    return data.token
  } catch (error) {
    return undefined
  }
}
