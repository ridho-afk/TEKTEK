import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';

import { View, Text ,Image,StyleSheet} from 'react-native'

import * as firebase from 'firebase'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyDAyoaiE1k7bxM8mLJb-MJ1AcH98ORFRAc",
  authDomain: "instagram-dev-cf02d.firebaseapp.com",
  projectId: "instagram-dev-cf02d",
  storageBucket: "instagram-dev-cf02d.appspot.com",
  messagingSenderId: "1058693741784",
  appId: "1:1058693741784:web:12d9ddb49a027975716bad",
  measurementId: "G-FGRHHG0SXK"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import EditProfileScreen from './components/main/EditProfile'
import FotoProfileScreen from './components/main/FotoProfile'
import ChangeScreen from './components/main/Change'
import PostingScreen from './components/main/Posting'

const Stack = createStackNavigator();

export class App extends Component {

  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center',alignItems: 'center' }}>
          <Text style={styles.logoText}>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Tektek" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="FotoProfile" component={FotoProfileScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Change" component={ChangeScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Posting" component={PostingScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  logoText:{
    color: '#FFFFFF',
    fontFamily:'Roboto',
    fontSize:30,
    marginTop:29.1,
    fontWeight:'300'
  }
})

export default App
