import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useState } from 'react/cjs/react.development';

export const AuthContext = React.createContext();

export const apiUrl = "http://ae5fc0a80d32.ngrok.io";

export const user = {
    username: null,
    token: null
};

export const setUser = (username, usertoken) => {
    user.username = username,
    user.token = usertoken
};