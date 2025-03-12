import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, collection, addDoc, doc, Timestamp, getDocs, getDoc,updateDoc } from "firebase/firestore"; // Importando o Timestamp
import { app, auth } from "../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { getAuth } from "firebase/auth";


const db = getFirestore(app); // 🔹 Definição do Firestore fora do componente

const EditRecordsScreen = ({ navigation }) => {


  const [selectedPacient, setSelectedPacient] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [instituicao, setInstituicao] = useState(null); // Estado para armazenar a instituição
  const [pacientReporter, setPacientReporter] = useState("");
  const [intervention, setIntervention] = useState("");
  const [evolution, setEvolution] = useState("");
  const [adcionalObs, setAdtionalObs] = useState("");

  console.log(selectedPacient)



  

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const instituicao = await AsyncStorage.getItem("instituicao");
        if (!instituicao) {
          console.error("Instituição não encontrada.");
          return;
        }
    
        const pacientesRef = collection(db, "DataBases", instituicao, "pacientes");
        const querySnapshot = await getDocs(pacientesRef);
    
        const pacientesPulled = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Nome não definido",
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Ordenação alfabética
    
        setPacientes(pacientesPulled);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);


  useEffect(() => {
    const loadInstituicao = async () => {
      try {
        const inst = await AsyncStorage.getItem("instituicao");
        if (inst) {
          setInstituicao(inst);
        } else {
          console.log("Nenhuma instituição encontrada.");
        }
      } catch (error) {
        console.error("Erro ao carregar instituição:", error);
      }
    };

    loadInstituicao();
  }, []);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      
      
    }
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  function convertDate(date) {

    return date.toISOString().split('T')[0]
  }

  
  useEffect(() => {
    const loadDocmentFirebase = async () => {
      const idPacienteEdit = await AsyncStorage.getItem("idRecord");
      const instituicao = await AsyncStorage.getItem("instituicao");
       const auth=getAuth();
        const user = auth.currentUser;
  
      if (!idPacienteEdit || !instituicao) {
        console.error("ID do paciente ou instituição não encontrados.");
        return;
      }
  
      try {
        const pacienteRef = doc(db, "DataBases", instituicao, "prontuarios", user.uid, "pacientes", idPacienteEdit);
        const docSnap = await getDoc(pacienteRef);
        console.log(docSnap.data())
        console.log(selectedPacient)
        
  
        if (docSnap.exists()) {
          const pacienteData = docSnap.data();
          setSelectedPacient(pacienteData.name);  // Preenchendo os campos do formulário  
          setDate(convertDateToPicker(pacienteData.date)); 
          setPacientReporter(pacienteData.pacientReporter);
          setIntervention(pacienteData.intervention)
          setEvolution(pacienteData.evolution)
          setAdtionalObs(pacienteData.adcionalObs)
        } else {
          console.log("Paciente não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do paciente:", error);
      }
    };
  
    loadDocmentFirebase();
  }, []);

  function convertDateToPicker(date) {
    if (!date) return new Date();
    const [year, month, day] = date.split("-");
    return new Date(year, month - 1, day); // Mês começa de 0 (janeiro) no JavaScript
  }


  const handleSubmit = async () => {
    if (!instituicao) {
      Alert.alert("Erro", "Nenhuma instituição encontrada. Verifique seu login.");
      return;
    }

    const dados = {
        name: selectedPacient,
        date: convertDate(date),
        pacientReporter,
        intervention,
        evolution,
        adcionalObs,
    };
    console.log(dados)
    

    if(!selectedPacient || !date || !pacientReporter || !intervention || !evolution || !adcionalObs) {
         return Alert.alert("Erro", "Todos os campos são obrigatórios.");
        }
     

    try {
     // Crie a referência do documento da instituição
     const auth=getAuth();
     const user = auth.currentUser;
     const idPacienteEdit = await AsyncStorage.getItem("idRecord");
     const instituicaoDocRef = doc(db, "DataBases", instituicao); 
      // Agora, crie a subcoleção 'pacientes' dentro do documento da instituição
      const pacientesRef = doc(instituicaoDocRef, "prontuarios", user.uid, "pacientes", idPacienteEdit);
  
      // Adiciona o paciente dentro da subcoleção
      await updateDoc(pacientesRef, dados);
      Alert.alert("Sucesso", "Anamnese Realizada!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert("Erro", "Não foi realizar a anamnese.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>1. Identificação</Text>
        {/* Picker para selecionar paciente */}
            <View style={styles.pacientes}>
              <Picker selectedValue={selectedPacient} onValueChange={(itemValue) => setSelectedPacient(itemValue)}>
                <Picker.Item label="Selecione um paciente" value="" />
                {pacientes.map((paciente) => (
                  <Picker.Item key={paciente.id} label={paciente.name} value={paciente.name} />
                ))}
              </Picker>
            </View>
      
      
      <TouchableOpacity onPress={showDatePicker} style={styles.ButtonDate}>
        <Text style={styles.dateText}>
          {date ? date.toLocaleDateString("pt-BR") : "Data de Atendimento"}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
        
        <Text style={styles.title}>Relato do paciente</Text>


      <TextInput style={styles.inputObs}  value={pacientReporter} onChangeText={setPacientReporter}/>
      
      <Text style={styles.title}>Intervensão</Text>

      <TextInput style={styles.inputObs}  value={intervention} onChangeText={setIntervention}/>
      
      <Text style={styles.title}>Evolução Observada</Text>

      <TextInput style={styles.inputObs}  value={evolution} onChangeText={setEvolution}/>
      
      <Text style={styles.title}>Observações adcionais</Text>

      <TextInput style={styles.inputObs}  value={adcionalObs} onChangeText={setAdtionalObs}/>

      <TouchableOpacity style={styles.NewPacient} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar prontuário</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gender: {
    borderWidth: 2,
    margin: 4,
    padding: 0,
    height: 50,
    textAlign: "left",
    alignItems: "left",
    justifyContent: "center",
  },
  ButtonDate: {
    borderWidth: 2,
    margin: 4,
    padding: 5,
    height: 50,
    textAlign: "left",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  NewPacient: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    width: "90%",
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    padding: 5,
    margin: 4,
    height: 50,
  },
  inputObs: {
    borderWidth: 1,
    padding: 5,
    margin: 4,
    height: 100,
    textAlignVertical: "top",
  },
  pacientes: {
    borderWidth: 1,
    margin: 4,
    height: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    alignContent: 'center',
    alignSelf: 'center',
  }
});

export default EditRecordsScreen;
