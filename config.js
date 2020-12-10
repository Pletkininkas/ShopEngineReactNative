import {API_URL} from '@env'

export default {
    API_URL
}

export const user = {
    username: null,
    token: null,
    darkTheme: false
};

export const setUser = (username, usertoken) => {
    user.username = username,
    user.token = usertoken
};