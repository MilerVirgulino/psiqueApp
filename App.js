import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text,Image,StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen'; 
import LoginScreen from './src/screens/LoginScreen'; 
import CalendarScreen from './src/screens/CalendarScreen'; 
import SchaduleScreen from './src/screens/ScheduleScreen';
import DoScheduleScreen from './src/screens/DoSchaduleScreen';
import PacientsScreen from './src/screens/PacientsScreen';
import NewPacientsScreen from './src/screens/NewPacientScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: 'Início',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={({ navigation }) => ({
            title: 'Calendário',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Schadule" 
          component={SchaduleScreen} 
          options={({ navigation }) => ({
            title: 'Schadule',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="DoSchadule" 
          component={DoScheduleScreen} 
          options={({ navigation }) => ({
            title: 'DoSchadule',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Pacients" 
          component={PacientsScreen} 
          options={({ navigation }) => ({
            title: 'Pacients',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="NewPacients" 
          component={NewPacientsScreen} 
          options={({ navigation }) => ({
            title: 'NewPacients',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({

     image: {
    width: '30%', // Cada imagem ocupará 1/3 da largura da tela
    height: 30, // Define a altura das imagens
    margin: 10, // Adiciona um espaçamento entre as imagens
    aspectRatio: 1, // Garante que as imagens sejam quadradas
    },
});