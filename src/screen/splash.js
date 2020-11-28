import React, {Component} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import GlobalStyle from "../style/globalStyle";

class Splash extends Component {            
  
    render() {
        return (
            <View style={GlobalStyle.fill}>                
                <View style={styles.positionTextCenter}>
                    <Image
                        style={styles.image}
                        source={
                            require("../images/person.jpg")}
                    />
                    <Text style={styles.textCenter}>Contact</Text>
                </View>
            </View>
        );
    }
}

export default Splash

const styles = StyleSheet.create({    
    textCenter:{
        textAlign :'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: GlobalStyle.back,
    },
    positionTextCenter:{
        justifyContent: 'center',
        height: '100%'
    },
    image: {
        width: 70,
        height: 70,
        alignSelf: 'center'
    },
});