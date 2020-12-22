import {API_URL} from '@env'

export default {
    API_URL
}

export const user = {
    username: null,
    token: null,
    darkTheme: false,
    language: "English",
    allowPushNotifications: false,
    automaticallySaveReceipts: true
};

export const setUser = (username, usertoken) => {
    user.username = username,
    user.token = usertoken
};

export const setUserPrefs = (language, allowPushNotifications, automaticallySaveReceipts) => {
    user.language = language,
    user.allowPushNotifications = allowPushNotifications,
    user.automaticallySaveReceipts = automaticallySaveReceipts
}