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
import EditPacientScreen from './src/screens/EditPacientScreen';
import AnamneseScreen from './src/screens/AnamneseScreen';
import NewAnamneseScreen from './src/screens/NewAnamneseScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import NewRecordsScreen from './src/screens/NewRecordsScreen';
import PrintAnamneseScreen from './src/screens/PrintAnamneseScreen';
import EditAnamneseScreen from './src/screens/EditAnamneseScree';
import PrintRecordScreen from './src/screens/PrintRecorScreen';
import EditRecordsScreen from './src/screens/EditRecordScreen';
import PrintOneRecordScreen from './src/screens/PrintOneRecordScreen';
import PrintingRecordsScreen from './src/screens/PrintingRecordsScreen';

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
            title: 'Agendamentos',
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
            title: 'Agendar',
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
            title: 'Pacientes',
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
            title: 'Novo Paciente',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="EditPacients" 
          component={EditPacientScreen} 
          options={({ navigation }) => ({
            title: 'Editar Paciente',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="AnamneseScreen" 
          component={AnamneseScreen}  
          options={({ navigation }) => ({
            title: 'Anamneses',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="NewAnamneseScreen" 
          component={NewAnamneseScreen}  
          options={({ navigation }) => ({
            title: 'Nova Anamnese',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="RecordsScreen"  
          component={RecordsScreen}  
          options={({ navigation }) => ({
            title: 'Prontuários',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="NewRecordsScreen"  
          component={NewRecordsScreen}  
          options={({ navigation }) => ({
            title: 'Novo protunário',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="PrintAnamneseScreen"   
          component={PrintAnamneseScreen}  
          options={({ navigation }) => ({
            title: 'Anamnese',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="EditAnamneseScreen"   
          component={EditAnamneseScreen}  
          options={({ navigation }) => ({
            title: 'Anamnese',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="PrintRecordScreen"   
          component={PrintRecordScreen}  
          options={({ navigation }) => ({
            title: 'Prontuários',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="EditRecordScreen"   
          component={EditRecordsScreen}  
          options={({ navigation }) => ({
            title: 'Prontuários',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="PrintOneRecordScreen"   
          component={PrintOneRecordScreen}  
          options={({ navigation }) => ({
            title: 'Imprimir Prontuários',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
              <Image source={require("./src/images/svg/arrow-back-svgrepo-com.png")} style={styles.image}/>              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="PrintingRecordsScreen"   
          component={PrintingRecordsScreen}  
          options={({ navigation }) => ({
            title: 'Imprimir Prontuários',
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