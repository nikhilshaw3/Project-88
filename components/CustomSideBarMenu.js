import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar, Icon } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';

import db from '../config';

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component {

  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      docID: '',
    }
  }

  fetchImage = (imageName) => {
    var ref = firebase.storage().ref().child("user_profiles/" + imageName);
    ref.getDownloadURL().then(url => {
      this.setState({
        image: url,
      })
    })
      .catch(error => {
        this.setState({
          image: "#"
        })
      })
  }

  getUserProfile = () => {
    db.collection('user').where("User_Name", "==", this.state.userID)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            name: doc.data().First_Name + ' ' + doc.data().Last_Name,
          })
        })
      })
  }

  componentDidMount() {
    this.fetchImage(this.state.userID);
    this.getUserProfile();
  }

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child("user_profiles/" + imageName);
    return (
      ref.put(blob).then((response) => {
        this.fetchImage(imageName)
      })
    );
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!cancelled) {
      this.setState({
        image: uri,
      })
      this.uploadImage(uri, this.state.userID)
    }

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5, alignItems: 'center', backgroundColor: 'orange' }} >
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size={150}
            showEditButton
            containerStyle={{ marginTop: 20 }}
            onPress={() => {
              this.selectPicture()
            }}
          />
          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10, }} >{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
            }}>
            <Text style={styles.logOutText} >Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerItemsContainer: {
    flex: 0.8
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30
  },
  logOutButton: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5'
  },
  logOutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f65c5c'
  }
})