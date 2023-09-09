import React from 'react';
import { View, Text, Button } from 'react-native';

function LoadScreen({ navigation }) {

  return (
    <View>
      <Text>Load Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

export default LoadScreen;