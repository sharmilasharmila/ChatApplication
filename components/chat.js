import React from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView } from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat'

export default class chat extends React.Component{
    constructor(){
        super();
        this.state={
            messages:[
                {
                    _id:1,
                    text:'Hello World',
                    createdAt: new Date(),
                    user:{
                        _id:2,
                        name:'React Developer',
                        avatar:'https://i.pinimg.com/564x/9b/6b/29/9b6b2949a3ee9e1ef239798bd89ee706.jpg'
                    }
                },
                {
                    _id:2,
                    text:'This is a system Generated Message',
                    createdAt: new Date(),
                    system: true 
                }
            ]
        }
    }

    onSend(messages=[]){
        this.setState(previousState =>({
            messages: GiftedChat.append(previousState.messages, messages)
        }))
    }

    renderBubble(props){
        return(
            <Bubble
                {...props}
                wrapperStyle={{
                    right:{
                        backgroundColor:'#000'
                    }
                }}
            />
        )
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
                    user={{
                        _id:1
                    }}
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