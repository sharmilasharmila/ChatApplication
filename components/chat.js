import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
import firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class chat extends React.Component{
    constructor(){
        super();
        this.state={
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: '',
            },
            isConnected: false,
            image: null,
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

    componentDidMount() {    
        const { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: `${name}` });
        //Find out connection status
        NetInfo.fetch().then(connection => {
          if (connection.isConnected) {
            this.setState({ isConnected: true });
            console.log('online');
            // Authenticates user via Firebase
            this.authUnsubscribe = firebase.auth()
            .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png',
              },
              messages: [],
            });
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
            }); 
          } else {
              console.log('offline');
              this.setState({ isConnected: false});
              this.getMessages();
            }
        });
      }  
    
    componentWillUnmount(){
        this.unsubscribe();
        this.authUnsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
          // get the QueryDocumentSnapshot's data
          let data = doc.data();
          messages.push({
            _id: data._id,
            text: data.text || null,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar,
            },
            image: data.image || null,
            location: data.location || null,
          }); //console.log(data.text);3
        });
        this.setState({
          messages,
        });
    }

    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
          _id: message._id,
          uid: this.state.uid,
          createdAt: message.createdAt,
          text: message.text || null,
          user: message.user,
          image: message.image || null,
          location: message.location || null,
        });
      }

    onSend(messages = []) {
    this.setState(
        previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
        }),
        () => {
        this.addMessage();
        this.saveMessages();
        },);
    }

    

    async getMessages() {
    let messages = '';
    try {
        messages = (await AsyncStorage.getItem('messages')) || [];
        this.setState({
        messages: JSON.parse(messages)
        });  
    } catch (error) {
        console.log(error.message);
    }
    };

    async saveMessages() {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));      
        } catch (error) {
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

    renderCustomActions = props => <CustomActions {...props} />

    renderCustomView = props => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView style={{width: 150,height: 100,borderRadius: 13,margin: 3}}
                    region=
                    {{
                        latitude: Number(currentMessage.location.latitude),
                        longitude: Number(currentMessage.location.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            );
        }
        return null;
    }

    render(){
        let name = this.props.route.params.name;
        let background = this.props.route.params.background;
        this.props.navigation.setOptions({title:name})
        return(
            <View style={[styles.container, { backgroundColor: background }]}>
                <GiftedChat
                    renderBubble={this.renderBubble }
                    renderInputToolbar={this.renderInputToolbar}
                    renderUsernameOnMessage={true}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
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