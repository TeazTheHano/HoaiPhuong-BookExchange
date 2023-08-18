import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { auth } from '../firebase'

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <TouchableOpacity onPress={() => auth.signOut().then(() => {navigation.replace('LogReg');})}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;