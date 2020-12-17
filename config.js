import {API_URL} from '@env'

export default {
    API_URL
}

export const user = {
    username: null,
    token: null,
    darkTheme: false,
    gender: "",
    language: "English",
    allowPushNotifications: false,
    automaticallySaveReceipts: true
};

export const setUser = (username, usertoken) => {
    user.username = username,
    user.token = usertoken
};

export const setUserPrefs = (gender, language, allowPushNotifications, automaticallySaveReceipts) => {
    user.gender = gender,
    user.language = language,
    user.allowPushNotifications = allowPushNotifications,
    user.automaticallySaveReceipts = automaticallySaveReceipts
}