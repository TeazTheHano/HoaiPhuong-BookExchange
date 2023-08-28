// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailScreen';
import LoadScreen from './screens/LoadScreen';
import LogReg from './screens/LogReg';
import VerifyScreen from './screens/VerifyScreen';
import CCCDpicture from './screens/CCCDpicture';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LogReg" component={LogReg} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="CCCDpicture" component={CCCDpicture} />
          <Stack.Screen name="Load" component={LoadScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}