import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera, CameraType } from 'expo-camera';

// Import firebase
import { auth, firestore } from '../firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';
import Svg, { SvgUri, SvgXml } from 'react-native-svg';

// Import the custom components
import { topNavBar, submitBtnComponent } from './components';

function CCCDpicture() {
    const navigation = useNavigation();
    const [fontsLoaded] = useCustomFonts();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [capturedImage1, setCapturedImage1] = useState(null);
    const [capturedImage2, setCapturedImage2] = useState(null);
    const cameraRef = useRef(null);
    const [step, setStep] = useState(0);
    const [screenColor, setScreenColor] = useState(colorStyle.color1);

    if (!fontsLoaded) {
        return null;
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    // camera functions
    const takePicture = async (num) => {
        if (cameraRef.current) {
            try {
                console.log(capturedImage1);
                const photo = await cameraRef.current.takePictureAsync();
                console.log(`num1`, num);
                if (photo) {
                    if (num === 1) {
                        setCapturedImage1(photo);
                    } else {
                        setCapturedImage2(photo);
                    }
                }
                // Assuming setStep is a state updater function for your step state
                setStep(step + 1);

            } catch (error) {
                console.error("Error taking picture:", error);
            }
        }
    };

    // picturing CCCD
    const picturingCCCD = (title, num) => {
        return (
            <View style={[styles.dFlex, styles.flexCol, styles.flex1, styles.justifyContentSpaceBetween]}>
                <View>
                    {topNavBar(title, colorStyle.color3, colorStyle.color1)}
                    <Text style={[styles.paddingH2vw, styles.alignSelfCenter, styles.textCenter, componentStyle.fsLight16LineHeight24, { color: colorStyle.colorNeutral3 }]}>Hãy thực hiện xác thực giấy tờ tùy thân để đảm bảo an toàn cho tài khoản của bạn ở mức cao nhất.</Text>
                </View>
                <View style={[styles.w100, styles.positionRelative,]}>
                    <Camera ref={cameraRef} style={[{ aspectRatio: 3 / 4 }]} resizeMode={'cover'} type={type} />
                    <View style={[styles.w100, styles.h25, styles.flex1, styles.positionAbsolute, styles.top0, { backgroundColor: colorStyle.color1, opacity: 0.8 }]}></View>
                    <View style={[styles.w100, styles.h25, styles.flex1, styles.positionAbsolute, styles.bottom0, { backgroundColor: colorStyle.color1, opacity: 0.8 }]}></View>
                </View>
                <TouchableOpacity onPress={() => { takePicture(num) }} style={[styles.alignSelfCenter, styles.marginBottom10vw]}>
                    <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#D9D9D9" fill-opacity="0.5"/><circle cx="40" cy="40" r="30.5" stroke="white"/></svg>`} />
                </TouchableOpacity>
            </View>
        )
    }

    const confirmPicture = (title, num) => {
        console.log('confirm ' + num);
        const photo = num == 1 ? capturedImage1 : capturedImage2;
        return (
            <View style={[styles.dFlex, styles.flexCol, styles.flex1, styles.justifyContentSpaceBetween]}>
                <View>
                    {topNavBar(title, colorStyle.color3, colorStyle.color1)}
                    <Text style={[styles.paddingH2vw, styles.alignSelfCenter, styles.textCenter, componentStyle.fsLight16LineHeight24, { color: colorStyle.colorNeutral3 }]}>Hãy thực hiện xác thực giấy tờ tùy thân để đảm bảo an toàn cho tài khoản của bạn ở mức cao nhất.</Text>
                </View>
                {photo && <Image source={{ uri: photo.uri }} style={[styles.w100vw, styles.h50]} />}
                <View style={styles.marginBottom10vw}>
                    {submitBtnComponent("Chụp lại", colorStyle.color1, 'white', 'white', () => { setStep(step - 1) })}
                    {submitBtnComponent("Dùng ảnh này", 'white', 'white', colorStyle.color1, () => { setStep(step + 1); if (step == 3) { setScreenColor(colorStyle.color3) } })}
                </View>
            </View>
        )
    };

    const confirmPictureInfo = (title) => {
        return (
            <View style={[styles.dFlex, styles.flexCol, styles.flex1, styles.justifyContentSpaceBetween]}>
                <View>
                    {topNavBar(title, colorStyle.color1, colorStyle.color3)}
                </View>
                <View>
                    <Text style={[styles.paddingH2vw, styles.alignSelfCenter, styles.textCenter, componentStyle.fs24BoldLineHeight33, { color: colorStyle.color1 }]}>Bạn đã hoàn thành bước xác minh thông tin cá nhân</Text>
                </View>
                <View style={styles.marginBottom10vw}>
                    <TouchableOpacity
                        onPress={() => { setStep(0); setCapturedImage1(null); setCapturedImage2(null); setScreenColor(colorStyle.color1) }}
                        style={styles.marginBottom4vw}
                    >
                        <Text style={[styles.textCenter, componentStyle.fsLight14LineHeight18, { color: colorStyle.colorBlue }]}>Thông tin chưa chính xác? Chụp lại hình</Text>
                    </TouchableOpacity>
                    {submitBtnComponent("Xong", colorStyle.color1, 'white', 'white', () => { markCCCDonDB(), navigation.navigate('Home') })}
                </View>
            </View>
        );
    }

    const markCCCDonDB = async () => {
        const user = auth.currentUser;
        const db = firestore; 
        const docRef = doc(db, "userList", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const newFields = {
                CCCD: true,
            };
            
            await updateDoc(docRef, newFields);
        } else {
            console.log("CCCDpicture Ln133 No such document!");
        }
    };
    
    const switchStep = () => {
        switch (step) {
            case 0:
                return picturingCCCD("Chụp ảnh mặt trước CCCD", 1);
            case 1:
                return confirmPicture("Chụp ảnh mặt trước CCCD", 1);
            case 2:
                return picturingCCCD("Chụp ảnh mặt sau CCCD", 2);
            case 3:
                return confirmPicture("Chụp ảnh mặt sau CCCD", 2);
            case 4:
                return confirmPictureInfo("Xác nhận thông tin");
            default:
                return picturingCCCD("Chụp ảnh mặt trước CCCD", 1);
        }
    }

    return (
        <SafeAreaView style={[styles.flex1, { backgroundColor: `${screenColor}` }]}>
            <StatusBar
                currentHeight={200}
                animated={true}
                backgroundColor={colorStyle.color1}
                barStyle="dark-content"
                showHideTransition="fade"
                hidden={false}
            />
            {switchStep()}
        </SafeAreaView>
    )
}

export default CCCDpicture