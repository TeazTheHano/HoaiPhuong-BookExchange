import { StyleSheet } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import {
    useFonts,
    LibreBodoni_400Regular,
    LibreBodoni_500Medium,
    LibreBodoni_600SemiBold,
    LibreBodoni_700Bold,
    LibreBodoni_400Regular_Italic,
    LibreBodoni_500Medium_Italic,
    LibreBodoni_600SemiBold_Italic,
    LibreBodoni_700Bold_Italic,
} from '@expo-google-fonts/libre-bodoni';

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
    });
};

export default StyleSheet.create({
    w100: {
        width: '100%',
    },

    w100vw: {
        width: vw(100),
    },

    h100: {
        height: '100%',
    },

    h100vh: {
        height: vh(100),
    },

    h1: {
        fontFamily: 'LibreBodoni_700Bold',
        lineHeight: 56,
        color: '#2F2F2F',
        fontSize: 40,
    },

    background: {
        backgroundColor: 'yellow',
    },

    textCenter: {   
        textAlign: 'center',
    },

});
