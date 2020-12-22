import React, {useEffect} from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ToastAndroid
} from "react-native";
import { color } from "react-native-reanimated";
import { Header } from "react-navigation";
import { useTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import configColors from "../config/colors";
import styles from "../config/styles";
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker,
  SettingsTextLabel,
  SettingsButton,
} from "react-native-settings-components";
import { useState } from "react";
import config, { user, setUserPrefs } from "../config";

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  const [username, setUsername] = useState(user.username);
  const [allowPushNotifications, setAllowPushNotifications] = useState(false);
  const [automaticallySaveReceipts, setAutomaticallySaveReceipts] = useState(
    false
  );
  const [language, setLanguage] = useState("English");
  const [renderAbout, setRenderAbout] = useState(false);
  const [renderReport, setRenderReport] = useState(false);
  const[reportText, setReportText] = useState("");



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        setRenderAbout(false)
        setRenderReport(false)
        
    });

    return unsubscribe;
}, [navigation]);


  const _onSendReportPress = () =>{
    // send report to api to store in the db
    setRenderReport(false);
    if (Platform.OS === 'android') {
      ToastAndroid.show("Thank you, report sent!", ToastAndroid.SHORT)
  } else {
      Alert.alert("Thank you, report sent!");
  }
  }

  if (renderAbout) {
    return (
      <View style={styles().containerm}>
        <View>
          <Text style={styles().title}>About</Text>
        </View>
        <View style={[styles().bodym, { alignItems: "center" }]}>
          <Text
            style={{
              fontSize: 24,
              color: theme.dark ? "white" : "black",
              marginTop: 30,
            }}
          >
            Comparison Shopping Engine
          </Text>
          <Text
            style={{
              margin: 10,
              marginTop: 30,
              textAlign: "center",
              color: theme.dark ? colors.white : colors.dark,
            }}
          >
            CSE lets you scan receipts and instantly see products prices
            compared to other shops. You can create your own shopping lists and
            see your favorite product prices in each shop. App also presents
            graphs that show your spendings. You won't believe how much you can
            save by using it!
            {"\n\n\n"}© 2020, Pirmas Pogrupis
          </Text>
          <View style={lstyles.buttonOnBot}>
            <TouchableOpacity
              style={{ width: "95%" }}
              onPress={() => {
                setRenderAbout(false);
              }}
            >
              <View style={lstyles.btnStyle}>
                <Text style={{ color: "white" }}>Go back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } 
  if(renderReport){
    return(
    <View style={styles().containerm}>
        <View>
          <Text style={styles().title}>Report</Text>
        </View>
        <View style={[styles().bodym, { alignItems: "center" }]}>
          <Text
            style={{
              fontSize: 20,
              color: theme.dark ? "white" : "black",
              textAlign:'center',
              margin: 20,
              marginTop: 30,
            }}
          >
            Please write a detailed report about discovered problem in the app
          </Text>
          <View style={[lstyles.textAreaContainer, {width:'95%'}]}>
            <TextInput multiline={true} 
            placeholder="Type here"
            numberOfLines={16}
            onChangeText={(text) => setReportText({text})}
            value={reportText} 
            style={{backgroundColor: theme.dark ? theme.colors.background: colors.white, textAlignVertical:'top', color: theme.dark ? colors.white : colors.dark}}
            
            />
          </View>

          <View style={lstyles.buttonOnBot}>
            <TouchableOpacity
              style={{ width: "95%" }}
              onPress={() => {
                setRenderReport(false);
              }}
            >
              <View style={lstyles.btnStyle1}>
                <Text style={{ color: "white" }}>Go back</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[lstyles.button, {marginTop:20}]}>
            <TouchableOpacity
              style={{ width: "95%" }}
              onPress={() => _onSendReportPress()}
            >
              <View style={lstyles.btnStyle}>
                <Text style={{ color: "white" }}>Send</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  
  else {
    return (
      <View style={styles().containerm}>
        <View>
          <Text style={styles().title}>Settings</Text>
        </View>
        <View style={styles().bodym}>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: theme.dark
                ? theme.colors.background
                : colors.white,
            }}
          >
            <SettingsCategoryHeader
              title={username}
              titleStyle={{
                color: theme.dark ? colors.white : colors.dark,
                fontWeight: "bold",
              }}
              containerStyle={{
                backgroundColor: theme.dark
                  ? theme.colors.background
                  : colors.lightGrey,
                padding: 10,
              }}
            />
            <SettingsDividerLong dividerStyle={{height:10}} />

            <View View style={{ flexDirection: "row" }}>
              <View style={lstyles.iconView}>
                <FontAwesome
                  name="language"
                  size={30}
                  color={theme.dark ? colors.white : colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingsPicker
                  title="Language"
                  titleStyle={{
                    color: theme.dark ? colors.white : colors.dark,
                  }}
                  dialogDescription={"Choose your prefered language."}
                  options={[
                    { label: "English", value: "English" },
                    { label: "Lithuanian", value: "Lithuanian" },
                  ]}
                  onValueChange={(value) => {
                    setLanguage(value);
                    setUserPrefs(value, allowPushNotifications, automaticallySaveReceipts);
                  }}
                  value={language}
                  containerStyle={{
                    backgroundColor: theme.dark
                      ? theme.colors.background
                      : colors.white,
                  }}
                />
              </View>
            </View>

            <SettingsDividerLong />

            <View View style={{ flexDirection: "row" }}>
              <View style={lstyles.iconView}>
                <Ionicons
                  name="ios-notifications"
                  size={30}
                  color={theme.dark ? colors.white : colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingsSwitch
                  title={"Allow Push Notifications"}
                  titleStyle={{
                    color: theme.dark ? colors.white : colors.dark,
                  }}
                  onValueChange={(value) => {
                    setAllowPushNotifications(value);
                    setUserPrefs(language, value, automaticallySaveReceipts);
                  }}
                  value={allowPushNotifications}
                  trackColor={{
                    true: colors.switchEnabled,
                    false: colors.switchDisabled,
                  }}
                  containerStyle={{
                    backgroundColor: theme.dark
                      ? theme.colors.background
                      : colors.white,
                  }}
                />
              </View>
            </View>

            <SettingsDividerLong />

            <View View style={{ flexDirection: "row" }}>
              <View style={lstyles.iconView}>
                <FontAwesome
                  name="save"
                  size={25}
                  color={theme.dark ? colors.white : colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingsSwitch
                  title={"Automatically save receipts"}
                  titleStyle={{
                    color: theme.dark ? colors.white : colors.dark,
                  }}
                  onValueChange={(value) => {
                    setAutomaticallySaveReceipts(value);
                    setUserPrefs(language, allowPushNotifications, value);
                  }}
                  value={automaticallySaveReceipts}
                  trackColor={{
                    true: colors.switchEnabled,
                    false: colors.switchDisabled,
                  }}
                  containerStyle={{
                    backgroundColor: theme.dark
                      ? theme.colors.background
                      : colors.white,
                  }}
                />
              </View>
            </View>

            <SettingsDividerLong />

            <View View style={{ flexDirection: "row" }}>
              <View style={lstyles.iconView}>
                <FontAwesome
                  name="exclamation-circle"
                  size={25}
                  color={theme.dark ? colors.white : colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingsButton
                  containerStyle={{
                    backgroundColor: theme.dark
                      ? theme.colors.background
                      : colors.white,
                  }}
                  titleStyle={{
                    color: theme.dark ? colors.white : colors.dark,
                  }}
                  title={"Report a problem"}
                  onPress={() => {
                    setRenderReport(true);
                  }}
                />
              </View>
            </View>
            <SettingsDividerLong />

            <View View style={{ flexDirection: "row" }}>
              <View style={lstyles.iconView}>
                <FontAwesome
                  name="info"
                  size={25}
                  color={theme.dark ? colors.white : colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingsButton
                  containerStyle={{
                    backgroundColor: theme.dark
                      ? theme.colors.background
                      : colors.white,
                  }}
                  titleStyle={{
                    color: theme.dark ? colors.white : colors.dark,
                  }}
                  title={"About"}
                  onPress={() => {
                    setRenderAbout(true);
                  }}
                />
              </View>
            </View>
            <SettingsDividerLong />
          </ScrollView>
          <View style={lstyles.buttonOnBot}>
            <TouchableOpacity
              style={{ width: "95%" }}
              onPress={() => {
                navigation.navigate('Home');
              }}
            >
              <View style={lstyles.btnStyle}>
                <Text style={{ color: "white" }}>Go Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const lstyles = StyleSheet.create({
  iconView: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnStyle: {
    backgroundColor: "#1db954",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  btnStyle1: {
    backgroundColor: "darkgreen",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonOnBot: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button:{
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textAreaContainer: {
    borderColor: "#e8edea",
    borderWidth: 5,
    padding: 5,
    borderRadius: 15
  },
});

const colors = {
  white: "#FFFFFF",
  lightGrey: "#e8edea",
  switchEnabled: "#C70039",
  switchDisabled: "#efeff3",
  dark: "#1c1c1c",
};

export default SettingsScreen;
