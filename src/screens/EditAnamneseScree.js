import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, collection, addDoc, doc, Timestamp, getDocs,getDoc, deleteDoc,updateDoc } from "firebase/firestore"; // Importando o Timestamp
import { app, auth } from "../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { getAuth } from "firebase/auth";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";




const db = getFirestore(app); // 🔹 Definição do Firestore fora do componente

const EditAnamneseScreen = ({ navigation }) => {
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
  const [pdfUri, setPdfUri] = useState('');


  useEffect(() => {
    const loadDocmentFirebase = async () => {
      const idPacienteEdit = await AsyncStorage.getItem("idAnamnese");
      const instituicao = await AsyncStorage.getItem("instituicao");
       const auth=getAuth();
        const user = auth.currentUser;
  
      if (!idPacienteEdit || !instituicao) {
        console.error("ID do paciente ou instituição não encontrados.");
        return;
      }
  
      try {
        const pacienteRef = doc(db, "DataBases", instituicao, "anamneses", user.uid, "pacientes", idPacienteEdit);
        const docSnap = await getDoc(pacienteRef);
        
  
        if (docSnap.exists()) {
          const pacienteData = docSnap.data();
          setSelectedPacient(pacienteData.name);  // Preenchendo os campos do formulário     
          setDate(convertDateToPicker(pacienteData.date)); 
          setGender(pacienteData.gender);
          setNation(pacienteData.nation);
          setPhoneNumber1(pacienteData.phoneNumber1);
          setPhoneNumber2(pacienteData.phoneNumber2);
          setMatrial(pacienteData.matrial);
          setEducation(pacienteData.education);
          setProfession(pacienteData.profession);
          setResidence(pacienteData.residence);
          setComplaint(pacienteData.complaint);
          setSymptom(pacienteData.symptom);
          setPathologyBegin(pacienteData.pathologyBegin);
          setIntensity(pacienteData.intensity);
          setPreviousTreatments(pacienteData.previousTreatments);
          setMedicines(pacienteData.medicines);
          setInfancy(pacienteData.infancy);
          setVices(pacienteData.vices);
          setHobbies(pacienteData.hobbies);
          setWork(pacienteData.work);
          setParents(pacienteData.parents);
          setSiblings(pacienteData.siblings);
          setSpouse(pacienteData.spouse);
          setChildren(pacienteData.children);
          setHome(pacienteData.home);
          setAparence(pacienteData.aparence);
          setBeahavor(pacienteData.beahavor);
          setAttitude(pacienteData.attitude);
          setMemory(pacienteData.memory);
          setInteligency(pacienteData.inteligency);
          setDiagnosticHypothesis(pacienteData.diagnosticHypothesis);



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
      const auth=getAuth();
      const user = auth.currentUser;
      const idPacienteEdit = await AsyncStorage.getItem("idAnamnese");
      const instituicaoDocRef = doc(db, "DataBases", instituicao); 

      // Agora, crie a subcoleção 'pacientes' dentro do documento da instituição
      const pacientesRef = doc(instituicaoDocRef, "anamneses", user.uid, "pacientes", idPacienteEdit);
  
      // Adiciona o paciente dentro da subcoleção
      await updateDoc(pacientesRef, dados);
      Alert.alert("Sucesso", "Anamnese Realizada!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert("Erro", "Não foi realizar a anamnese.");
    }
  };
  const handleDell =async ()=>{

         const instituicao = await AsyncStorage.getItem("instituicao");
         const auth=getAuth();
        const user = auth.currentUser;
        const idPacienteEdit = await AsyncStorage.getItem("idAnamnese");

        if(!instituicao || !idPacienteEdit || !user){
            Alert.alert("Erro", "Nenhuma instituição ou anamnese não encontrada. Verifique seu login.");
            return;
        }

    

    
      // Exibe o Alert para confirmação
      Alert.alert(
        "Confirmação de exclusão", 
        "Você tem certeza que deseja excluir esta anamnese?", 
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Exclusão cancelada"),
            style: "cancel"
          },
          {
            text: "Excluir",
            onPress: async () => {
              // Cria a referência do documento com o ID do paciente
              const pacienteRef = doc(db, "DataBases", instituicao, "anamneses", user.uid, "pacientes", idPacienteEdit);
    
              // Tenta excluir o documento
              try {
                await deleteDoc(pacienteRef);
                Alert.alert("Paciente Excluido com Sucesso")
                navigation.goBack();
                
              } catch (error) {
                console.error("Erro ao excluir o paciente:", error);
              }
            }
          }
        ]
      );
    }
    const handlePrint = async () => {
const html= `
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
      .section {
        margin-bottom: 20px;
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #34495e;
        margin-bottom: 5px;
      }
      .section-content {
        font-size: 14px;
        margin-left: 20px;
      }
      .section-content p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <h1>Ficha de Anamnese</h1>

    <div class="section">
      <div class="section-title">Informações Pessoais</div>
      <div class="section-content">
        <p><strong>Nome:</strong> ${selectedPacient}</p>
        <p><strong>Data de Nascimento:</strong> ${convertDate(date)}</p>
        <p><strong>Gênero:</strong> ${gender}</p>
        <p><strong>Nacionalidade:</strong> ${nation}</p>
        <p><strong>Estado Civil:</strong> ${matrial}</p>
        <p><strong>Escolaridade:</strong> ${education}</p>
        <p><strong>Profissão:</strong> ${profession}</p>
        <p><strong>Residência:</strong> ${residence}</p>
        <p><strong>Telefone 1:</strong> ${phoneNumber1}</p>
        <p><strong>Telefone 2:</strong> ${phoneNumber2}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Atendimento</div>
      <div class="section-content">
        <p><strong>Queixa Principal:</strong> ${complaint}</p>
        <p><strong>Sintomas:</strong> ${symptom}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Histórico da Doença Atual</div>
      <div class="section-content">
        <p><strong>Início da Patologia:</strong> ${pathologyBegin}</p>
        <p><strong>Intensidade:</strong> ${intensity}</p>
        <p><strong>Tratamentos Anteriores:</strong> ${previousTreatments}</p>
        <p><strong>Medicamentos:</strong> ${medicines}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Histórico Pessoal</div>
      <div class="section-content">
        <p><strong>Infância:</strong> ${infancy}</p>
        <p><strong>Vícios:</strong> ${vices}</p>
        <p><strong>Hobbies:</strong> ${hobbies}</p>
        <p><strong>Trabalho:</strong> ${work}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Histórico Familiar</div>
      <div class="section-content">
        <p><strong>Parentes:</strong> ${parents}</p>
        <p><strong>Irmãos:</strong> ${siblings}</p>
        <p><strong>Esposa:</strong> ${spouse}</p>
        <p><strong>Filhos:</strong> ${children}</p>
        <p><strong>Local de Residência:</strong> ${home}</p>
      </div>
    </div>

    

    <div class="section">
      <div class="section-title">Exame Psíquico</div>
      <div class="section-content">
        <p><strong>Aparência:</strong> ${aparence}</p>
        <p><strong>Comportamento:</strong> ${beahavor}</p>
        <p><strong>Atitude:</strong> ${attitude}</p>
        <p><strong>Memória:</strong> ${memory}</p>
        <p><strong>Inteligência:</strong> ${inteligency}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Diagnóstico</div>
      <div class="section-content">
        <p><strong>Hipótese Diagnóstica:</strong> ${diagnosticHypothesis}</p>
      </div>
    </div>

  </body>
</html>
`
  const file= await printToFileAsync(
    {
      html: html,
      base64: false,
      fileName: "Anamnese.html",
    }
  )
  await shareAsync(file.uri)
    }


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
        <Text style={styles.buttonText}>Finalizar Edição</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.NewPacient} onPress={handlePrint}>
        <Text style={styles.buttonText}>Imprimir Anamnese</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.NewPacient} onPress={handleDell}>
        <Text style={styles.buttonText}>Deletar Anamnese</Text>
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

export default EditAnamneseScreen;
