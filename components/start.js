import React from "react";
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class start extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            background: ''
        };
    }

    onPressChat = (name, backgroundColor) => {
        if(name == '') {
          return Alert.alert('Name Field is Empty');
        }
        this.props.navigation.navigate('Chat', {
          name: `${name}`,
          backgroundColor: `${backgroundColor}`,
        });
      };

    render(){
        return(
            <View style={styles.container}>
                <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.image}>
                    {/* Title */}
                    <Text style={styles.head}>Chat Application</Text>
                    <View style={styles.centerbox}>
                        {/* Text input */}
                        <TextInput 
                            style={styles.name}
                            onChangeText = {(name)=> this.setState({name})}
                            value={this.state.name}
                            placeholder='Enter your Name Here'
                        />
                        <Text style={styles.backgroundChoose}>Choose Background Color:</Text>
                        <View style={{flexDirection:'row', height:'40%'}}>
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor:'#090C08'}]}
                                onPress={(background)=>this.setState({background:'#090C08'})}
                            />
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor:'#474056'}]}
                                onPress={(background)=>this.setState({background:'#474056'})}
                            />
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor:'#8A95A5'}]}
                                onPress={(background)=>this.setState({background:'#8A95A5'})}
                            />
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor:'#B9C6AE'}]}
                                onPress={(background)=>this.setState({background:'#B9C6AE'})}
                            />
                        </View>
                    </View>
                    <View style={{width:'88%', height:'20%', position:'relative'}}>
                        <Button
                            color='#757083'
                            title="Enter the Chat"
                            onPress={() => this.onPressChat(this.state.name, this.state.backgroundColor)}
                        />
                    </View>
                </ImageBackground>
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column' 
    },
    button:{
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor:'black',
        margin: 10
    },
    centerbox:{
        height:'30%',
        flexDirection:'column',
        backgroundColor:'white',
        width: '88%',
        position: 'relative'
    },
    head:{
        height:'40%',
        textAlign:'center',
        fontWeight:"600",
        fontSize:45,
        color:'#FFFFFF'
    },
    name:{
        textAlign:'center',
        fontSize:25,
        fontWeight:"300",
        height: '30%'
    },
    backgroundChoose:{
        marginLeft:10,
        fontSize:20,
        fontWeight:"300",
        color:'#757083',
        marginTop: 10
    },
    image: {
        width:'100%',
        height:'100%',
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        resizeMode: "cover",
        justifyContent: 'center',
        alignItems: 'center'
    }
})