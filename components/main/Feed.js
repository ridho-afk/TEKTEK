import React, { useState, useEffect,Component} from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button} from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    
    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        console.log(posts)
    }, [props.usersFollowingLoaded, props.feed]);

    const onLikePress = async (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(1)
            })
            firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = async (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(-1)
            })
            firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <View style={{flexDirection:"row"}}>
                            <Image
                                style={styles.image2}
                                source={{ uri: item.user.downloadURL }}
                            />
                            <Text style={styles.Text10}>{item.user.name}</Text>
                            </View>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <View style={styles.Icons}>
                            { item.currentUserLike ?
                                (
                                    <IconButton
                                    icon="heart"
                                    color={Colors.red500}
                                    size={30}
                                    onPress={() => onDislikePress(item.user.uid, item.id)}
                                    /> 
                                )
                                :
                                (
                                    <IconButton
                                    icon="heart"
                                    color={Colors.grey400}
                                    size={30}
                                    onPress={() => onLikePress(item.user.uid, item.id)}
                                    /> 
                                        
                                )
                            }
                            <IconButton
                                    icon="comment"
                                    color={Colors.grey400}
                                    size={30}
                                    onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}
                                    /> 
                                    </View>
                            <Text style={styles.Text4}>{item.likesCount} Like </Text>
                            <View style={styles.Captions}>
                            <Text style={styles.Text1}>{item.user.name}</Text>
                            <Text style={styles.Text2}> {item.caption}</Text>
                            </View>
                            <Text style={styles.Text3}
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                Lihat Semua Komentar
                                </Text>
                            <Text>{"\n"}</Text>       
                        </View>

                    )}
                />
            </View>
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3,
        borderWidth: 1,
        borderColor: "grey",
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    Icons: {
        flexDirection: "row",
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
    image2: {
        flex: 1/9,
        aspectRatio: 1 / 1,
        borderRadius: 60,
        marginTop:10,
        marginBottom:10,
        left:5
    },
    Text10: {
        fontWeight: 'bold',
        fontSize: 16,
        left:12,
        marginTop:15,
    },
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);
