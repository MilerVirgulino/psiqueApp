import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { getFirestore, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore(app);

const ScheduleScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [responsaveis, setResponsaveis] = useState([]);
    const [responsavelSelecionado, setResponsavelSelecionado] = useState("");
    const [agendamentos, setAgendamentos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

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
                    const q1 = query(
                        agendamentosRef,
                        where("responsavel", "==", responsavelSelecionado),
                        where("data", "==", dataFormatada)
                    );
                    querySnapshot = await getDocs(q1);
                } else {
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

    const handleLongPress = (agendamento) => {
        setAgendamentoSelecionado(agendamento);
        setModalVisible(true);
    };

    const confirmarAgendamento = () => {
        console.log("Agendamento confirmado:", agendamentoSelecionado?.id);
        setModalVisible(false);
    };

    const marcarAtendido = () => {
        console.log("Agendamento marcado como atendido:", agendamentoSelecionado?.id);
        setModalVisible(false);
    };

    const cancelarAgendamento = () => {
        console.log("Agendamento cancelado:", agendamentoSelecionado?.id);
        setModalVisible(false);
    };

    const excluirAgendamento = async() => {
        const instituicao = await AsyncStorage.getItem("instituicao");
        const agendamentoRef=doc(db,"DataBases",instituicao, "agendamentos",agendamentoSelecionado.id)
        console.log("Agendamento excluído:", agendamentoSelecionado?.id);
        try{
            await deleteDoc(agendamentoRef);
            

            setModalVisible(false);
            
        }catch(error){
            console.error("Erro ao excluir agendamento:", error);
            Alert.alert("Erro ao excluir agendamento", error.message);
        }
       
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

            <View style={styles.agendamentosContainer}>
                <Text style={styles.title}>Agendamentos:</Text>
                
                {
                agendamentos.length > 0 ? (
                    agendamentos.map((agendamento) => (
                        
                        
                        
                        <TouchableOpacity
                            key={agendamento.id}
                            onLongPress={() => handleLongPress(agendamento)}
                        >
                            <View style={styles.agendamentoItem}>
                                <Text>{agendamento.paciente}</Text>
                                <Text>Responsável - {agendamento.responsavel}</Text>
                                <Text>{agendamento.horario} - {agendamento.tipo}</Text>
                                <Text> Status: {agendamento.agendamento}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
                )}
            </View>

            {/* Modal de ações */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Opções</Text>

                        <TouchableOpacity onPress={confirmarAgendamento} style={styles.modalButton}>
                            <Text>Confirmar Agendamento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={marcarAtendido} style={styles.modalButton}>
                            <Text>Marcar como Atendido</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={cancelarAgendamento} style={styles.modalButton}>
                            <Text>Marcar como Cancelado</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={excluirAgendamento} style={styles.modalButton}>
                            <Text>Excluir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButtonClose}>
                            <Text>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Estilos anteriores aqui...
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
        width: "100%",
        alignItems: "center",
    },
    modalButtonClose: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
    },
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
