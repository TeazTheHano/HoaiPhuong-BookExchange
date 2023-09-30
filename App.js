// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import firebase
import { auth, firestore } from './firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailScreen';
import LoadScreen from './screens/LoadScreen';
import LogReg from './screens/LogReg';
import VerifyScreen from './screens/VerifyScreen';
import CCCDpicture from './screens/CCCDpicture';
import BookCategoryScreen from './screens/BookCategoryScreen';
import BookCategoryDetailScreen from './screens/BookCategoryDetailScreen';
import ClubScreen from './screens/ClubScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        <Stack.Screen name="BookCategory" component={BookCategoryScreen} />
        <Stack.Screen name="Club" component={ClubScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BookCategoryDetail" component={BookCategoryDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// Draft
{/* <TouchableOpacity onPress={() => auth.signOut().then(() => { navigation.replace('LogReg'); })}>
            <Text>Logout</Text>
          </TouchableOpacity> */}