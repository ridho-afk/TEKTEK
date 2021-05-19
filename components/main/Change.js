import React, { useState } from 'react'
import { StyleSheet,View, TextInput, Image, Button,TouchableOpacity,Text } from 'react-native'

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Change(props) {

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `user/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {

        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                downloadURL:downloadURL,
            }).then((function () {
                props.navigation.popToTop()
            }))
    }
    return (
        <View style={{ flex: 1,justifyContent:"center" }}>
            <Image style={{flex:1/1.8}} source={{ uri: props.route.params.image }} />
            <TouchableOpacity
               onPress={() => uploadImage()}>
            <Text style={styles.input}>Save</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
input:{
    height: 40,
    margin: 15,
    marginLeft:80,
    marginRight:80,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft:80,
    paddingTop:10,
    backgroundColor:"#e0f6ff"
},
})
