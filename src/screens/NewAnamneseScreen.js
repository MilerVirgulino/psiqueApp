import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, collection, addDoc, doc, Timestamp, getDocs } from "firebase/firestore"; // Importando o Timestamp
import { app, auth } from "../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";


const db = getFirestore(app); // 🔹 Definição do Firestore fora do componente

const NewAnamneseScreen = ({ navigation }) => {
  const [selectedPacient, setSelectedPacient] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [nation, setNation] = useState("");
  const [matrial, setMatrial] = useState("");
  const [education, setEducation] = useState("");
  const [instituicao, setInstituicao] = useState(null); // Estado para armazenar a instituição
  const [profession, setProfession] = useState("");
  const [residence, setResidence]=useState("");
  const [complaint, setComplaint]=useState("");
  const [symptom, setSymptom] = useState("");
  const [pathologyBegin, setPathologyBegin] = useState("");
  const [intensity, setIntensity] = useState("");
  const [previousTreatments, setPreviousTreatments] = useState("");
  const [medicines, setMedicines]=useState("");
  const [infancy, setInfancy] = useState("");
  const [vices, setVices] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [work, setWork] = useState("");
  const [parents, setParents] = useState("");
  const [siblings, setSiblings] = useState("");
  const [spouse, setSpouse]=useState("");
  const [children, setChildren] = useState("");
  const [home, setHome] = useState("");
  const [aparence, setAparence] = useState("");
  const [beahavor, setBeahavor]=useState("");
  const [attitude, setAttitude]=useState("");
  const [memory, setMemory]=useState("");
  const [inteligency, setInteligency]= useState("");
  const [diagnosticHypothesis, setDiagnosticHypothesis]=useState("");



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



  const handleSubmit = async () => {
    if (!instituicao) {
      Alert.alert("Erro", "Nenhuma instituição encontrada. Verifique seu login.");
      return;
    }

    const dados = {
        name: selectedPacient,
        date: convertDate(date),
        gender,
        phoneNumber1,
        phoneNumber2,
        nation,
        matrial,
        education,
        profession,
        residence,
        complaint,
        symptom,
        pathologyBegin,
        intensity,
        previousTreatments,
        medicines,
        infancy,
        vices,
        hobbies,
        work,
        parents,
        siblings,
        spouse,
        children,
        home,
        aparence,
        beahavor,
        attitude,
        memory,
        inteligency,
        diagnosticHypothesis,
    

    };
    

    if(!selectedPacient || !date || !gender || !phoneNumber1 || !phoneNumber2 || !nation || !matrial || !education || !profession || !residence || !complaint || !symptom || !pathologyBegin || 
        !intensity || !previousTreatments || !medicines || !infancy || !vices || !hobbies || !work || !parents || !siblings || !spouse || !children || !home || !aparence || !beahavor || !attitude || !memory || !inteligency || !diagnosticHypothesis) {
         return Alert.alert("Erro", "Todos os campos são obrigatórios.");
        }
     

    try {
      // Crie a referência do documento da instituição
      const instituicaoDocRef = doc(db, "DataBases", instituicao);
  
      // Agora, crie a subcoleção 'pacientes' dentro do documento da instituição
      const pacientesRef = collection(instituicaoDocRef, "anamneses");
  
      // Adiciona o paciente dentro da subcoleção
      await addDoc(pacientesRef, dados);
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
          {date ? date.toLocaleDateString("pt-BR") : "Data de Nascimento"}
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
        <View style={styles.gender}>
        <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
          <Picker.Item label="Sexo" value="" style={styles.input} />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>
      <TextInput style={styles.input} placeholder="Nacionalidade" value={nation} onChangeText={setNation}/>

      <View style={styles.gender}>
        <Picker selectedValue={matrial} onValueChange={(itemValue) => setMatrial(itemValue)}>
          <Picker.Item label="Estado Civil" value="" style={styles.input} />
          <Picker.Item label="Solteiro" value="Solteiro" />
          <Picker.Item label="Casado" value="Casado" />
          <Picker.Item label="Divorciado" value="Divorciado" />
          <Picker.Item label="Viúvo" value="Viúvo" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>
      <View style={styles.gender}>
        <Picker selectedValue={education} onValueChange={(itemValue) => setEducation(itemValue)}>
          <Picker.Item label="Grau de instrução" value="" style={styles.input} />
          <Picker.Item label="Sem escolaridade" value="Sem escolaridade" />
          <Picker.Item label="Fundamental incompleto" value="Fundamental incompleto" />
          <Picker.Item label="Fundamental completo" value="Fundamental incompleto" />
          <Picker.Item label="Médio incompleto" value="Médio incompleto" />
          <Picker.Item label="Médio completo" value="Médio completo" />
          <Picker.Item label="Superior incompleto" value="Superior incompleto" />
          <Picker.Item label="Superior completo" value="Superior completo" />
          <Picker.Item label="Pós-graduação" value="Pós-graduação" />
          <Picker.Item label="Não-informado" value="Não-informado" />
        </Picker>
      </View>

      <TextInput style={styles.input} placeholder="Profissão" value={profession} onChangeText={setProfession}/>
      <TextInput style={styles.input} placeholder="Residência" value={residence} onChangeText={setResidence}/>
      

      
      
      <MaskedTextInput style={styles.input} mask="(99) 99999-9999" value={phoneNumber1} placeholder="Telefone 1" onChangeText={setPhoneNumber1} />
      <MaskedTextInput style={styles.input} mask="(99) 99999-9999" value={phoneNumber2} placeholder="Telefone 2" onChangeText={setPhoneNumber2} />
      
      <Text style={styles.title}>2. Atendimento</Text>

      <TextInput style={styles.inputObs} placeholder="Queixa principal" value={complaint} onChangeText={setComplaint}/>
      <TextInput style={styles.inputObs} placeholder="Sintomas" value={symptom} onChangeText={setSymptom}/>

      <Text style={styles.title}>3. Histórico da Doença atual</Text>

      <TextInput style={styles.inputObs} placeholder="Início da Patologia" value={pathologyBegin} onChangeText={setPathologyBegin}/>

      <TextInput style={styles.inputObs} placeholder="Intensidade" value={intensity} onChangeText={setIntensity}/>

      <TextInput style={styles.inputObs} placeholder="Tratamentos Anteriores" value={previousTreatments} onChangeText={setPreviousTreatments}/>

      <TextInput style={styles.inputObs} placeholder="Medicamentos" value={medicines} onChangeText={setMedicines}/>

      <Text style={styles.title}>4. Histórico Pessoal</Text>

      <TextInput style={styles.inputObs} placeholder="Infância" value={infancy} onChangeText={setInfancy}/>

      <TextInput style={styles.inputObs} placeholder="Vícios" value={vices} onChangeText={setVices}/>

      <TextInput style={styles.inputObs} placeholder="Hobbies" value={hobbies} onChangeText={setHobbies}/>

      <TextInput style={styles.inputObs} placeholder="Trabalho" value={work} onChangeText={setWork}/>


      <Text style={styles.title}>5. Histórico Familiar</Text>


      <TextInput style={styles.inputObs} placeholder="Pais" value={parents} onChangeText={setParents}/>

      <TextInput style={styles.inputObs} placeholder="Irmãos" value={siblings} onChangeText={setSiblings}/>

      <TextInput style={styles.inputObs} placeholder="Cônjuge" value={spouse} onChangeText={setSpouse}/>

      <TextInput style={styles.inputObs} placeholder="Filhos" value={children} onChangeText={setChildren}/>

      <TextInput style={styles.inputObs} placeholder="Lar" value={home} onChangeText={setHome}/>

      <Text style={styles.title}>6. Exame Psíquico</Text>

      <TextInput style={styles.inputObs} placeholder="Aparência" value={aparence} onChangeText={setAparence}/>

      <TextInput style={styles.inputObs} placeholder="Comportamento" value={beahavor} onChangeText={setBeahavor}/>

      <View style={styles.gender}>
        <Picker selectedValue={attitude} onValueChange={(itemValue) => setAttitude(itemValue)}>
          <Picker.Item label="Atitude com o Entrevistador " value="" style={styles.input} />
          <Picker.Item label="Cooperativo" value="Cooperativo" />
          <Picker.Item label="Resistente" value="Resistente" />
          <Picker.Item label="Indiferente" value="Indiferente" />
        </Picker>
      </View>

      <TextInput style={styles.inputObs} placeholder="Memória" value={memory} onChangeText={setMemory}/>

      <TextInput style={styles.inputObs} placeholder="Inteligência" value={inteligency} onChangeText={setInteligency}/>


      <Text style={styles.title}>7. Hipótese Diagnóstica</Text>

      <TextInput style={styles.inputObs}  value={diagnosticHypothesis} onChangeText={setDiagnosticHypothesis}/>

      <TouchableOpacity style={styles.NewPacient} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finalizar Anamnese</Text>
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

export default NewAnamneseScreen;
