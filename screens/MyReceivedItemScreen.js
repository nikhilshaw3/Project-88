import React,{Component} from 'react';
import {View,StyleSheet,Text,Flatlist,TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class MyReceivedItemScreen extends Component{
constructor(){
super()
this.state={
userId: firebase.auth().currentUser.email,
receiverExchangeList: []
}
this.requestRef= null
}

getReceiverExchangeList =()=>{

this.requestRef = db.collection("requests")
.where("user_id","==",this.state.userId)
.where("Exchange_status","==",'received')
.onSnapShot((snapshot)=>{

var receivedItemsList = snapshot.doc.map((doc)=>doc.data())

this.setState({
receivedItemsList: receivedItemsList
})
})
}

componentDidMount(){
this.getReceiverExchangeList();
}

componentWillUnmount(){
this.requestRef();
}

keyExtractor = (item,index) => index.toString()

renderItem = ({item,i}) => {
console.log(item.item_name);
return(
<ListItem
key={i}
title={item.item_name}
subtitle={item.itemStatus}
titleStyle={{color: 'black',fontWeight: 'bold'}}
bottomDivider
/>
)
}

render(){
return(
<View style={{flex:1}}>
<MyHeader title="Received Books" navigation={this.props.navigation}/>
<View style={{flex:1}}>
{
this.state.receiverExchangeList.length === 0
?(
<View style={style.subContainer}>
<Text style={{fontSize: 20}}>List of all Received books</Text>
</View>
)
:(
    <Flatlist
    keyExtractor={this.keyExtractor}
    data={this.state.receiverExchangeList}
    renderItem={this.renderItem}
    />
)
}
</View>
</View>
)
}
}

const styles = StyleSheet.create({
    button:{
        width:"50%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        borderColor: 'black',
        backgroundColor:'orange',
        shadowColor: "#000",
    },
        subContainer:{
        flex:1,
        fontSize:20,
        justifyContent: 'center',
        alignItems: 'center'      
        }
})