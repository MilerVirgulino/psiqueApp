import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";


const SimpleCalendar = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState('');
  

 const handleShowSchadule=() => {
    navigation.navigate("Schadule");
 }
 const handleDoShowSchadule=() => {
    navigation.navigate("DoSchadule");
 }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString); // Atualiza a data selecionada
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.touchButton} onPress={handleDoShowSchadule}>
        <Image source={require("../images/svg/calendar-svgrepo-com (1).png")} style={styles.image} />
        
            <Text style={styles.text}>Novo Agendamento</Text>
        
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton} onPress={handleShowSchadule}>
        <Image source={require("../images/svg/calendar-search-svgrepo-com.png")} style={styles.image}/>
        
            <Text style={styles.text}>Ver Agendamentos</Text>
        
        </TouchableOpacity>
        <View style={styles.calendar}>
        <Text style={styles.text}>Selecione a data</Text>
      <Calendar
        onDayPress={onDayPress} // Captura a data selecionada
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' }, // Marca a data selecionada
        }}
      />
        </View>
        
     
    </View>
  );
};

const styles = StyleSheet.create({
    calendar: {
    display: 'none',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:'100%',
  },
  text: {
    textAlign: 'center',
    padding: 10,
    fontSize: 18,
  },
  image: {
    width: '30%', // Cada imagem ocupará 1/3 da largura da tela
    height: 30, // Define a altura das imagens
    margin: 10, // Adiciona um espaçamento entre as imagens
    aspectRatio: 1, // Garante que as imagens sejam quadradas
    },
    touchButton:{
    textAlign: 'center',
    margin: 10, 
    padding: 1,         // Adiciona um espaçamento entre o botão e as bordas
    borderWidth: 1,         // Largura da borda
    borderColor: 'black',    // Cor da borda
    borderRadius: 10,       // Bordas arredondadas
    borderStyle: 'solid',   // Estilo da borda (pode ser 'dashed', 'dotted' etc.)   
    alignSelf:'baseline',
    alignItems: 'center',
    width:'40%',
       
        
        
    }
});

export default SimpleCalendar;
