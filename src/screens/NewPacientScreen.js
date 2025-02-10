import { 
  View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import { app, auth } from "../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";

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

    console.log(dados)

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
      <MaskedTextInput style={styles.input} mask="999.999.999-99" value={cpf} placeholder="CPF" onChangeText={setCpf}/>
      
      
      <View style={styles.gender}>
      <Picker   selectedValue={gender} onValueChange={(gender) => setGender(gender)}>
        <Picker.Item label="Sexo" value="" style={styles.input} />
        <Picker.Item label="Masculino" value="Masculino" />
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker>
      </View>

      <View style={styles.gender}>

      <Picker   selectedValue={activity} onValueChange={(activity) => setActivity(activity)}>
        <Picker.Item label="Status" value="" style={styles.input} />
        <Picker.Item label="Ativo" value="Ativo" />
        <Picker.Item label="Inativo" value="Inativo" />
      </Picker>
      </View>
      
      <MaskedTextInput style={styles.input} mask="(99) 99999-9999" value={phoneNumber1} placeholder="Telefone 1" onChangeText={setPhoneNumber1}/>
      <MaskedTextInput style={styles.input} mask="(99) 99999-9999" value={phoneNumber2} placeholder="Telefone 2" onChangeText={setPhoneNumber2}/>
      
      <TextInput style={styles.inputObs} placeholder="Observações" value={obs} onChangeText={setObs} multiline />

      <TouchableOpacity style={styles.NewPacient} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gender:{
    borderWidth:2,
    margin:4,
    padding: 0,
    height:50,
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
});

export default NewPacientsScreen;
