import  React,{useState} from "react";
import { View, Text,StyleSheet,TextInput,Button } from "react-native";
import {Amplify,API,graphqlOperation} from "aws-amplify";
import config from "./aws-exports"
import {createRestaurant} from "./src/graphql/mutations";
import {listRestaurants} from "./src/graphql/queries";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 },
  fetchData: {backgroundColor:"Pink",borderColor:"Black"}
})

const initialState = { name: '', description: '',location:'' }

export default function App () {
  Amplify.configure(config)
  const [formState, setFormState] = useState(initialState)
  const [restos, setResto] = useState([])
  const [fetchResto,setFetchResto] = useState([])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function addResto() {
    try {
      const resto = { ...formState }
      setResto([...restos, resto])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createRestaurant, {input: resto}))
    } catch (err) {
      console.log('error creating restaurant:', err)
    }
  }

  async function fetchRestos() {
    try {
      const fetchRestoData = await API.graphql(graphqlOperation(listRestaurants))
      const fetchResto = fetchRestoData.data.listRestaurants.items
      setFetchResto(fetchResto)
    } catch (err) { console.log('error fetching todos') }
  }
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name} 
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <TextInput
        onChangeText={val => setInput('location', val)}
        style={styles.input}
        value={formState.location}
        placeholder="Location"
      />
      <Button title="Create Resto" onPress={addResto} />
      <Button title="List All" onPress={fetchRestos} />
      {
        restos.map((resto, index) => (
          <View key={resto.id ? resto.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{resto.name}</Text>
            <Text>{resto.description}</Text>
        <Text>{resto.location}</Text>
          </View>
        ))
      }
      {
        fetchResto.map((resto,index)=>(
          <View key={resto.id ? resto.id : index} style={styles.fetchData}>
            <Text style={styles.todoName}>{resto.name}</Text>
            <Text>{resto.description}</Text>
        <Text>{resto.location}</Text>
        <Text>{resto.createdAt}</Text>
        <Text>{resto.updatedAt}</Text>
          </View>
        ))
      }
    </View>
  );
}
