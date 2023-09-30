import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';

// Import local Icon
import Svg, { SvgUri, SvgXml } from 'react-native-svg';
import { } from '../assets/svg/1stRingSVG';

// Import API
import { BlurView } from 'expo-blur';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

import {FeedScreenFetch, topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView, RenderClubList, MostPeople, testReadingTempData, retrieveData } from './components';

function ProfileScreen() {
    
    return (
        <View>
            <Text>ProfileScreen</Text>
        </View>
    )
}

export default ProfileScreen;