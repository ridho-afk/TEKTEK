import React, { Component } from 'react'
import { View, Button, TextInput,StyleSheet,Text,Animated,Image } from 'react-native'

import firebase from 'firebase'
import Logo from '../../assets/PacMan.png'

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            LogoAnime: new Animated.Value(0),
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    componentDidMount() {
        const {LogoAnime} = this.state;
        Animated.parallel([
            Animated.spring(LogoAnime,{
                toValue: 1,
                tension:10,
                friction:2,
                duration:1000
            }),
        ]).start();
    }
    onSignUp() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center"}}>
                <Animated.View 
                    style={{
                       opacity:this.state.LogoAnime,
                       top:this.state.LogoAnime.interpolate({
                           inputRange:[0,1],
                           outputRange:[80,1]
                       })
                    }}>
                    <Image style={{left:150,bottom:30}} source={Logo}/>
                </Animated.View>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Text
                    style={styles.input2}
                    onPress={() => this.onSignUp()}
                >Sign In</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        height: 40,
        margin: 15,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:20
    },
    input2:{
        height: 40,
        margin: 15,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:140,
        paddingTop:10,
        backgroundColor:"#82c8ff"
    },
})

export default Login
