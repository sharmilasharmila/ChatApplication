import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Image, requireNativeComponent } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component{
    constructor(){
        super();
        State={

        }
    }

    pickImage = async()=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status==='granted'){
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images'
          }).catch(error=>console.log(error));
          if (!result.cancelled){
            this.setState({
              image: result
            })
          }
        }
    }

    uploadImageFetch = async(uri)=>{
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function(e) {
              console.log(e);
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        const imageNameBefore = uri.split('/');
        const imageName = imageNameBefore[imageNameBefore.length - 1];
        
        const ref = firebase.storage().ref().child(`${imageName}`);
        const snapshot = await ref.put(blob);

        blob.close();
        return await snapshot.ref.getDownloadURL();
    }
    
    takePhoto = async()=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status==='granted'){
        let result = await ImagePicker.launchCameraAsync({
        mediaTypes : 'Images'
        }).catch(error=>console.log(error));
        if(!result.cancelled){
        this.setState({
            image: result
        })
        }
    }
    }

    getLocation = async()=>{
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    if(status==='granted'){
        let result = await Location.getCurrentPositionAsync({});
        if(result){
        this.setState({
            location: result
        });
        }
    }
    }

    onActionPress = ()=>{
        const options=['Choose from the Library', 'Take Photo', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length-1
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) =>{
                switch(buttonIndex){
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        return;
                    case 2:
                        console.log('user wants to get their location');
                    default:
                }
            }
        )
    }

    render(){
        return(
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                <View style={[this.styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[this.styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
      },
      wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
      },
      iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
})

CustomActions.contextType={
    actionSheet:PropTypes.func
}