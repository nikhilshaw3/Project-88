import React,{Component} from 'react';
import {View,Text,Dimensions,Icon} from 'react-native';
import SwipeListView from 'react-native-swipe-list-view'

export default class SwipeableList extends Component{
constructor(props){
super(props)

this.state={
allNotifications: this.props.allNotifications,
}

}

renderItem = data=>{

<ListItem
leftElement = {<Icon name="book" type="font-awesome" color='#696969'/>}
title = {data.item.book_name}
titleStyle = {{color: 'black' , fontWeight: 'bold'}}
subTitle ={data.item.message}

bottomDivider
/>

}

renderHiddenItem=()=>{

<View style = {styles.rowBack}>
<View style = {[styles.backRightBtn,styles.backRightBtnRight]}>

<Text style={styles.backTextWhite}></Text>

</View>
</View>
}

updateMarkAsRead=Notification=>{

db.collection("all_notifications")
.doc(Notification.doc_id)
.update({
Notification_status: "read"

})
}

onSwipeValueChange=swipeData=>{
var allNotifications = this.state.allNotifications;

const {key,value}=swipeData

if(value < -Dimensions.get("window").width){

const newData = [...allNotifications]
this.updateMarkAsRead(allNotifications[key])
newData.splice(key,1)
this.setState({
allNotifications: newData

})}}

render(){
return(

<View style={styles.container}>

<SwipeListView 
disableRightSwipe
data ={this.state.allNotifications}
renderItem={this.renderItem}
renderHiddenItem={this.renderHiddenItem}
rightOpenValue={-Dimensions.get('window').width}
previewRowKey={'0'}
previewOpenValue={-40}
previewOpenDelay={300}
openSwipeValueChange={this.onSwipeValueChange}
/>

</View>
)}}