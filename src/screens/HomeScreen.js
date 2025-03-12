import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [instituicao, setInstituicao] = useState(null);

  useEffect( () => {
    const unsubscribe = onAuthStateChanged(auth,  async(user) => {
      setUser(user);
      const instituicao= await AsyncStorage.getItem('instituicao');
      setInstituicao(instituicao);
      setLoading(false);
      if (!user) {
        navigation.replace("Login"); // Redireciona para login se não estiver autenticado
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  const handleCalendar = () => {
    navigation.navigate("Calendar");
  };

  const handlePacients = async () => {
    
    navigation.navigate("Pacients");
  };
  const handleAnamnese = () => {
    navigation.navigate("AnamneseScreen");
  };
  const handleRecords = () => {
    navigation.navigate("RecordsScreen");
  };



  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;

  return (
    <View style={styles.container}>
      <View style={styles.linha1}>

      <TouchableOpacity style={styles.button} onPress={handleCalendar}>
        <Image source={require("../images/svg/calendar-svgrepo-com.png")} style={styles.image}/>
        <Text>Calendário</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePacients}>
        <Image source={require("../images/svg/documents-svgrepo-com.png")}style={styles.image} />
        <Text>Pacientes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAnamnese}>
        <Image source={require("../images/svg/doctor-svgrepo-com.png")}style={styles.image} />
        <Text>Anamneses</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.linha2}>
      <TouchableOpacity style={styles.button} onPress={handleRecords}>
        <Image source={require("../images/svg/record-svgrepo-com.png")}style={styles.image} />
        <Text>Prontuários</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Image source={require("../images/svg/money-bag-svgrepo-com.png")}style={styles.image} />
        <Text>Financeiro</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Image source={require("../images/svg/logout-2-svgrepo-com.png")}style={styles.image} />
        <Text>Logout</Text>
      </TouchableOpacity>
      </View>

    </View>
    
    
  );
};

const styles = StyleSheet.create({
  linha1:{
    flex: 1,
    flexDirection: 'column', // Itens dispostos em linha
    justifyContent: 'space-evenly', // Distribui os itens de forma igual
     // Alinha os itens verticalmente no centro
    padding: 10, // Adiciona padding ao redor da tela
     },
     linha2:{
    flex: 1,
    flexDirection: 'column', // Itens dispostos em linha
    justifyContent: 'space-evenly', // Distribui os itens de forma igual
     // Alinha os itens verticalmente no centro
    padding: 10, // Adiciona padding ao redor da tela
     },
  
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1,
    flex: 1,
    flexDirection: 'row', // Itens dispostos em linha
    // Permite que os itens quebrem para a próxima linha
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HomeScreen;
