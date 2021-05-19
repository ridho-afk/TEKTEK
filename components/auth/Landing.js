import React from 'react'
import {AppRegistry, StyleSheet,Text, View, Button } from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

export default function Landing({ navigation }) {
    return (
        <View>
            <View style={{ flex: 1, justifyContent: "center",marginTop:250,alignItems: 'center' }}>
            <IconButton
            icon="pac-man"
            color={Colors.lightBlueA700}
            size={50}
            />
            </View>
            <View style={{ flex: 1,flexDirection:"row", justifyContent: "center",marginTop:80 }}>
            <IconButton
            icon="plus"
            color={Colors.red700}
            size={50}
            onPress={() => navigation.navigate("Register")}
            />
            <IconButton
            icon="login"
            color={Colors.lightGreenA700}
            size={50}
            onPress={() => navigation.navigate("Login")}
            />        
        </View>
        <View style={{flexDirection:"row", flex: 1,justifyContent: "center",alignItems: 'center',top:80 }}>
                <Text style={{right:25}}>
                    Register
                </Text>
                <Text style={{left:20}}>
                    Login
                </Text>
            </View>
        </View>
    )
}

