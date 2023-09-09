import { StyleSheet } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { useFonts } from 'expo-font';

import {
    LibreBodoni_400Regular,
    LibreBodoni_500Medium,
    LibreBodoni_600SemiBold,
    LibreBodoni_700Bold,
    LibreBodoni_400Regular_Italic,
    LibreBodoni_500Medium_Italic,
    LibreBodoni_600SemiBold_Italic,
    LibreBodoni_700Bold_Italic,
} from '@expo-google-fonts/libre-bodoni';

import {
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light_Italic,
    Nunito_400Regular_Italic,
    Nunito_500Medium_Italic,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black_Italic,
} from '@expo-google-fonts/nunito';

export const useCustomFonts = () => {
    return useFonts({
        LibreBodoni_400Regular,
        LibreBodoni_500Medium,
        LibreBodoni_600SemiBold,
        LibreBodoni_700Bold,
        LibreBodoni_400Regular_Italic,
        LibreBodoni_500Medium_Italic,
        LibreBodoni_600SemiBold_Italic,
        LibreBodoni_700Bold_Italic,
        Nunito_200ExtraLight,
        Nunito_300Light,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
        Nunito_900Black,
        Nunito_200ExtraLight_Italic,
        Nunito_300Light_Italic,
        Nunito_400Regular_Italic,
        Nunito_500Medium_Italic,
        Nunito_600SemiBold_Italic,
        Nunito_700Bold_Italic,
        Nunito_800ExtraBold_Italic,
        Nunito_900Black_Italic,
        'fsThin': require('../assets/fonts/FS-PF-BeauSans-Pro-Thin.ttf'),
        'fsLight': require('../assets/fonts/FS-PF-BeauSans-Pro-Light.ttf'),
        'fsBold': require('../assets/fonts/FS-PF-BeauSans-Pro-Bold.ttf'),
        'fsSemiBold': require('../assets/fonts/FS-PF-BeauSans-Pro-SemiBold.ttf'),
        'fsBlack': require('../assets/fonts/FS-PF-BeauSans-Pro-Black.ttf'),
    });
};

export const colorStyle = StyleSheet.create({
    colorPrimary3: '#A49CF2',
    colorSecondary1: '#FCBC49',
    colorSecondary3: '#EA4E4E',
    colorNeutral1: 'black',
    colorNeutral2: '#A4A4A4',
    colorNeutral3: '#FFFFFF',
    colorText: '#1D2C40',
    color1: '#2F2F2F',
    color2: '#BFA054',
    color3: '#FBF8F2',
    colorTopNav: '#2D81FF',
    colorBlue: '#204B9F',
    colorStroke: '#EAEAEA',
    colorStarAvailable: '#F1C303',
    colorStarUnavailable: '#DAD9D5',
    colorSECCPN: 'rgba(0,0,0,0.1)',
    colorTagHeading: '#204B9F',
});

const componentStyle = StyleSheet.create({
    h1: {
        fontFamily: 'LibreBodoni_700Bold',
        lineHeight: 56,
        color: colorStyle.color1,
        fontSize: 40,
    },

    nunito: {
        fontFamily: 'Nunito_400Regular',
        color: colorStyle.color1,
        fontSize: 20,
        lineHeight: 25,
    },

    LibreBold24LineHeight140: {
        fontFamily: 'LibreBodoni_700Bold',
        fontSize: 24,
        lineHeight: 33,
    },

    LibreBold20LineHeight122: {
        fontFamily: 'LibreBodoni_700Bold',
        fontSize: 20,
        lineHeight: 24,
    },

    LibreBold20LineHeight20: {
        fontFamily: 'LibreBodoni_700Bold',
        fontSize: 20,
        lineHeight: 20,
    },

    LibreBold18LineHeight20: {
        fontFamily: 'LibreBodoni_700Bold',
        fontSize: 18,
        lineHeight: 20,
    },

    LibreNormal14LineHeight16: {
        fontFamily: 'LibreBodoni_400Regular',
        fontSize: 14,
        lineHeight: 16,
    },
        
    LibreNormal10LineHeight14: {
        fontFamily: 'LibreBodoni_400Regular',
        fontSize: 10,
        lineHeight: 14,
    },

    fs24BoldLineHeight33: {
        fontFamily: 'fsBold',
        fontSize: 24,
        lineHeight: 33,
    },

    fsLight16LineHeight24: {
        fontFamily: 'fsLight',
        fontSize: 16,
        lineHeight: 24,
    },

    fsLight16LineHeight16: {
        fontFamily: 'fsLight',
        fontSize: 16,
        lineHeight: 16,
    },
    
    fsBold16LineHeight24: {
        fontFamily: 'fsBold',
        fontSize: 16,
        lineHeight: 24,
    },

    fsLight14LineHeight18: {
        fontFamily: 'fsLight',
        fontSize: 14,
        lineHeight: 18,
    },

    fsLight10LineHeight14: {
        fontFamily: 'fsLight',
        fontSize: 10,
        lineHeight: 14,
    },

    // login/register screen
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: vw(4),
        width: '90%',
        marginLeft: '5%'
    },

    loginInput: {
        backgroundColor: '#EADCBC',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,
        paddingHorizontal: 20,
        width: '100%',
    },

    loginInputText: {
        fontFamily: 'fsLight',
        fontSize: 14,
        lineHeight: 18,
        color: colorStyle.colorText,
        paddingVertical: 16,
        paddingHorizontal: vw(2),
        width: '100%',
        height: '100%',
    },

    submitBtn: {
        borderWidth: 2,
        borderRadius: 10,
        width: '90%',
        marginLeft: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto'
    },

    submitBtnText: {
        fontFamily: 'fsSemiBold',
        fontSize: 18,
        lineHeight: 18,
        paddingVertical: 18,
    },
});

export default componentStyle;