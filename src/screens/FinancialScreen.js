import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, getDocs, addDoc, query, where, docs } from "firebase/firestore";
import { app } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const db = getFirestore(app);

const FinancialScreen = ({ navigation }) => {
  const [selectedPacient, setSelectedPacient] = useState("todos");
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
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  

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
  
    if (!instituicao) {
      console.error("Instituição não encontrada.");
      return;
    }
  
    try {
      const pacientesRef = collection(db, "DataBases", instituicao, "agendamentos");
  
      let q;
  
      if (selectedPacient == "todos") {
        // Consulta para todos os pacientes
        q = query(
          pacientesRef,
          where("data", ">=", convertDate(dateStart)),
          where("data", "<=", convertDate(dateFinish)),
          where("agendamento", "==", "Atendido")
        );
      } else {
        // Consulta para paciente específico
        q = query(
          pacientesRef,
          where("paciente", "==", selectedPacient),
          where("data", ">=", convertDate(dateStart)),
          where("data", "<=", convertDate(dateFinish)),
          where("agendamento", "==", "Atendido")
        );
      }
    console.log(selectedPacient);
      
      // Executar a consulta
      const querySnapshot = await getDocs(q);
  
      const prontuarios = [];

      // Coletar os dados dos documentos encontrados
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        prontuarios.push({
          id: doc.id,
          name: data.paciente,
          date: data.data,
          grade: data.horario,
          responsavel: data.responsavel,
          valor: data.valor,
          tipo: data.tipo,
        });
    });
    console.log(prontuarios)
  
      // Logar os dados para verificar o que está sendo retornado
  
      // Criar a página HTML com todos os prontuários
      let htmlContent = `
      <html>
        <head>
          <style>
            @page {
              size: A4;
              margin: 1mm;
            }
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
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
              color: #2c3e50;
            }
            .sing {
              text-align: center;
              text-decoration: underline;
              color: #2c3e50;
              margin-top: 50px;
            }
            .sing-name {
              font-size: 14px;
              margin-top: 10px;
              text-align: center;
            }
              .name{
              width: 300px
              }
          </style>
        </head>
        <body>
          <h1>Relatório</h1>
          <table>
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Responsável</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  // Adicionar cada prontuário como uma linha na tabela
  prontuarios.forEach((prontuarioData) => {
    htmlContent += `
              <tr>
                <td>${prontuarioData.responsavel}</td>
                <td class="name">${prontuarioData.name}</td>
                <td>${prontuarioData.date}</td>
                <td>${prontuarioData.grade}</td>
                <td>${prontuarioData.responsavel}</td>
                <td>${prontuarioData.valor.toFixed(2)}</td>
              </tr>
    `;
  });
  
  // Fechar a tabela e a página HTML
  htmlContent += `
            </tbody>
          </table>
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

  
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const instituicao = await AsyncStorage.getItem("instituicao");
        if (!instituicao) {
          console.error("Instituição não encontrada.");
          return;
        }
  
        const pacientesRef = collection(db, "DataBases", instituicao, "agendamentos");
        const querySnapshot = await getDocs(pacientesRef);
  
        const pacientesPulled = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            name: doc.data().paciente || "Nome não definido",
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Ordenação alfabética
  
        // Filtrando duplicatas
        const pacientesSemDuplicatas = pacientesPulled.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.name === value.name
          ))
        );
  
        setPacientes(pacientesSemDuplicatas);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };
    fetchPacientes();
  }, []);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
    {/* Picker para selecionar paciente */}
    <Text style={styles.textdate}>Selecione Paciente</Text>

                <View style={styles.pacientes}>
                <Picker
          selectedValue={selectedPacient}
          onValueChange={(itemValue) => setSelectedPacient(itemValue)}
        >
          <Picker.Item label="Todos" value="todos"/>
          {pacientes.map((paciente) => (
            <Picker.Item key={paciente.id} label={paciente.name} value={paciente.name} />
          ))}
        </Picker>
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
        <Text style={styles.buttonText}>Imprimir Relatório</Text>
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

export default FinancialScreen;
