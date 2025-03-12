import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";


const db = getFirestore(app);

const PrintAnamneseScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [filteredPacientes, setFilteredPacientes] = useState([]);

    // Função para buscar pacientes no Firestore
    const fetchPacientes = async () => {
        try {
            const instituicao = await AsyncStorage.getItem("instituicao");
            if (!instituicao) {
                console.error("Instituição não encontrada.");
                return;
            }
            // Crie a referência do documento da instituição
                  const auth=getAuth();
                  const user = auth.currentUser;

            const pacientesRef = collection(db, "DataBases", instituicao, "anamneses", user.uid, "pacientes");
            const querySnapshot = await getDocs(pacientesRef);

            const pacientesPulled = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPacientes(pacientesPulled);
            setFilteredPacientes(pacientesPulled);
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error);
        }
    };

    // Atualiza a lista ao voltar para a tela
    useFocusEffect(
        useCallback(() => {
            fetchPacientes();
        }, [])
    );
    function convertDateToPicker(date) {
  if (!date) return new Date();
  const [year, month, day] = date.split("-");
  return new Date(year, month - 1, day); // Mês começa de 0 (janeiro) no JavaScript
}

    // Filtra pacientes quando a busca muda
    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        
        // Filtra os pacientes
        const filtered = pacientes
            .filter(paciente => paciente.name?.toLowerCase().includes(lowerSearch))
            .sort((a, b) => a.name.localeCompare(b.name)); // Ordena alfabeticamente
    
        setFilteredPacientes(filtered);
    }, [search, pacientes]);
    

    const handleNewPacientScreen = () => {
        navigation.navigate("NewPacients");
    };

    const handleOptionShow = async (id) => {
        await AsyncStorage.setItem("idAnamnese", id);
        navigation.navigate("EditAnamneseScreen");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 🔍 Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Pesquisar..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#888"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                        <Icon name="close-circle" size={20} color="#888" style={styles.clearIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* 📋 Lista de Pacientes Filtrada */}
            {filteredPacientes.length > 0 ? (
                filteredPacientes.map((paciente) => (
                    <TouchableOpacity key={paciente.id} onPress={() => handleOptionShow(paciente.id)} style={styles.pacienteItem}>
                        <Text style={styles.pacienteNome}>{paciente.name || "Nome Desconhecido"}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noPacientes}>Nenhum paciente encontrado</Text>
            )}

           
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
        borderRadius: 8,
        width: "90%",
        height: 40,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    clearIcon: {
        marginLeft: 8,
    },
    pacienteItem: {
        backgroundColor: "#DCDCDC",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        marginBottom: 10,
        alignItems: "center",
    },
    pacienteNome: {
        width: "100%",
        fontSize: 16,
        fontWeight: "bold",
    },
    noPacientes: {
        fontSize: 16,
        color: "#888",
        marginTop: 20,
    },
    button: {
        backgroundColor: "#333",
        paddingVertical: 12,
        borderRadius: 8,
        width: "90%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default PrintAnamneseScreen;
