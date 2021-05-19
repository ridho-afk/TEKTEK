import React, { useState, useEffect } from 'react'
import {StyleSheet, View, Text, FlatList, Button, TextInput,TouchableOpacity } from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function EditProfile(props) {
    const [user, setUser] = useState(null);
    const [namee, setName] = useState("")
    const [bioo, setBio] = useState("")

    useEffect(() => {
        const { currentUser } = props;
        setUser(currentUser)
        
    })

    const onProfileSave = () => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                name:namee,
                bio:bioo
            }).then(response =>{
                console.log('Response')
            })
            .then((function () {
                props.navigation.popToTop()
            }))
        }

    const onLogout = () => {
        firebase.auth().signOut();
    }
    if (user === null) {
        return <View />
    }

    return (
        <View style={{ flex: 1,justifyContent:"center" }}>
            <TouchableOpacity
                onPress={() => props.navigation.navigate("FotoProfile")}>
            <Text style={styles.input2}>Ganti Gambar</Text>
            </TouchableOpacity>   
            <TextInput
                style={styles.input}
                placeholder="Name..."
                onChangeText={(namee) => setName(namee)}
            />
            <TextInput
                style={styles.input}
                placeholder="Bio..."
                onChangeText={(bioo) => setBio(bioo)}
            />

            <TouchableOpacity
               onPress={() => onProfileSave()}>
            <Text style={styles.input3}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => onLogout()}>
            <Text style={styles.input4}>Logout</Text>
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
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:125,
        paddingTop:10,
        backgroundColor:"#e0f6ff"
    },
    input3:{
        height: 40,
        margin: 15,
        marginLeft:80,
        marginRight:80,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:87,
        paddingTop:10,
        backgroundColor:"#e0f6ff"
    },
    input4:{
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
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})
export default connect(mapStateToProps, null)(EditProfile);
