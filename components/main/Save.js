import React, { useState } from 'react'
import { StyleSheet,View, TextInput, Image, Button,TouchableOpacity,Text } from 'react-native'

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
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
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))
    }
    return (
        <View style={{ flex: 1,justifyContent:"center" }}>
            <Image style={{flex:1}} source={{ uri: props.route.params.image }} />
            <TextInput
                style={styles.input}
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />

            <TouchableOpacity
               onPress={() => uploadImage()}>
            <Text style={styles.input2}>Save</Text>
            </TouchableOpacity>
        </View>
    )
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
        marginLeft:60,
        marginRight:60,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:106,
        paddingTop:10,
        backgroundColor:"#e0f6ff"
    },
})
