import React, { Component } from 'react'
/* import { Card, Icon } from 'react-native-elements' */
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native'
import { color } from 'react-native-reanimated';
import { Header } from 'react-navigation';
import { useTheme } from '@react-navigation/native';

import configColors from '../config/colors';
import styles from '../config/styles';
import colors from '../config/colors';

import { user } from '../config'
/* import PropTypes from 'prop-types' */

/* import Email from './Email'
import Separator from './Separator'
import Tel from './Tel' */

const sstyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
body: {
    flex: 0,
    flexGrow: 1,
    flexDirection: "column",
    height: '95%',
    width: '95%',
    marginTop: -30,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: '#000',
    backgroundColor: colors.background
},
bodym: {
    flex: 0,
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: colors.background,
    height: '95%',
    width: '95%',
    marginTop: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: '#000'
},
btnStyle:{
    backgroundColor: configColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1
},
buttonOnBot:{
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 25
},
container: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    backgroundColor: '#1c1c1c',
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingTop: -20,
    elevation: 3,
},
containerm: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#1db954',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingTop: 40,
    paddingBottom: 0
},

title: {
    fontSize: 20, 
    color: configColors.primary, 
    fontWeight: 'bold'
},
econtainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  emailColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  emailIcon: {
    color: 'gray',
    fontSize: 30,
  },
  emailNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emailNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  emailRow: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  tcontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  smsIcon: {
    color: 'darkgray',
    fontSize: 30,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: '#cecece',
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scontainer: {
    flexDirection: 'row',
  },
  separatorOffset: {
    flex: 2,
    flexDirection: 'row',
  },
  separator: {
    borderColor: '#EDEDED',
    borderWidth: 0.8,
    flex: 1000,
    flexDirection: 'row',
  },
})

class ProfileScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: user.username,
            email: 'Evaldas.Grublys@gmail.com', // TO DO
            theme: false
        }
    }
/*   static propTypes = {
    avatar: PropTypes.string.isRequired,
    avatarBackground: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.shape({
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
    emails: PropTypes.arrayOf(
      PropTypes.shape({
        email: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    tels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      })
    ).isRequired,
  } */

  renderHeader = () => {
      <View style={sstyles.headerContainer}>
        <ImageBackground
          style={sstyles.headerBackgroundImage}
          blurRadius={0}
          source={require('../assets/stadia.png')}
        >
          <View style={sstyles.headerColumn}>
            <Image
              style={sstyles.userImage}
              source={require('../assets/stadia.png')}
            />
            <Text style={sstyles.userNameText}>{this.state.name}</Text>
            <View style={sstyles.userAddressRow}>
              <View>
                <Image
                  style={sstyles.placeIcon}
                  source={require('../assets/stadia.png')}
                  onPress={() => {}}
                />
              </View>
              <View style={sstyles.userCityRow}>
                <Text style={sstyles.userCityText}>
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
  }

  renderUser = () => (
    <View>
        <View style={{alignSelf:'center'}}>
            <Image
                style={sstyles.userImage}
                source={require('../assets/favicon.png')}
                onPress={() => {}}
            />
        </View>
        <View style={sstyles.scontainer}>
                    <View style={sstyles.separatorOffset} />
                    <View style={sstyles.separator} />
                </View>
        <Text style={{fontSize: 20, color: '#fff'}}>Username: {this.state.name}</Text>
    </View>
  )

  renderEmail = () => (
    <TouchableOpacity onPress={() => {}}>
        <View style={[sstyles.econtainer]}>
        <View style={sstyles.iconRow}>
        <Image
                  style={sstyles.placeIcon}
                  source={require('../assets/favicon.png')}
                  onPress={() => {}}
                />
        </View>
        <View style={sstyles.emailRow}>
            <View style={sstyles.emailColumn}>
            <Text style={sstyles.emailText}>{this.state.name}</Text>
            </View>
            <View style={sstyles.emailNameColumn}>
            {this.state.email.length !== 0 && (
                <Text style={sstyles.emailNameText}>{this.state.email}</Text>
            )}
            </View>
        </View>
        </View>
    </TouchableOpacity>
  )

  render() {
    return (
        <View style={sstyles.containerm}>
            <View style={sstyles.bodym}>
                
                {this.renderUser()}
                {this.renderEmail()}
                <Button title="Change password" color="#000"/>
            </View>
        </View>
    )
  }
}

export default ProfileScreen