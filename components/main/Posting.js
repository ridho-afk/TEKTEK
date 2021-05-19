import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button,TouchableOpacity } from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Posting(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { currentUser, posts } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }
    }, [props.route.params.uid])

    if (user === null) {
        return <View />
    }

    return (
        <View>
            <View>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <View style={{flexDirection:"row"}}>
                            <Image
                                style={styles.image2}
                                source={{ uri: user.downloadURL }}
                            />
                            <Text style={styles.Text10}>{user.name}</Text>
                            </View>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <Text style={styles.Text4}>{item.likesCount} Like </Text>
                            <View style={styles.Captions}>
                            <Text style={styles.Text1}>{user.name}</Text>
                            <Text style={styles.Text2}> {item.caption}</Text>
                            </View>
                            <Text style={styles.Text3}
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: firebase.auth().currentUser.uid })}>
                                Lihat Komentar
                            </Text>
                        </View>

                    )}

                />
                </View> 
        </View>

    )

}

const styles = StyleSheet.create({
    containerImage: {
        flex:1
    },
    image: {
        aspectRatio: 1 / 1,
    },
    image2: {
        flex: 1/9,
        aspectRatio: 1 / 1,
        borderRadius: 60,
        marginTop:10,
        marginBottom:10,
        left:5
    },
    Text10:{
        fontWeight: 'bold',
        fontSize: 16,
        left:12,
        marginTop:17,
    },
    Text1: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    Text2: {
        fontSize: 16, 
    },
    Text3: {
        left: 15,
        fontSize: 16,
        color: 'grey',
       
    },
    Text4: {
        fontSize: 16, 
        left: 15,
        fontWeight: 'bold', 
    },
    Captions:{
        flexDirection: "row",
        left: 15,
        right: 20,
    },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
})
export default connect(mapStateToProps, null)(Posting);
