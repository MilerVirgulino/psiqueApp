import { 
  View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import { app, auth } from "../firebaseConfig";

const db = getFirestore(app); // 🔹 Definição do Firestore fora do componente

const NewPacientsScreen = ({ navigation }) => {
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [nameMother, setNameMother] = useState("");
  const [nameFather, setNameFather] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");
  const [activity, setActivity] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [obs, setObs] = useState("");
  const [instituicao, setInstituicao] = useState(null); // Estado para armazenar a instituição

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

  const handleSubmit = async () => {
    if (!instituicao) {
      Alert.alert("Erro", "Nenhuma instituição encontrada. Verifique seu login.");
      return;
    }

    const dados = {
      name,
      nameMother,
      nameFather,
      address,
      cpf,
      gender,
      activity,
      phoneNumber1,
      phoneNumber2,
      obs,
    };

    try {
      // Crie a referência do documento da instituição
      const instituicaoDocRef = doc(db, "DataBases", instituicao); 
  
      // Agora, crie a subcoleção 'pacientes' dentro do documento da instituição
      const pacientesRef = collection(instituicaoDocRef, "pacientes");
  
      // Adiciona o paciente dentro da subcoleção
      await addDoc(pacientesRef, dados);
      console.log("Paciente cadastrado com sucesso!");
      Alert.alert("Sucesso", "Paciente cadastrado!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o paciente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Nome da mãe" value={nameMother} onChangeText={setNameMother} />
      <TextInput style={styles.input} placeholder="Nome do pai" value={nameFather} onChangeText={setNameFather} />
      
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

      <TextInput style={styles.input} placeholder="Endereço" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Sexo" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Status" value={activity} onChangeText={setActivity} />
      <TextInput style={styles.input} placeholder="Telefone 1" value={phoneNumber1} onChangeText={setPhoneNumber1} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Telefone 2" value={phoneNumber2} onChangeText={setPhoneNumber2} keyboardType="numeric" />
      <TextInput style={styles.inputObs} placeholder="Observações" value={obs} onChangeText={setObs} multiline />

      <TouchableOpacity style={styles.NewPacient} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ButtonDate: {
    borderWidth: 1,
    margin: 4,
    padding: 1,
    height: 40,
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
    borderWidth: 1,
    padding: 1,
    margin: 4,
    height: 50,
  },
  inputObs: {
    borderWidth: 1,
    padding: 1,
    margin: 4,
    height: 100,
    textAlignVertical: "top",
  },
});

export default NewPacientsScreen;
