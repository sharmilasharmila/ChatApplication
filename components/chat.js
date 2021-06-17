import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class chat extends React.Component{
    constructor(){
        super();
        this.state={
            messages:[],
            user:{
                _id:'',
                name:'',
                avatar:''
            }
        }

        //Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBxZ8zWwnbOhPw_7jmkys70qo9d0RMgtWw",
            authDomain: "test-4ce0d.firebaseapp.com",
            projectId: "test-4ce0d",
            storageBucket: "test-4ce0d.appspot.com",
            messagingSenderId: "934079458127",
            appId: "1:934079458127:web:9beff2b36d4112e5d6333a",
            measurementId: "G-R72MHZCXMN"
          };

          if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
          }
          this.referenceChatMessages = firebase.firestore().collection("messages")
    }

    componentDidMount(){
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
              console.log('online');
            } else {
              console.log('offline');
            }
          });
        //Update the title
        const {name} = this.props.route.params;
        this.props.navigation.setOptions({ title: `${name}` });
        // this.referenceChatMessages = firebase.firestore().collection("messages");
        // this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

        //Authenticate in firebase
        this.getMessages();
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user)=>{
            if(!user){
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                user:{
                    _id:user.uid,
                    name:name,
                },
                messages:[]
            })
            this.unsubscribe = this.referenceChatMessages
                .where("uid","==",this.state.uid)
                .orderBy("createdAt","desc")
                .onSnapshot(this.onCollectionUpdate);
        })
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc)=>{
          var data = doc.data();
          messages.push({
            _id:data._id,
            text:data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user
          });
        })
        this.setState({messages});
    }    

    addMessages(){
        const messages = this.state.messages[0];
        firebase.firestore().collection("messages").add({
            _id: messages._id,
            text: messages.text,
            createdAt: messages.createdAt,
            user: {
                _id: messages.user._id,
                name: messages.user.name,
            },
        })
        .then()
        .catch((error) => console.log("error", error));
    }

    // onSend(messages=[]){
    //     this.setState(previousState =>({
    //         messages: GiftedChat.append(previousState.messages, messages)
    //     }),
    //     ()=>this.addMessages()
    //     )
    // }

    onSend(messages=[]){
        this.setState(previousState =>({
            messages: GiftedChat.append(previousState.messages, messages)
        }),
        ()=>this.saveMessages()
        )
    }

    renderBubble(props){
        return(
            <Bubble
                {...props}
                wrapperStyle={{right:{backgroundColor:'#000'}}}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
          return(
            <InputToolbar
            {...props}
            />
          );
        }
      }

    async getMessages(){
        let messages = '';
        try{
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch(error){
            console.log(error.message);
        }
    }

    async saveMessages(){
        try{
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        }catch(error){
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
      }

    render(){
        let name = this.props.route.params.name;
        let background = this.props.route.params.background;
        this.props.navigation.setOptions({title:name})
        return(
            <View style={{flex:1, backgroundColor:background}}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages=>this.onSend(messages)}
                    user={this.state.user}
                />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})