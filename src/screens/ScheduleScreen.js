import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";


const ScheduleScreen=({navegation})=>{
    const [date, setDate] = useState(null);
    const [show, setShow] = useState(false);
    console.log(date)

    const showDatePicker = () => {
        setShow(true);
      };

      const onChange = (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
          
        }
        setShow(false);
      };

    return(
        
        <ScrollView>
            <TouchableOpacity onPress={showDatePicker} style={styles.ButtonDate}>
          <Text style={styles.dateText}>
            {date ? date.toLocaleDateString("pt-BR") : "Selecione data"}
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ButtonDate: {
        backgroundColor: "#783578",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    dateText: {
        color: "#fff",
        fontSize: 18,
    },
})
export default ScheduleScreen;