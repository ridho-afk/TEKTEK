import React, { useState } from 'react'
import {StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity,Image } from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }
    return (
        <View style={{flex:1}}>
            <TextInput
                style={styles.input}
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)} />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text style={styles.Textt}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
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
    Textt:{
        left: 20,
        fontWeight: 'bold',
        fontSize: 16,
        margin : 5
        
    }
})
