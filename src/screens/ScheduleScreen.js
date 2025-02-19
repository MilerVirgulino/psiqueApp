import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore(app);

const ScheduleScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [responsaveis, setResponsaveis] = useState([]);
    const [responsavelSelecionado, setResponsavelSelecionado] = useState("");
    const [agendamentos, setAgendamentos] = useState([]);
    

    useEffect(() => {
        const carregarResponsaveis = async () => {
            try {
                const instituicao = await AsyncStorage.getItem("instituicao");
                if (!instituicao) {
                    console.error("Instituição não encontrada.");
                    return;
                }

                const responsaveisRef = collection(db, "DataBases", instituicao, "responsaveis");
                const querySnapshot = await getDocs(responsaveisRef);

                const listaResponsaveis = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    nome: doc.data().responsavel,
                }));

                setResponsaveis(listaResponsaveis);
            } catch (error) {
                console.error("Erro ao buscar responsáveis:", error);
            }
        };

        carregarResponsaveis();
    }, []);
    

    useEffect(() => {
        const carregarAgendamentos = async () => {
            try {
                const instituicao = await AsyncStorage.getItem("instituicao");
                if (!instituicao) {
                    console.error("Instituição não encontrada.");
                    return;
                }
    
                if (!date) return;
    
                const dataFormatada = date.toISOString().split("T")[0]; // YYYY-MM-DD
                const agendamentosRef = collection(db, "DataBases", instituicao, "agendamentos");
    
                let querySnapshot = [];
                if (responsavelSelecionado) {
                    // Buscar agendamentos filtrando por data e responsável
                    const q1 = query(
                        agendamentosRef,
                        where("responsavel", "==", responsavelSelecionado),
                        where("data", "==", dataFormatada)
                    );
                    querySnapshot = await getDocs(q1);
                } else {
                    // Buscar agendamentos filtrando apenas por data
                    const q2 = query(agendamentosRef, where("data", "==", dataFormatada));
                    querySnapshot = await getDocs(q2);
                }
    
                const listaAgendamentos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                setAgendamentos(listaAgendamentos);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            }
        };
    
        carregarAgendamentos();
    }, [responsavelSelecionado, date]);

    const showDatePicker = () => {
        setShow(true);
    };

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
        setShow(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={showDatePicker} style={styles.buttonDate}>
                <Text style={styles.dateText}>
                    {date ? date.toLocaleDateString("pt-BR") : "Selecione uma data"}
                </Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={responsavelSelecionado}
                    onValueChange={(itemValue) => setResponsavelSelecionado(itemValue)}
                >
                    <Picker.Item label="Selecione um responsável" value="" />
                    {responsaveis.map((resp) => (
                        <Picker.Item key={resp.id} label={resp.nome} value={resp.nome} />
                    ))}
                </Picker>
            </View>

            {/* 📋 Lista de agendamentos filtrados */}
            <View style={styles.agendamentosContainer}>
                <Text style={styles.title}>Agendamentos:</Text>
                {agendamentos.length > 0 ? (
                    agendamentos.map((agendamento) => (
                        <TouchableOpacity key={agendamento.id} style={styles.agendamentoItem}>
                            <Text>{agendamento.paciente}</Text>
                            <Text>Responsavel - {agendamento.responsavel}</Text>
                            <Text>{agendamento.horario} - {agendamento.tipo}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    buttonDate: {
        backgroundColor: "#F0F8FF",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    dateText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    pickerContainer: {
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 3,
    },
    agendamentosContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    agendamentoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
    },
    emptyText: {
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
});

export default ScheduleScreen;
