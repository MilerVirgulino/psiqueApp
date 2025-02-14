import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

const db = getFirestore(app);

const DoScheduleScreen = ({ navigation }) => {
  const [selectedPacient, setSelectedPacient] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false); // Controla a visibilidade do relógio

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pacientes}>
        <Picker selectedValue={selectedPacient} onValueChange={(itemValue) => setSelectedPacient(itemValue)}>
          <Picker.Item label="Selecione um paciente" value="" />
          {pacientes.map((pacient) => (
            <Picker.Item key={pacient.id} label={pacient.name} value={pacient.name} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          value={selectedTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          editable={false}
        />
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false); // Oculta o relógio após a seleção
            if (selectedDate) {
              setSelectedTime(selectedDate);
              console.log("Hora selecionada:", selectedDate.toLocaleTimeString("pt-BR"));
            }
          }}
        />
      )}
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
    padding: 10,
    margin: 4,
    height: 40,
    textAlign: "center",
  },
});

export default DoScheduleScreen;
