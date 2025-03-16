import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, Alert, StyleSheet, 
  ImageBackground, ActivityIndicator 
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, app } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, getDocs, collection } from "firebase/firestore";

const db = getFirestore(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("miler.virgulino@gmail.com");
  const [password, setPassword] = useState("Mortadela1");
  const [instituicao, setInstituicao] = useState("psiqueEquipe");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const savedUser = await AsyncStorage.getItem("userEmail");
        const savedInstituicao = await AsyncStorage.getItem("instituicao");
        const savedPassword = await AsyncStorage.getItem("userPassword");

        if (savedUser && savedInstituicao && savedPassword) {
          console.log("Usuário já autenticado:", savedUser);

          // Login automático utilizando os dados salvos no AsyncStorage
          await signInWithEmailAndPassword(auth, savedUser, savedPassword);
          navigation.replace("Home");
        }
      } catch (error) {
        console.error("Erro ao verificar login automático:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Verificar se a instituição existe no Firestore
      const instituicoesRef = collection(db, "instituicoes");
      const querySnapshot = await getDocs(instituicoesRef);
      const instituicoes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const instituicaoExiste = instituicoes.some(inst => inst.instituicao === instituicao);
      if (!instituicaoExiste) {
        Alert.alert("Erro", "Instituição não encontrada!");
        setLoading(false);
        return;
      }

      // Realizar o login com o e-mail e senha fornecidos
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Salvar dados no AsyncStorage
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", password);
      await AsyncStorage.setItem("instituicao", instituicao);

      console.log("Login bem-sucedido:", userCredential.user.email);
      navigation.replace("Home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Usuário ou senha incorretos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../images/teamplate.png')} style={styles.container}>
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
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Entrar" onPress={handleLogin} />
        )}
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
