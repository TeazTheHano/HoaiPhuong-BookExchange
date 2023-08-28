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

/**
 * 
 * @param {*} heading : Tiêu đề của thanh điều hướng
 * @returns : Trả về thanh điều hướng không có menu đi kèm
 */
export const topNavBar = (heading, textColor, bgColor) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.w100, styles.marginTop2vh, {backgroundColor: `${bgColor}`}]}>
            <TouchableOpacity
                style={[styles.paddingLeft4vw, styles.paddingV1vw,]}
                onPress={() => navigation.goBack()}
            >
                <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M22.5 30L10.5 18L22.5 6" stroke="${textColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
            </TouchableOpacity>
            <Text style={[styles.w80, componentStyle.LibreBold20LineHeight122, styles.paddingV1vw, { color: `${textColor}` }]}>{heading}</Text>
        </View>
    )
}


/**
 * submitBtnComponen: Tạo các nút nhấn có giao diện như submit
 * @param {*} title : Tiêu đề của nút nhấn
 * @param {*} onPress : Hàm xử lý khi nhấn nút
 * @param {*} bgColor : Màu nền của nút
 * @param {*} borderColor : Màu viền của nút
 * @param {*} textColor : Màu chữ của nút
 * @returns : Trả về một nút nhấn có giao diện như submit
 */
export const submitBtnComponent = (title, bgColor, borderColor, textColor, onPress) => {
    if (onPress === undefined) {
        onPress = function () { }
    }
    return (
        <TouchableOpacity
            style={[componentStyle.submitBtn, styles.marginBottom4vw, { backgroundColor: `${bgColor}` }, { borderColor: `${borderColor}` }]}
            onPress={onPress}
        >
            <Text style={[componentStyle.submitBtnText, { color: `${textColor}` }]}>{title}</Text>
        </TouchableOpacity>
    )
}