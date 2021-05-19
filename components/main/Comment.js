import React, { useState, useEffect } from 'react'
import {StyleSheet, View, Text, FlatList, Button, TextInput, ScrollView ,RefreshControl} from 'react-native'
import { IconButton, Colors } from 'react-native-paper'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }


        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .orderBy('creation', 'asc');
    }

    return (
        <ScrollView >
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.Sender}>
                        {item.user !== undefined ?
                            <Text style={styles.Text1}>
                                {item.user.name} 
                            </Text>
                            : null}
                        <Text style={styles.Text2}> {item.text}</Text>
                    </View>
                )}
            />

            <View style={styles.Send}>
                <TextInput
                    multiline = {true}
                    placeholder='comment...'
                    onChangeText={(text) => setText(text)} />
                <IconButton
                    icon="send"
                    style={styles.icon}
                    color={Colors.blue400}
                    size={30}
                    onPress={() => onCommentSend()}
                /> 
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    Sender:{
        flexDirection: "row",
        margin: 10,
        
    },
    Send:{
        margin: 12,
    },
    icon:{
        left:280,
        
        bottom:20
    },
    Text1:{
        fontWeight: 'bold',
    },
    image2: {
        flex: 1/9,
        aspectRatio: 1 / 1,
        borderRadius: 60,
    },  
})


const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
