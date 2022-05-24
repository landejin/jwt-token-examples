export function getRefreshToken() {
    return localStorage.getItem('refresh_token')
}

export function setRefreshToken(refreshToken) {
    return localStorage.setItem('refresh_token', refreshToken)
}

export function getAccessToken() {
    return localStorage.getItem('access_token')
}

export function setAccessToken(accessToken) {
    return localStorage.setItem('access_token', accessToken)
}