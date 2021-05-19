import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button,TouchableOpacity } from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props,navigation) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)
    const [loading,setLoading] = useState(true)

    if (loading) {
        setLoading(false);
      }

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

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

        props.navigation.addListener("focus",() => setLoading(!loading))

    }, [props.route.params.uid, props.following,props.navigation,loading])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.increment(1)
            })
        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followers: firebase.firestore.FieldValue.increment(1)
            })
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.increment(-1)
            })
        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followers: firebase.firestore.FieldValue.increment(-1)
            })
    }

    if (user === null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}> 
                <Image
                    style={styles.fotoprofil}
                    source={{ uri: user.downloadURL}} 
                />
                <View style={{flexDirection:"row"}}>
                <Text style={styles.follow3}>{user.followers} </Text>
                <Text style={styles.follow2}>{user.following}</Text>
                </View>
                <Text style={styles.follow}>Followers       Following </Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                                <TouchableOpacity
                                    onPress={() => onUnfollow()}>
                                    <Text style={styles.followw}>Following</Text>
                                 </TouchableOpacity>
                        ) :
                            (
                                <TouchableOpacity
                                     onPress={() => onFollow()}>
                                    <Text style={styles.followww}>Follow</Text>
                                 </TouchableOpacity>
                            )}
                    </View>
                ) :
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("EditProfile", {uid: firebase.auth().currentUser.uid})}>
                            <Text style={styles.input2}>Edit Profile</Text>
                            </TouchableOpacity> 
                }
            </View>

            <View style={styles.containerGallery}>
                <View style={{flexDirection:"row"}}>
                <IconButton
                icon="pac-man"
                color={Colors.grey400}
                size={40}
                style={styles.IconButton1}
                />
                <IconButton
                icon="fullscreen"
                color={Colors.grey400}
                size={40}
                style={styles.IconButton2}
                onPress={() => props.navigation.navigate("Posting", {uid: props.route.params.uid})}
                />
                </View>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
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
        flex: 1 / 0.9,
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3,
        flexDirection:"row"

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    fotoprofil: {
        flex: 1,
        aspectRatio: 1/ 1,
        borderRadius: 60     
    },
    follow:{
        left:140,
        bottom:80,
        fontWeight: 'bold',
        fontSize:16
    },
    follow2:{
        left:250,
        bottom:80,
        fontWeight: 'bold',
        fontSize:18
    },
    follow3:{
        left:170,
        bottom:80,
        fontWeight: 'bold',
        fontSize:18
    },
    name:{
        fontWeight: 'bold',
        bottom:30,
        fontSize:16,
        left:10
    },
    bio:{
        bottom:30,
        fontSize:16,
        left:10
    },
    input2:{
        height: 40,
        margin: 15,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:114,
        paddingTop:10,
        backgroundColor:"#99ceff"
    },
    followw:{
        height: 40,
        margin: 15,
        marginLeft:20,
        marginRight:20,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:112,
        paddingTop:10,
        backgroundColor:"black",
        color: "white",
        borderColor:"grey"
    },
    followww:{
        height: 40,
        margin: 15,
        marginLeft:20,
        marginRight:20,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft:120,
        paddingTop:10,
        backgroundColor:"white"
    },
    IconButton1:{
        bottom:15,
        left:50
    },
    IconButton2:{
        bottom:15,
        left:170
    }
    
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile);
