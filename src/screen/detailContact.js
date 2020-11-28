import React, {Component} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import GlobalStyle from "../style/globalStyle";
import * as contactActions from '../actions/contact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Overlay } from 'teaset';
import ENV from "./../../env";

class Detail extends Component {
    constructor(props) {
        super(props);        
    }             

    // api delete contact
    deleted(id){        
        let urlFetch = ENV.API_BASE_URL + `/contact/${id}`
        fetch(urlFetch,
            {
                method: 'DELETE',
            }).then((response) => response.json()).then(async (responseJson) => {
                if(responseJson.message == 'contact unavailable'){
                    this.message()
                }
                console.log(responseJson)
            }).catch((error) => {
                console.log('error')
                console.log(error)
            });
    }

    //message delete
    message(){
        let overlayView = (
            <Overlay.View
                animated={true}
                style={{ flex: 1, justifyContent: 'center' }}
                ref={v => (this.overlayPopViewRefCode = v)}
            >
                <View style={styles.alertContainer}>
                    <View style={styles.warning} >                        
                        <Text style={styles.textWarning} >something went wrong, try again later</Text>
                    </View>                    
                    <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => this.overlayPopViewRefCode.close()}
                            style={styles.buttonClose}>
                            <Text style={styles.textCancel}>Close</Text>
                        </TouchableOpacity>                        
                    </View>
                    
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }

    // warning delete
    alert(id){
        let overlayView = (
            <Overlay.View
                animated={true}
                style={{ flex: 1, justifyContent: 'center' }}
                ref={v => (this.overlayPopViewRefCode = v)}
            >
                <View style={styles.alertContainer}>
                    <View style={styles.warning} >                        
                        <Text style={styles.textWarning} >Are you sure you want to delete the contact ?</Text>
                    </View>                    
                    <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => this.overlayPopViewRefCode.close()}
                            style={styles.buttonClose}>
                            <Text style={styles.textCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {                            
                                this.deleted(id)
                                this.overlayPopViewRefCode.close()
                            }}
                            style={styles.buttonDelete}>
                            <Text style={styles.textDelete}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }

    // update redux
    editContact(item){
        const {actions} = this.props
        actions.changeItem(item)
        this.props.navigation.navigate('editContact')
    }
  
    render() {                       
        const {firstName, lastName, age, photo} = this.props.item        
        return (
            <View style={GlobalStyle.fill}>
                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                style={styles.back}                    
                                source={
                                    require("../images/back.jpeg")}
                            />
                        </TouchableOpacity>
                    </View>
                    <Image
                        style={styles.image}
                        source={
                            photo !== 'N/A' ? {uri: photo} : require("../images/person.jpg")}
                    />
                    <Text style={styles.nameText}>{`${firstName} ${lastName}`}</Text>
                    <Text style={styles.yearsText}>age {age} years</Text>
                    <View style={styles.action}>
                        <TouchableOpacity style={styles.buttonDelete}
                            onPress={() => this.alert(this.props.item)}>
                            <Text style={styles.textButton}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonEdit}
                            onPress={() => this.editContact(this.props.item)}>
                            <Text style={styles.textButton}>Edit</Text>
                        </TouchableOpacity>                    
                    </View>    
                </ScrollView>            
            </View>
        );
    }
}

const mapStateToProps = state => ({
    listContact: state.contact.listContact,
    indexList: state.contact.indexList,
    item: state.contact.item
});
  
const ActionCreators = Object.assign(
    {},
    contactActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),    
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail)

const styles = StyleSheet.create({    
    textCenter:{
        textAlign :'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: GlobalStyle.back,
    },
    positionTextCenter:{
        paddingTop: 20,        
        flexDirection: 'column'
    },
    image: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        borderRadius: 150
    },
    header:{            
        padding: 10
    },
    back: {
        width: 35,
        height: 35,
        borderRadius: 35
    },
    nameText:{        
        color: GlobalStyle.orange,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 50
    },
    yearsText:{        
        fontSize: 14,                
        paddingTop: 7,
        textAlign: 'center'
    },
    action:{
        paddingTop: 90,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonEdit:{
        backgroundColor: GlobalStyle.blue, 
        width:'35%', 
        borderRadius: 10
    },    
    buttonDelete:{
        backgroundColor: '#E60008', 
        width:'35%', 
        borderRadius: 10
    },
    textButton:{
        color: GlobalStyle.white,
        padding: 10,
        textAlign: 'center'
    },
    // alert
    alertContainer:{
        backgroundColor: 'white', 
        alignSelf: 'center', 
        margin: 10, 
        borderRadius: 10, 
        padding: 20, 
        width: '80%' 
    },
    warning:{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        width: '100%' 
    },
    textWarning:{ 
        fontFamily: GlobalStyle.fontFamily, 
        fontSize: 18, 
        color: '#E60008', 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    buttonClose:{
        backgroundColor: GlobalStyle.lightGray, 
        width:'35%', 
        borderRadius: 10
    },
    textCancel:{
        textAlign:'center' ,
        color:'white', 
        fontWeight:'bold', 
        padding: 10
    },
    buttonDelete:{
        backgroundColor: '#E60008', 
        width:'35%', 
        borderRadius: 10
    },
    textDelete:{
        textAlign:'center',
        color:'white', 
        fontWeight:'bold', 
        padding: 10
    }
});