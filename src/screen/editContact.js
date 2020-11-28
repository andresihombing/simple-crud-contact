import React, {Component} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native'
import GlobalStyle from "../style/globalStyle";
import Input from "../components/input";
import ENV from "./../../env";
import { connect } from 'react-redux';
import * as contactActions from '../actions/contact';
import { bindActionCreators } from 'redux';
import { Spinner} from "native-base";
import ImagePicker from 'react-native-image-picker';

class EditContact extends Component {  
    constructor(props){
        super(props);                
        this.state ={
            firstname: this.props.item.firstName,
            firstnameError: '',
            lastname: this.props.item.lastName,
            lastnameError: '',
            age: this.props.item.age,
            ageError: '',
            photo: this.props.item.photo,
            photoError: ''
        }
    }

    //validasi form
    validateData() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (!this.state.firstname) {
            this.setState({ firstnameError: "Please insert your first name !" });
            return false
        } else if(this.state.firstname.length < 3){
            this.setState({ firstnameError: "First name length must be at least 3 characters long !" });
            return false
        } else if(!this.state.lastname) {
            this.setState({ lastnameError: "Please insert your last name !" });
            return false
        } else if(this.state.lastname.length < 3){
            this.setState({ lastnameError: "Last name length must be at least 3 characters long !" });
            return false
        } else if(!this.state.age) {
            this.setState({ ageError: "Please insert your age !" });
            return false
        } else if(this.state.age > 100) {
            this.setState({ ageError: "Age must be less than or equal to 100 !" });
            return false
        } else if(this.state.age == 0) {
            this.setState({ ageError: "Age cannot be 0 !" });
            return false
        } else if(!this.state.photo) {
            this.setState({ photoError: "Please insert your photo !" });
            return false
        } else {
            return true
        }
    }

    //api update contact
    submitEdit() {    
        const {listContact , indexList, actions} = this.props    
        if (this.validateData()) {            
            this.setState({ isSpinner: true });
            let urlFetch = ENV.API_BASE_URL + `/contact/${this.props.item.id}`
            fetch(urlFetch,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',                        
                    },
                    body: JSON.stringify({
                        'firstName' : this.state.firstname,
                        'lastName' : this.state.lastname,
                        'age' : this.state.age,
                        'photo' : this.state.photo
                    })
                }).then((response) => response.json()).then(async (responseJson) => {                    
                    const listContact = [...this.props.listContact]
                    listContact[indexList] = responseJson.data                    
                    actions.changeContact(listContact);
                    this.props.navigation.navigate('listContact')
                }).catch((error) => {
                    this.setState({ isSpinner: true })
                    console.log(error)
                });
        }
    }

    //choose photo
    choosePhoto = () => {
        var options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {            
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                if(response.width > 1432){                    
                    this.setState({photoError: 'Photo resolution too large !'})
                }else{
                    this.setState({
                        photo: `data:${response.type};base64,${response.data}`,
                        photoError: ''
                    });
                }                      
            }
        });
    };
    
    render() {                
        return (
            <View style={GlobalStyle.fill}>
                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                style={styles.image}                    
                                source={
                                    require("../images/back.jpeg")}
                            />
                        </TouchableOpacity>
                    </View>                    
                    <TouchableOpacity onPress={() => this.choosePhoto()}>
                        <Image
                            style={styles.photo}
                            source={
                                this.state.photo !== 'N/A' ? {uri: this.state.photo} : require("../images/person.jpg")}
                        />
                        <Image
                            style={styles.addPhoto}                    
                            source={
                                require("../images/add-photo.jpg")}
                        />
                    </TouchableOpacity>
                    <Text style={styles.photoError}>{this.state.photoError}</Text>
                    <View style={styles.input}>
                        <Input
                            value={this.state.firstname}
                            errorName={this.state.firstnameError}
                            width={"100%"}
                            label={"First Name"}
                            color={'gray'}
                            autoCapitalize={"none"}
                            keyboardType={"default"}
                            onChangeText={text => {
                                this.setState({ firstname: text, firstnameError: "" });
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                );
                            }}
                        />
                        <View style={styles.space}/>
                        <Input
                            value={this.state.lastname}
                            errorName={this.state.lastnameError}
                            width={"100%"}
                            label={"Last Name"}
                            color={'gray'}
                            autoCapitalize={"none"}
                            keyboardType={"default"}
                            onChangeText={text => {
                                this.setState({ lastname: text, lastnameError: "" });
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                );
                            }}
                        />
                        <View style={styles.space}/>
                        <Input
                            value={String(this.state.age)}
                            errorName={this.state.ageError}
                            width={"100%"}
                            label={"Age"}
                            color={'gray'}
                            autoCapitalize={"none"}
                            keyboardType={"numeric"}
                            onChangeText={text => {
                                this.setState({ age: text, ageError: "" });
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                );
                            }}
                        />                        
                        <TouchableOpacity style={styles.buttonSave} onPress={() => this.submitEdit()}>
                            <Text style={styles.textButton}>
                            {this.state.isSpinner == true ? (
                                <Spinner
                                    color={"white"}
                                    size="small"
                                    style={styles.spinner}
                                />
                                ) : 'Save'
                            }
                            </Text>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(EditContact)

const styles = StyleSheet.create({    
    header:{        
        padding: 10
    },
    title:{
        fontSize: 18,
        padding: 10,
        fontWeight: 'bold',        
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 35
    },
    input:{
        padding: 10,        
    },
    space:{
        height: 10
    },
    buttonSave:{
        backgroundColor: GlobalStyle.orange,
        marginTop: 40,
        borderRadius: 10
    },
    textButton:{
        color: GlobalStyle.white,
        padding: 10,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },
    //spinner
    spinner:{ 
        alignSelf: "center", 
        height: 20 
    },

    //photo
    photo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderRadius: 150
    },
    addPhoto: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        borderRadius: 150,
        marginLeft: 60,
        top: -25
    },
    photoError: {
        textAlign: 'center',
        fontSize: 11,
        color: GlobalStyle.red,
        top: -15
    }
});
