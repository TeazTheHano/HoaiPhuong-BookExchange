import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import firebase
import { auth, firestore } from '../firebase'
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';

// Import local Icon
import Svg, { SvgUri, SvgXml } from 'react-native-svg';

// Import API
import Checkbox from 'expo-checkbox';

// 
function LogReg() {
    const navigation = useNavigation();

    // firebase usestate
    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');

    // screen usestate
    const [isLoginScreen, setIsLoginScreen] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);

    // data usestate
    const [fontsLoaded] = useCustomFonts();
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.navigate('Verify');
            }
        });
        return unsubscribe;
    }, []);

    const signIn = () => {
        if (isChecked) {
            signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .catch((error) => alert(error));
        } else {
            alert('Bạn chưa đồng ý với điều khoản của chúng tôi');
        }   
    }

    const register = () => {
        if (isChecked) {
            createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            .then((authUser) => {
                setDoc(doc(firestore, "userList", authUser.user.uid), {
                    name: name,
                    email: registerEmail,
                    password: registerPassword,
                })
            })
            .catch((error) => alert(error));
        } else {
            alert('Bạn chưa đồng ý với điều khoản của chúng tôi');
        }
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
    //             navigation.navigate('Veri');
    //         })
    //         .catch((error) => alert(error));
    // }

    const toggleLogin = () => {
        setIsLoginScreen(!isLoginScreen);
    }
    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    const renderScreen = () => {
        if (isLoginScreen) {
            return (
                <View style={[styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween, styles.flex3]}>
                    <View style={[componentStyle.formContainer, styles.positionRelative]}>
                        <Text style={[componentStyle.nunito, styles.textCenter]}>Đăng nhập</Text>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.17738 8.36739C11.4531 11.4691 12.1962 7.88075 14.2818 9.85483C16.2926 11.7588 17.4482 12.1402 14.9007 14.5525C14.5816 14.7954 12.5541 17.7177 5.42883 10.9708C-1.69729 4.22308 1.38623 2.30076 1.64275 1.9986C4.19648 -0.420369 4.59228 0.680604 6.603 2.58456C8.68866 4.55947 4.90169 5.26563 8.17738 8.36739Z" stroke="#1D2C40" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Số điện thoại/ Email"
                                onChangeText={text => setLoginEmail(text)}
                                value={loginEmail}
                            />
                        </View>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.3175 7.08579V5.47554C12.3175 3.59079 10.789 2.06229 8.90428 2.06229C7.01953 2.05404 5.48503 3.57504 5.47678 5.46054V5.47554V7.08579" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7624 15.9371H6.03164C4.46114 15.9371 3.18764 14.6643 3.18764 13.0931V9.87635C3.18764 8.3051 4.46114 7.03235 6.03164 7.03235H11.7624C13.3329 7.03235 14.6064 8.3051 14.6064 9.87635V13.0931C14.6064 14.6643 13.3329 15.9371 11.7624 15.9371Z" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.89717 10.652V12.3177" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Mật khẩu"
                                onChangeText={text => setLoginPassword(text)}
                                value={loginPassword}
                                secureTextEntry={!isShowPassword ? true : false}
                            />
                            <TouchableOpacity onPress={toggleShowPassword} style={[styles.positionAbsolute, styles.right5]}>
                                <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7.32046 10.7751C6.88921 10.3446 6.62671 9.75963 6.62671 9.10338C6.62671 7.78863 7.68571 6.72888 8.99971 6.72888C9.64996 6.72888 10.2485 6.99213 10.6722 7.42263" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.3286 9.52417C11.1546 10.4917 10.3926 11.2552 9.42586 11.4307" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.99096 13.1042C3.80071 12.1697 2.79271 10.8047 2.06221 9.10298C2.80021 7.39373 3.81496 6.02123 5.01271 5.07923C6.20296 4.13723 7.57621 3.62573 8.99971 3.62573C10.4315 3.62573 11.804 4.14473 13.0017 5.09348" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.5857 6.74316C15.1017 7.42866 15.5555 8.21991 15.9372 9.10266C14.462 12.5204 11.855 14.5792 8.99971 14.5792C8.35246 14.5792 7.71421 14.4742 7.10071 14.2694" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.9153 3.18726L3.08476 15.0178" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.dFlex, styles.flexRow, styles.gap2vw, styles.alignSelfCenter, styles.alignItemsCenter]}>
                            {/* checkbox */}
                            <Checkbox
                                value={isChecked}
                                onValueChange={setIsChecked}
                                color={isChecked ? colorStyle.color1 : colorStyle.color1}
                                style={{ borderRadius: 6 }}
                            />
                            <Text>Chấp nhận các nguyên tắc bảo mật của ứng dụng</Text>
                        </View>
                    </View>


                    <TouchableOpacity
                        style={[componentStyle.submitBtn, { backgroundColor: colorStyle.color1 }, { borderColor: colorStyle.color1 }]}
                        onPress={signIn}
                    >
                        <Text style={[componentStyle.submitBtnText, { color: 'white' }]}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            console.log('register');
            return (
                <View style={[styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween, styles.flex3]}>
                    <View style={[componentStyle.formContainer, styles.positionRelative]}>
                        <Text style={[componentStyle.nunito, styles.textCenter]}>Tạo tài khoản</Text>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none"><mask id="mask0_1545_3001" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="13" width="15" height="7"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.17145 13.1841H18.8045V19.6363H4.17145V13.1841Z" fill="white"/></mask><g mask="url(#mask0_1545_3001)"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4889 14.4966C7.5525 14.4966 5.55707 15.1371 5.55707 16.4015C5.55707 17.6772 7.5525 18.3238 11.4889 18.3238C15.4243 18.3238 17.4188 17.6833 17.4188 16.419C17.4188 15.1432 15.4243 14.4966 11.4889 14.4966M11.4889 19.6363C9.67911 19.6363 4.17136 19.6363 4.17136 16.4015C4.17136 13.5175 8.3479 13.1841 11.4889 13.1841C13.2986 13.1841 18.8045 13.1841 18.8045 16.419C18.8045 19.303 14.6289 19.6363 11.4889 19.6363" fill="#1D2C40"/></g><mask id="mask1_1545_3001" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="2" width="11" height="10"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.58246 2.25012H16.3933V11.5414H6.58246V2.25012Z" fill="white"/></mask><g mask="url(#mask1_1545_3001)"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4888 3.49926C9.51097 3.49926 7.9017 5.02263 7.9017 6.89601C7.89523 8.76326 9.4925 10.2858 11.4621 10.2928L11.4888 10.9175V10.2928C13.4658 10.2928 15.0742 8.76851 15.0742 6.89601C15.0742 5.02263 13.4658 3.49926 11.4888 3.49926M11.4888 11.5414H11.4593C8.75991 11.5335 6.57325 9.44838 6.58249 6.89338C6.58249 4.33401 8.783 2.24976 11.4888 2.24976C14.1938 2.24976 16.3933 4.33401 16.3933 6.89601C16.3933 9.45801 14.1938 11.5414 11.4888 11.5414" fill="#1D2C40"/></g></svg>`}/>
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Tên của bạn"
                                onChangeText={text => setName(text)}
                                value={name}
                            />
                        </View>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.1774 8.36739C11.4531 11.4691 12.1962 7.88075 14.2819 9.85483C16.2926 11.7588 17.4482 12.1402 14.9007 14.5525C14.5816 14.7954 12.5541 17.7177 5.42886 10.9708C-1.69727 4.22308 1.38625 2.30076 1.64277 1.9986C4.1965 -0.420369 4.5923 0.680604 6.60303 2.58456C8.68868 4.55947 4.90171 5.26563 8.1774 8.36739Z" stroke="#1D2C40" stroke-linecap="round" stroke-linejoin="round"/></svg>`}/>
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Số điện thoại"
                                // onChangeText={text => setName(text)}
                                // value={name}
                            />
                        </View>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.4269 6.63837L10.0945 9.34815C9.46486 9.84765 8.57902 9.84765 7.94939 9.34815L4.58881 6.63837" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.6816 15.75C14.9627 15.7563 16.5 13.8822 16.5 11.5788V6.42751C16.5 4.12412 14.9627 2.25 12.6816 2.25H5.31835C3.03734 2.25 1.5 4.12412 1.5 6.42751V11.5788C1.5 13.8822 3.03734 15.7563 5.31835 15.75H12.6816Z" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}/>
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Email"
                                onChangeText={text => setRegisterEmail(text)}
                                value={registerEmail}
                            />
                        </View>
                        <View style={componentStyle.loginInput}>
                            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.3175 7.08585V5.4756C12.3175 3.59085 10.789 2.06235 8.90428 2.06235C7.01953 2.0541 5.48503 3.5751 5.47678 5.4606V5.4756V7.08585" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7624 15.9372H6.03165C4.46115 15.9372 3.18765 14.6645 3.18765 13.0932V9.87647C3.18765 8.30522 4.46115 7.03247 6.03165 7.03247H11.7624C13.3329 7.03247 14.6064 8.30522 14.6064 9.87647V13.0932C14.6064 14.6645 13.3329 15.9372 11.7624 15.9372Z" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.89719 10.652V12.3178" stroke="#1D2C40" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}/>
                            <TextInput
                                style={componentStyle.loginInputText}
                                placeholder="Mật khẩu"
                                onChangeText={text => setRegisterPassword(text)}
                                value={registerPassword}
                                secureTextEntry
                                textContentType="password"
                            />
                        </View>
                        <View style={[styles.dFlex, styles.flexRow, styles.gap2vw, styles.alignSelfCenter, styles.alignItemsCenter]}>
                            {/* checkbox */}
                            <Checkbox
                                value={isChecked}
                                onValueChange={setIsChecked}
                                color={isChecked ? colorStyle.color1 : colorStyle.color1}
                                style={{ borderRadius: 6 }}
                            />
                            <Text>Chấp nhận các nguyên tắc bảo mật của ứng dụng</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[componentStyle.submitBtn, { backgroundColor: colorStyle.color1 }, { borderColor: colorStyle.color1 }]}
                        onPress={register}
                    >
                        <Text style={[componentStyle.submitBtnText, { color: 'white' }]}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    if (!fontsLoaded) {
        return null;
    }
    return (
        <SafeAreaView style={[styles.flex1, styles.background]}>
            <StatusBar
                currentHeight={200}
                animated={true}
                backgroundColor="transparent"
                barStyle="dark-content"
                showHideTransition="fade"
                hidden={false}
            />
            <View style={[styles.flex1, styles.justifyContentCenter]}>
                <Text style={[componentStyle.h1, styles.textCenter]}>App Name</Text>
                <Text style={[styles.textCenter, styles.lineHeight20, { fontFamily: 'fsThin', fontSize: 16 }]}>Quote for app</Text>
            </View>

            {renderScreen()}

            {/* Sign in with Google or Facebook */}
            <View style={[styles.flex1, styles.dFlex, styles.flexCol, styles.justifyContentSpaceEvenly]}>
                <Text style={styles.textCenter}>hoặc</Text>
                <View style={[styles.justifyContentCenter, styles.alignSelfCenter]}>
                    <View style={[styles.dFlex, styles.flexRow, styles.gap8vw]}>
                        <TouchableOpacity
                            onPress={() => { }}
                        >
                            <SvgXml xml={`<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_1545_6212" fill="white"><rect width="50" height="50" rx="14"/></mask><rect width="50" height="50" rx="14" stroke="#EAEAEA" stroke-width="50" mask="url(#path-1-inside-1_1545_6212)"/><path d="M33.5 10.8333H29.25C27.3714 10.8333 25.5697 11.5796 24.2413 12.908C22.9129 14.2364 22.1667 16.0381 22.1667 17.9167V22.1667H17.9167V27.8333H22.1667V39.1667H27.8333V27.8333H32.0833L33.5 22.1667H27.8333V17.9167C27.8333 17.541 27.9826 17.1806 28.2483 16.9149C28.5139 16.6493 28.8743 16.5 29.25 16.5H33.5V10.8333Z" fill="#1877F2"/></svg>`} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { }}
                        >
                            <SvgXml xml={`
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><mask id="path-1-inside-1_1545_6211" fill="white"><rect width="50" height="50" rx="14"/></mask><rect width="50" height="50" rx="14" stroke="#EAEAEA" stroke-width="50" mask="url(#path-1-inside-1_1545_6211)"/><rect x="9" y="9" width="40" height="40" fill="url(#pattern0)"/><defs><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_1545_6211" transform="scale(0.0024)"/></pattern><image id="image0_1545_6211" width="512" height="512" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACAKADAAQAAAABAAACAAAAAAAL+LWFAABAAElEQVR4Ae3dB5xU1d34/3PuzBZ2F5YiKgtYYkHFvrsQO02U2EGMxm4Sk5hE037GGBPHmPr45P/4pDx51MQCqE/AEltsgGjEwrL23ojCLlhgFwS2zdzz/87aALdMu3fOvfczr0R2Z+4953veZ3bud84991yleCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAA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RSCkAiQAIe1YmmWPwN6zTq8sMxsPUI6aIlFNMUbtLyME/O1l2UXilnS0elZ2my+jLIsdp/zhJ0+7cV2WxbA5Agh8LMCHEG8FBHwW2O/mY2ucrtKDZNGZg7RjDpJJavsyQtBDJxjzgXZ0o+uaR412Hl7XsmHJG+ffK9/6eSCAQCEESAAKoUgZCOQhkB4hKNVt9XJfglr5ZrufDA7sL8Pau2qtY3kUG6hdP56p3yhtfkor96mUG2tsPGPeO4FqBMEiEDABEoCAdRjhRkOg+7SBbttHLl0bK0Pfu8m57j1kQaLdZHXC7YN6+iC91K4c4P/tKvWa3If8FWnXa0a5r5mS1CtPn3JnczR6llYiYI8ACYA9fUEkCPQrUHvVMRWqsnwnx3V3cB2zg+M628vMd1mu2B0t36JrJGEYXqz7GMhlkKulASvlQ+Ud7Zpm4zhN8twKbUyzq9xlHeXxN188aV5nv41kAwQQ8EWABMAXZipBwD+B2rkzq3WH2la+YQ+Xg+8w7agq15iBSutq7bqDdExXyWvdNzuSf7XjqMGfROemXDnd7rR+8rv8u1Y+JORLu/xHq1b5qVUSjFatU63ydb5VztG3Oh1Oa6WqbF109vXtm+zHjwgggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAALhFvj/ARdXkyyvDsnxAAAAAElFTkSuQmCC"/></defs></svg>
                            `} />
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.alignSelfCenter]}>
                    <Text>{isLoginScreen? `Bạn chưa có tài khoản? ` : `Bạn đã có tài khoản? `}</Text>
                    <TouchableOpacity onPress={() => { toggleLogin() }}><Text style={{ color: '#123ADA', fontWeight: 'bold' }}>{isLoginScreen? `Đăng ký` : `Đăng nhập`}</Text></TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default LogReg