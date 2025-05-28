function fetchHost() {
    return {
        "host": "65.21.228.155",
        "port": "3000",
        "maintenance": false
    }
}

function validateUser(access_token, profile_id) {
    return fetch(BACKEND_URL_BASE_S + '/login/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token,
            'profile_id': profile_id
        })
    })
}

function fetchAnnouncement() {
    return fetch(BACKEND_URL_BASE_S + '/login/announcement', {
        method: 'GET',
        cache: 'no-cache'
    })
}

function accessNetflix(access_token) {
    return fetch(BACKEND_URL_BASE_S + '/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token
        })
    })
}

function pairAndroid(access_token) {
    return fetch(BACKEND_URL_BASE_S + '/mobile/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            'access_token': access_token
        })
    })
}
