import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image,TextInput, ScrollView, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useEffect, useState } from "react";

const NewPacientsScreen=({navegation})=>{
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show,setShow] = useState(false);
  const [name, setName] = useState('');
  const [nameMother, setNameMother] = useState('');
  const [nameFather, setNameFather] = useState('');
  const [address, setAddress] = useState('');
  const [cpf, setCpf] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [obs, setObs] = useState('');

  console.log(date)





  const onChange =(e,selectedDate)=>{
      setDate(selectedDate);
      setShow(false);
    }

    const ShowMode=(modeToshow)=>{
      setShow(true);
      setMode(modeToshow)
      
    }
    console.log(name)

    return(
        <ScrollView>
            <TextInput
                      style={styles.input}
                      placeholder="Nome"
                      value={name}
                      onChangeText={setName}
                      keyboardType="text"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Nome da mãe"
                      value={nameMother}
                      onChangeText={setNameMother}
                      keyboardType="text"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Nome do pai"
                      value={nameFather}
                      onChangeText={setNameFather}
                      keyboardType="text"
                    />
            
            <TouchableOpacity onPress={()=>{ShowMode('date')}} style={styles.ButtonDate}>
                <Text style={styles.ButtonDateText}>
                    Data de Nascimento
                </Text>
            </TouchableOpacity>
              {
                show && (
                  <DateTimePicker
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}

                  />
                )
              }
                      
                    
            <TextInput
                      style={styles.input}
                      placeholder="Endereço"
                      value={address}
                      onChangeText={setAddress}
                      keyboardType="text"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="CPF"
                      value={cpf}
                      onChangeText={setCpf}
                      keyboardType="numeric"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Sexo"
                      value={gender}
                      onChangeText={setGender}
                      keyboardType="text"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Status"
                      value={activity}
                      onChangeText={setActivity}
                      keyboardType="text"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Telefone 1"
                      value={phoneNumber1}
                      onChangeText={setPhoneNumber1}
                      keyboardType="numeric"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Telefone 2"
                      value={phoneNumber2}
                      onChangeText={setPhoneNumber2}
                      keyboardType="numeric"
                    />
            <TextInput
                      style={styles.input}
                      placeholder="Observações"
                      value={obs}
                      onChangeText={setObs}
                      keyboardType="text"
                    />
            <TouchableOpacity>
                <Text style={styles.NewPacient}>
                    Novo paciente
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
  ButtonDate: {
    borderWidth: 1,
    margin: 4,
    padding: 1,
    height:40,
    textAlign:'left',
    justifyContent: 'center',
  
    
  },
   NewPacient:{
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
    textAlign: 'center',
   },
   input:{
    borderWidth: 1,
    padding:1,
    margin: 4,
    height:40,
   }
  });
  

export default NewPacientsScreen;