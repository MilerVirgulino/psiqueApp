import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "../firebaseConfig";  // Certifique-se de que está importando 'auth' corretamente
import asyncstorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";

const db = getFirestore(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("miler.virgulino@gmail.com");
  const [password, setPassword] = useState("Mortadela1");
  const [instituicao, setInstituicao] = useState("psiqueEquipe");

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const user = auth.currentUser;  // Acesso correto ao objeto 'auth' para obter o 'currentUser'
    if (user) {
      console.log("Usuário logado:", user.email);
      navigation.replace("Home");  // Redireciona para a página Home se o usuário estiver autenticado
    } else {
      console.log("Usuário não logado.");
    }
  }, [navigation]);  // O useEffect será executado na montagem do componente

  const handleLogin = async () => {
    try {
      // Busca todas as instituições no Firestore
      const instituicoesRef = collection(db, "instituicoes");
      const querySnapshot = await getDocs(instituicoesRef);

      // Converte os documentos para um array de objetos
      const instituicoes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Instituições encontradas:", instituicoes);

      // Verifica se a instituição fornecida existe
      const instituicaoExiste = instituicoes.some(inst => inst.instituicao === instituicao);

      if (!instituicaoExiste) {
        Alert.alert("Erro", "Instituição não encontrada!");
        return; // Interrompe o login
      }

      // Se a instituição existe, continua com o login
      await signInWithEmailAndPassword(auth, email, password);

      // Salva a instituição no AsyncStorage
      await asyncstorage.setItem('instituicao', instituicao);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navega para a tela Home
      navigation.replace("Home");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Usuário ou senha incorretos!");
    }
  };

  return (
    <ImageBackground
      source={require('../images/teamplate.png')}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Instituição"
          value={instituicao}
          onChangeText={setInstituicao}
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
        <Button title="Entrar" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default LoginScreen;
