window.onload = function () {
    try {
        let hostData = fetchHost()
        BACKEND_URL_BASE_S = 'https://' + hostData.host

        if (hostData.maintenance == true) {
            window.location.href = "maintenance.html"
        } else {
            isFBConnected().then(access_token => {
                if (access_token) {
                    validateUser(access_token, "99999999999")
                        .then(response => response.json())
                        .then(data => {
                            if (data.result == 'success') {
                                window.location.href = "dashboard.html";
                            }
                            else {
                                window.location.href = "login.html?message=" + data.message
                            }
                        })
                } else {
                    window.location.href = "login.html";
                }
            })
        }
    } catch (error) {
        showError(error)
    }
}

function showError(message) {
    let loginErrorText = document.getElementById("loginErrorText")
    loginErrorText.classList.remove('hidden')
    loginErrorText.innerHTML = message
}
