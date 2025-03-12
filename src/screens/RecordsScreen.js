
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";

const RecordsScreen = ({navigation})=>{
    const handleNewRecord = () => {
        navigation.navigate("NewRecordsScreen");
    }
    return(
        <View style={styles.menu}>
            
            <TouchableOpacity style={styles.button} onPress={handleNewRecord} >
                    <Image style={styles.image} source={require("../images/svg/plus-user-svgrepo-com.png")}/>
                    <Text>Novo prontuário</Text>
                  </TouchableOpacity>
            <TouchableOpacity style={styles.button} >
                    <Image style={styles.image} source={require("../images/svg/person-svgrepo-com.png")}/>
                    <Text>Prontuários</Text>
                  </TouchableOpacity>
        </View>
    )
}

export default RecordsScreen;

const styles = StyleSheet.create({
    menu: {
    flexDirection: 'row', // Itens dispostos em linha
    justifyContent: 'space-evenly', // Distribui os itens de forma igual
    alignItems: 'center', // Alinha os itens verticalmente no centro
    padding: 10, // Adiciona padding ao redor da tela
    },
    image: {
    width: '30%', // Cada imagem ocupará 1/3 da largura da tela
    height: 60, // Define a altura das imagens
    margin: 10, // Adiciona um espaçamento entre as imagens
    aspectRatio: 1, // Garante que as imagens sejam quadradas
    },

    button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    
 
})