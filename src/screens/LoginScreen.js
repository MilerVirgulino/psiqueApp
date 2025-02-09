import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import asyncstorage from '@react-native-async-storage/async-storage'


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("miler.virgulino@gmail.com");
  const [password, setPassword] = useState("Mortadela1");
  const [instituicao, SetInstituicao] = useState("");

  useEffect(() => {
    const clearStorage = async () => {
      await asyncstorage.clear();
    };
    clearStorage();
  }, []); // O array vazio garante que isso só roda uma vez
  

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await asyncstorage.setItem('instituicao', instituicao) // Salva a instituição no AsyncStorage
      navigation.replace("Home"); // Vai para Home e remove Login do histórico
    } catch (error) {
      Alert.alert("Erro", "Usuário ou senha incorretos!");
    }
  };

  return (
    <ImageBackground
      source={require('../images/teamplate.png')} // Caminho da imagem no projeto
      style={styles.container} // Estilos da view de fundo
    >
      <View style={styles.innerContainer}> {/* Container interno para os elementos */}
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Instituição"
          value={instituicao}
          onChangeText={SetInstituicao}
          keyboardType="text"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Entrar" onPress={handleLogin} style={styles.button} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a tela
    justifyContent: "center", // Alinha verticalmente
    alignItems: "center", // Alinha horizontalmente
  },
  innerContainer: {
    width: "100%", // Garantir que ocupe toda a largura possível
    padding: 20, // Adiciona padding
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adiciona fundo semitransparente para melhorar a legibilidade
    borderRadius: 10, // Borda arredondada
    alignItems: 'center', // Centraliza os itens horizontalmente
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'white', // Cor do texto para melhorar a visibilidade
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white', // Cor de fundo para os inputs
  },
  button:{
    width: '100%',
    backgroundColor: "#0000",
  },
});

export default LoginScreen;
