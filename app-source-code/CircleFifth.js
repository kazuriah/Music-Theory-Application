/** * Sample React Native App * https://github.com/facebook/react-native */
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, } from 'react-native'; 
import VectorWidget from './VectorWidget'; 

var CircleOFifths = React.createClass({
     render: function () { 
         return (
             <View style={styles.container}>        
                <VectorWidget style={styles.vector} />      
             </View>
            ); 
        } 
}); 
    
var styles = StyleSheet.create(
    { 
        container: { flex: 1, alignItems: 'center', backgroundColor: '#FFF', }, 
        vector: { width: 100, height: 100 }, 
        welcome: { fontSize: 20, textAlign: 'center', margin: 10, }, 
        instructions: { color: '#333333', marginBottom: 5, marginTop: 100 }, 
    }); 

export default CircleOFifths;