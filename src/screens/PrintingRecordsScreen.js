import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { app } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const db = getFirestore(app);

const PrintingRecordsScreen = ({ navigation }) => {
  const [selectedPacient, setSelectedPacient] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [tipos, setTipos] = useState([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState("");
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false); // Estado para o DateTimePicker de Início
  const [showDatePickerFinish, setShowDatePickerFinish] = useState(false); // Estado para o DateTimePicker de Fim
  const [dateStart, setDateStart] = useState(null);
  const [dateFinish, setDateFinish] = useState(null);
  const [valor, setValor] = useState("");
  const [paciente, setPaciente] = useState(""); // estado para armazenar o nome do paciente

  const onChangeDateStart = (event, selectedDateStart) => {
    if (selectedDateStart) {
      setDateStart(selectedDateStart); // Para data de início
    }
    setShowDatePickerStart(false); // Fecha o DateTimePicker de início
  };

  const onChangeDateFinish = (event, selectedDateFinish) => {
    if (selectedDateFinish) {
      setDateFinish(selectedDateFinish); // Para data de Fim
    }
    setShowDatePickerFinish(false); // Fecha o DateTimePicker de fim
  };

  function convertDate(date) {
    if(!date) return;

    return date.toISOString().split('T')[0];
  }

  const handleSubmit = async () => {
    const instituicao = await AsyncStorage.getItem("instituicao");
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!instituicao) {
      console.error("Instituição não encontrada.");
      return;
    }
    if(!instituicao || !user || !dateStart || !dateFinish || !paciente || !selectedResponsavel){

      return Alert.alert("Todos os campos são obrigatórios!");
    } 
  
    try {
      const pacientesRef = collection(db, "DataBases", instituicao, "prontuarios", user.uid, "pacientes");
  
      // Criando a consulta para pegar todos os prontuários
      const q = query(pacientesRef, where("name", "==", paciente), where("date", ">=", convertDate(dateStart)), where("date", "<=", convertDate(dateFinish)));
  
      const querySnapshot = await getDocs(q);
      let prontuarios = [];
  
      querySnapshot.forEach((doc) => {
        const prontuarioData = doc.data();
        prontuarios.push(prontuarioData);
      });
  
      // Ordenar os prontuários por data (supondo que o campo "date" seja uma string no formato "YYYY-MM-DD")
      prontuarios.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Criar a página HTML com todos os prontuários
      let htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
              }
              h1 {
                text-align: center;
                text-decoration: underline;
                color: #2c3e50;
              }
              .prontuario {
                margin-bottom: 20px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 20px;
              }
              .prontuario h2 {
                font-size: 18px;
                color: #34495e;
              }
              .prontuario p {
                font-size: 14px;
                margin: 5px 0;
              }
                .sing {
                  text-align: center;
                  text-decoration: underline;
                  color: #2c3e50;
                  margin-top: 100px;
                }
                  .sing-name {
                  font-size: 14px;
                  margin-top: 10px;
                  text-align: center;
                }
                  .content {
                  margin-top: 5px;
                  margin-bottom: 10px;
                }
            </style>
          </head>
          <body>
            <h1>Prontuários</h1>
      `;
  
      // Adicionar cada prontuário à página HTML
      prontuarios.forEach((prontuarioData) => {
        htmlContent += `
          <div class="prontuario">
            <h2>Paciente: ${prontuarioData.name} - ${formatDate(prontuarioData.date)}</h2>
            <p><strong>Intervenção:</strong> </p>
            <div class="content">${prontuarioData.intervention} </div>
            <p><strong>Evolução:</strong></p>
            <div class="content">${prontuarioData.evolution} </div>
            <p><strong>Observações Adicionais:</strong></p>
            <div class="content">${prontuarioData.adcionalObs} </div>
            <p><strong>Relatório do Paciente:</strong></p>
            <div class="content">${prontuarioData.pacientReporter} </div>
          </div>
        `;
      });
  
      // Fechar a tag HTML
      htmlContent += `
      <div class="sing">______________________________________________________</div>
      <div class="sing-name">${selectedResponsavel}</div>
          </body>
        </html>
      `;
  
      // Gerar o arquivo ou visualização
      try {
        const file = await printToFileAsync({
          html: htmlContent,
          base64: false,
          fileName: `Todos_Prontuarios_${new Date().toISOString()}.html`,
        });
  
        await shareAsync(file.uri); // Compartilhar ou salvar o arquivo gerado
      } catch (error) {
        console.error("Erro ao gerar o arquivo:", error);
      }
    } catch (error) {
      console.error("Erro ao buscar prontuário:", error);
      Alert.alert("Não foi possível buscar os prontuários");
    }
  };

  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  }

  const getPaciente = async () => {
    try {
      const pacienteName = await AsyncStorage.getItem("pacienteName");
      if (pacienteName) {
        setPaciente(pacienteName); // Atualiza o estado do paciente
      }
    } catch (error) {
      console.error("Erro ao buscar o nome do paciente:", error);
    }
  };


  useEffect(() => {
    const fetchResponsaveis = async () => {
      try {
        const instituicao = await AsyncStorage.getItem("instituicao");
        if (!instituicao) {
          console.error("Instituição não encontrada.");
          return;
        }

        const responsavelRef = collection(db, "DataBases", instituicao, "responsaveis");
        const querySnapshot = await getDocs(responsavelRef);

        const responsaveisPulled = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          responsavel: doc.data().responsavel || "Responsável não definido",
        }));

        setResponsaveis(responsaveisPulled);
      } catch (error) {
        console.error("Erro ao buscar responsáveis:", error);
      }
    };

    fetchResponsaveis();
    getPaciente(); // Chama a função para buscar o nome do paciente
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pacientContent}>
        <Text style={styles.pacient}>Paciente:</Text>
        <Text style={styles.pacient}>{paciente || "Nome não encontrado"}</Text>
      </View>

      <Text style={styles.textdate}>Selecione uma data de início</Text>

      <TouchableOpacity onPress={() => setShowDatePickerStart(true)} style={styles.ButtonDate}>
        <Text style={styles.dateText}>
          {dateStart ? dateStart.toLocaleDateString("pt-BR") : "Data Início"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.textdate}>Selecione uma data de fim</Text>

      <TouchableOpacity onPress={() => setShowDatePickerFinish(true)} style={styles.ButtonDate}>
        <Text style={styles.dateText}>
          {dateFinish ? dateFinish.toLocaleDateString("pt-BR") : "Data Fim"}
        </Text>
      </TouchableOpacity>

      {showDatePickerStart && (
        <DateTimePicker
          value={dateStart || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDateStart}
        />
      )}

      {showDatePickerFinish && (
        <DateTimePicker
          value={dateFinish || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDateFinish}
        />
      )}

      <Text style={styles.textdate}>Selecione um Responsável</Text>
      
      <View style={styles.pacientes}>
        <Picker selectedValue={selectedResponsavel} onValueChange={(itemValue) => setSelectedResponsavel(itemValue)}>
          <Picker.Item label="Responsável" value="" />
          {responsaveis.map((resp) => (
            <Picker.Item key={resp.id} label={resp.responsavel} value={resp.responsavel} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Imprimir prontuário</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
    },
    pacientes: {
      borderWidth: 1,
      margin: 4,
      height: 50,
      justifyContent: "center",
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: "#f5f5f5",
      padding: 10,
      margin: 4,
      height: 40,
      textAlign: "center",
    },
    ButtonDate: {
      borderWidth: 2,
      margin: 4,
      padding: 5,
      height: 50,
      justifyContent: "center",
    },
    textdate: {
      color: "#333",
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      marginTop: 10,
      alignSelf: "center",
    },
    valorContainer: {
      marginTop: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    Button: {
      borderWidth: 2,
      margin: 4,
      padding: 10,
      height: 50,
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      marginTop: 45,
    },
    pacient:{
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 1,
      marginTop: 10,
      alignSelf: "center",
    },
    pacientContent:{
      borderWidth: 2,
      margin: 4,
      padding: 5,
      
    }
  });

export default PrintingRecordsScreen;
