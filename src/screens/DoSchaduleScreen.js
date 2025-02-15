import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaskedTextInput } from "react-native-mask-text";

const db = getFirestore(app);

const DoScheduleScreen = ({ navigation }) => {
  const [selectedPacient, setSelectedPacient] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [tipos, setTipos] = useState([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState("");
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(null);
  const [valor, setValor] = useState("");
  console.log(valor / 100);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const handleSubmit = async () => {
    const instituicao = await AsyncStorage.getItem("instituicao");
    if (!instituicao) {
      console.error("Instituição não encontrada.");
      return;
    }
    const dados = {
      paciente: selectedPacient,
      tipo: selectedTipo,
      responsavel: selectedResponsavel,
      data: date ? convertDate(date) : "erro ao agendar data",
      valor: valor / 100,
      horario: selectedTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      const agendamentosRef = collection(db, "DataBases", instituicao, "agendamentos");
      await addDoc(agendamentosRef, dados);
      Alert.alert("Agendamento realizado com sucesso");
      // Limpar os campos após o agendamento
      setSelectedPacient("");
      setSelectedTipo("");
      setSelectedResponsavel("");
      setValor("");
      setDate(null);
      setSelectedTime(new Date());
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      Alert.alert("Não foi possível realizar o agendamento");
    }
  };

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

        const pacientesPulled = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Nome não definido",
        }));

        setPacientes(pacientesPulled);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);

  function convertDate(date) {
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const instituicao = await AsyncStorage.getItem("instituicao");
        if (!instituicao) {
          console.error("Instituição não encontrada.");
          return;
        }

        const tiposRef = collection(db, "DataBases", instituicao, "tipo");
        const querySnapshot = await getDocs(tiposRef);

        const tiposPulled = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          tipo: doc.data().tipo || "Tipo não definido",
        }));

        setTipos(tiposPulled);
      } catch (error) {
        console.error("Erro ao buscar tipos de atendimento:", error);
      }
    };

    fetchTipos();
  }, []);

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
  }, []);

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Picker para selecionar paciente */}
      <View style={styles.pacientes}>
        <Picker selectedValue={selectedPacient} onValueChange={(itemValue) => setSelectedPacient(itemValue)}>
          <Picker.Item label="Selecione um paciente" value="" />
          {pacientes.map((paciente) => (
            <Picker.Item key={paciente.id} label={paciente.name} value={paciente.name} />
          ))}
        </Picker>
      </View>

      {/* Botão para selecionar data */}
      <TouchableOpacity onPress={showDatePicker} style={styles.ButtonDate}>
        <Text style={styles.dateText}>
          {date ? date.toLocaleDateString("pt-BR") : "Data do agendamento"}
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

      <Text style={styles.textdate}>Selecione um horário</Text>

      {/* Campo de horário */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          value={selectedTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          editable={false} // Não pode ser editado manualmente
        />
      </TouchableOpacity>

      {/* Seletor de horário */}
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              setSelectedTime(selectedDate);
            }
          }}
        />
      )}

      {/* Picker para selecionar tipo de atendimento */}
      <View style={styles.pacientes}>
        <Picker selectedValue={selectedTipo} onValueChange={(itemValue) => setSelectedTipo(itemValue)}>
          <Picker.Item label="Tipo do atendimento" value="" />
          {tipos.map((tipo) => (
            <Picker.Item key={tipo.id} label={tipo.tipo} value={tipo.tipo} />
          ))}
        </Picker>
      </View>

      {/* Picker para selecionar responsável */}
      <View style={styles.pacientes}>
        <Picker selectedValue={selectedResponsavel} onValueChange={(itemValue) => setSelectedResponsavel(itemValue)}>
          <Picker.Item label="Responsável" value="" />
          {responsaveis.map((resp) => (
            <Picker.Item key={resp.id} label={resp.responsavel} value={resp.responsavel} />
          ))}
        </Picker>
      </View>

      {/* Input para Valor em Reais */}
      <View style={styles.valorContainer}>
        <Text style={styles.label}>Valor (R$)</Text>
        <MaskedTextInput
          type="currency"
          options={{
            prefix: "R$ ",
            decimalSeparator: ",",
            groupSeparator: ".",
            precision: 2,
          }}
          value={valor}
          onChangeText={(text, rawText) => setValor(rawText)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Botão para agendar */}
      <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Agendar</Text>
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
});

export default DoScheduleScreen;

