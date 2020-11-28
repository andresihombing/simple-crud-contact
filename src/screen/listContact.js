import React, {Component} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, LayoutAnimation, RefreshControl } from 'react-native'
import GlobalStyle from "../style/globalStyle";
import ENV from "./../../env";
import * as contactActions from '../actions/contact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ListContact extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            isSpinner: true,            
            isRefresh: false,            
        }
    }

    componentDidMount(){
        this.getList()
    }

    refreshControl = () => {
        this.setState({ isRefresh: true, isSpinner: true }, () =>
            this.getList()
        );
    };

    // api get list contact
    getList(){
        this.setState({isRefresh: true})
        let { actions } = this.props;
        let urlFetch = ENV.API_BASE_URL + `/contact`
        fetch(urlFetch,
            {
                method: 'GET',                
            }).then((response) => response.json()).then(async (responseJson) => {
                actions.changeContact(responseJson.data);
                this.setState({ isSpinner: false, isRefresh: false });
            }).catch((error) => {                
                console.log(error)
                this.setState({ isSpinner: false, isRefresh: false });
            });
    }

    // update data
    updateData() {
        this.getList()
    }

    // detail contact
    detailContact(item, index){
        const {actions} = this.props
        actions.changeItem(item)
        actions.changeIndexList(index)
        this.props.navigation.navigate('detailContact')
    }    

    // view list contact
    renderListCard(item, index){        
        return(
            <View style={styles.listView}>
                <TouchableOpacity style={styles.listContact} onPress={() => this.detailContact(item, index)}>
                    <Image
                        style={styles.image}                    
                        source={
                            item.photo !== 'N/A' ? {uri: item.photo} : require("../images/person.jpg")}
                    />
                    <View style={styles.text}>
                        <Text style={styles.nameText}>{item.firstName} {item.lastName}</Text>
                        <Text style={styles.yearsText}>age {item.age} years</Text>
                    </View>
                </TouchableOpacity>                
            </View>
        )
    }

    // view empty contact
    ListEmptyComponent() {
        return (
            <View style={styles.empty} >
                <Text style={styles.textEmpty}>Empty Contact</Text>
            </View>
        )
    }
  
    render() {        
        return (
            <View style={GlobalStyle.fill}>                
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Contact</Text>
                </View>                
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefresh}
                                onRefresh={this.refreshControl}
                            />
                        }
                        data={this.props.listContact}                    
                        renderItem={({ item, index }) => this.renderListCard(item, index)}
                        ListEmptyComponent={() => this.ListEmptyComponent()}                          
                    />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('addContact',{
                        updateData: () => this.updateData()                        
                    })} style={styles.add}>
                        <Image
                            style={styles.image}                    
                            source={
                                require("../images/add.png")}
                        />
                    </TouchableOpacity>                
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
  
export default connect(mapStateToProps, mapDispatchToProps)(ListContact)

const styles = StyleSheet.create({       
    //headers
    header:{
        backgroundColor: GlobalStyle.orange,        
    },
    textHeader:{
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
        color: GlobalStyle.white
    },
    // view empty
    empty:{
        padding: 50
    },
    textEmpty:{
        textAlign: 'center',
        fontSize: 20,
        color: GlobalStyle.lightGray
    },
    textCenter:{
        textAlign :'center',
        fontSize: 40,        
    },
    // view list
    listView:{
        borderBottomColor: GlobalStyle.black,
        borderBottomWidth: 0.5
    },
    listContact:{
        padding: 10,
        flexDirection: 'row',        
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 60
    },
    text:{
        flexDirection: 'column'
    },
    nameText:{
        color: GlobalStyle.orange,
        fontSize: 17,
        fontWeight: 'bold',
        paddingLeft: 20
    },
    yearsText:{
        color: GlobalStyle.lightGray,
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 7
    },    
    add:{
        top: '85%',
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 10
    },
    
    
});