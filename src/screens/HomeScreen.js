import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [instituicao, setInstituicao] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // Adicionado para evitar múltiplas execuções

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        setUser(user);
        const storedInstituicao = await AsyncStorage.getItem("instituicao");
        if (storedInstituicao) {
          setInstituicao(storedInstituicao);
        }
      } else {
        if (navigation.isFocused() && checkingAuth) { 
          
          setCheckingAuth(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigation, checkingAuth]); // Dependência adicionada

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    navigation.replace("Login");
  };


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.linha1}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Calendar")}>
          <Image source={require("../images/svg/calendar-svgrepo-com.png")} style={styles.image} />
          <Text>Calendário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pacients")}>
          <Image source={require("../images/svg/documents-svgrepo-com.png")} style={styles.image} />
          <Text>Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AnamneseScreen")}>
          <Image source={require("../images/svg/doctor-svgrepo-com.png")} style={styles.image} />
          <Text>Anamneses</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.linha2}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RecordsScreen")}>
          <Image source={require("../images/svg/record-svgrepo-com.png")} style={styles.image} />
          <Text>Prontuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FinancialScreen")}>
          <Image source={require("../images/svg/money-bag-svgrepo-com.png")} style={styles.image} />
          <Text>Financeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Image source={require("../images/svg/logout-2-svgrepo-com.png")} style={styles.image} />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", padding: 10 },
  linha1: { flex: 1, flexDirection: "column", justifyContent: "space-evenly", padding: 10 },
  linha2: { flex: 1, flexDirection: "column", justifyContent: "space-evenly", padding: 10 },
  button: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 60, height: 60, margin: 10, aspectRatio: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HomeScreen;
