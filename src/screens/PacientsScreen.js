import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";


const PacientsScreen=({navigation})=>{
  
    const handleNewPacientScreen = () => {
        console.log('passou aqui')
        navigation.navigate("NewPacients");
        
      };

    return(
        <View>
            <TouchableOpacity onPress={handleNewPacientScreen}>
                <Text style={styles.NewPacient}>
                    Novo paciente
                </Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
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
   }
  });
  

export default PacientsScreen;