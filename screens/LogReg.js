import React, { useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth, firestore } from '../firebase'
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import styles, { useCustomFonts } from './stylesheet'; // Import the custom fonts hook

function LogReg() {
    const navigation = useNavigation();
    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [fontsLoaded] = useCustomFonts();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .catch((error) => alert(error));
    }

    const register = () => {
        createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            .then((authUser) => {
                setDoc(doc(firestore, "userList", authUser.user.uid), {
                    name: name,
                    email: registerEmail,
                    password: registerPassword,
                })
            })
            .catch((error) => alert(error));
    }

    // const signInWithGoogle = () => {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(auth, provider)
    //         .then((result) => {
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential.accessToken;
    //             const user = result.user;
    //             setDoc(doc(firestore, "userList", user.uid), {
    //                 name: user.displayName,
    //                 email: user.email,
    //                 password: '',
    //             })
    //         })
    //         .then(() => {
    //             navigation.replace('Home');
    //         })
    //         .catch((error) => alert(error));
    // }

    if (!fontsLoaded) {
        return null; 
    }
    return (
        <View style={[styles.background, styles.h100vh]}>
            <Text style={[styles.h1, styles.textCenter]}>Book Exchange</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 50 }}>Login</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 50 }}
                placeholder="Email"
                onChangeText={text => setLoginEmail(text)}
                value={loginEmail}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
                placeholder="Password"
                onChangeText={text => setLoginPassword(text)}
                value={loginPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
                onPress={signIn}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
                onPress={signInWithGoogle}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Login with Google</Text>
            </TouchableOpacity> */}

            {/*  */}

            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 50 }}>Login</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 50 }}
                placeholder="Email"
                onChangeText={text => setRegisterEmail(text)}
                value={registerEmail}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
                placeholder="Password"
                onChangeText={text => setRegisterPassword(text)}
                value={registerPassword}
                secureTextEntry
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
                placeholder="Name"
                onChangeText={text => setName(text)}
                value={name}
            />
            <TouchableOpacity
                style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
                onPress={register}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>register</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LogReg

// const styles = StyleSheet.create({
//     background: {
//         backgroundColor: '#FBF8F2',
//     },
// })