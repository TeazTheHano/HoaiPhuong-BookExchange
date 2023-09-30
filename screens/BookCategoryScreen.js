import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground, ScrollView, RefreshControl, Keyboard } from 'react-native'
import { useNavigatio, NavigationContainer } from '@react-navigation/native';
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

import { BookCategoryScreenFetch, topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView, RenderClubList, MostPeople, testReadingTempData, retrieveData } from './components';


function BookCategoryScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState('');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    BookCategoryScreenFetch()

    const [DATA, setDATA] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('category');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

    const searchingTopNavBar = (heading, textColor, bgColor, envColor) => {
        const [text, onChangeText] = React.useState('');
        const [onChangePlaceholder, setonChangePlaceholder] = React.useState(null);
        return (
            <View>
                <View style={[styles.dFlex, styles.flexCol, styles.alignItemsCenter, styles.w100, styles.paddingH4vw, { backgroundColor: `${bgColor}`, paddingBottom: vw(4), borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4),}]}>
                    <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.justifyContentSpaceBetween, styles.w100,]}>
                        <Text style={[styles.w80, componentStyle.LibreBold20LineHeight122, styles.paddingV1vw, { color: `${textColor}` }]}>{heading}</Text>
                        <TouchableOpacity
                            style={[styles.paddingV1vw,]}
                            onPress={() => { navigation.goBack() }}
                        >
                            <SvgXml width={vw(10)} height={vw(10)} xml={`<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 40L15.6667 24.3333L0 18V14.8889L40 0L25.1111 40H22ZM23.4444 31.7778L32.4444 7.55556L8.22222 16.5556L19.1111 20.8889L23.4444 31.7778Z" fill="white"/></svg>`} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.w100,]}>
                        <TouchableOpacity
                            style={[styles.paddingV1vw,]}
                            onPress={() => { }}
                        >
                            <SvgXml width={vw(10)} height={vw(10)} xml={`<svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.66667 8.33333L16.6667 8.33333M16.6667 8.33333C16.6667 10.1743 18.1591 11.6667 20 11.6667C21.841 11.6667 23.3333 10.1743 23.3333 8.33333M16.6667 8.33333C16.6667 6.49239 18.1591 5 20 5C21.841 5 23.3333 6.49238 23.3333 8.33333M23.3333 8.33333L33.3333 8.33333M6.66667 20L26.6667 20M26.6667 20C26.6667 21.841 28.1591 23.3333 30 23.3333C31.841 23.3333 33.3333 21.8409 33.3333 20C33.3333 18.1591 31.841 16.6667 30 16.6667C28.1591 16.6667 26.6667 18.1591 26.6667 20ZM13.3333 31.6667L33.3333 31.6667M13.3333 31.6667C13.3333 29.8257 11.841 28.3333 10 28.3333C8.15906 28.3333 6.66667 29.8257 6.66667 31.6667C6.66667 33.5076 8.15906 35 10 35C11.841 35 13.3333 33.5076 13.3333 31.6667Z" stroke="#FBF8F2" stroke-width="1.5" stroke-linecap="round"/></svg>`} />
                        </TouchableOpacity>
                        <TextInput
                            onChangeText={onChangeText}
                            keyboardType='default'
                            // change color of placeholder when focus
                            // onFocus={() => { keyboardStatus == 'Keyboard Shown' ? null : setKeyboardStatus('Keyboard Shown') }}
                            onFocus={() => { setonChangePlaceholder(true) }}
                            value={text}
                            editable
                            numberOfLines={1}
                            multiline={false}
                            placeholder=' Tìm kiếm'
                            placeholderTextColor={`${colorStyle.colorNeutral2}`}
                            placeholderStyle={[componentStyle.LibreBold20LineHeight122, styles.paddingV1vw, { color: `${colorStyle.colorNeutral2}` }]}
                            style={[{ width: vw(78), borderRadius: vw(2) }, componentStyle.fsLight14LineHeight18, styles.paddingLeft4vw, { backgroundColor: onChangePlaceholder ? 'white' : `${colorStyle.color3}` }]} />
                    </View>
                </View>
                <View style={[styles.positionAbsolute, styles.w100, styles.h100, { backgroundColor: `${envColor}`, zIndex: -10 }]}></View>
            </View>
        )
    }

    const renderItem = () => {
        return (
            <View style={[styles.w100, styles.dFlex, styles.flexRow, styles.flexWrap, styles.rowGap6vw, styles.justifyContentSpaceAround,]}>
                {DATA.map((item) => {
                    return (
                        <TouchableOpacity
                            id={item.id}
                            key={item.id}
                            style={[styles.positionRelative, styles.dFlex, styles.flexCol, styles.justifyContentCenter, { backgroundColor: `${colorStyle.color3}`, width: vw(44), height: vw(36), borderRadius: vw(3), }]}
                            onPress={() => { navigation.navigate('BookCategoryDetail', { itemId: item.id }) }}
                        >

                            <View style={[styles.w100, styles.h100, styles.positionAbsolute, { borderRadius: vw(3), }]}>
                                <View style={[styles.w100, styles.h100, styles.positionAbsolute, { borderRadius: vw(3), backgroundColor: 'rgba(0,0,0,0.5)', zIndex: -1 }]}></View>
                                <Image
                                    source={item.image}
                                    style={[styles.w100, styles.h100, styles.positionAbsolute, { borderRadius: vw(3), zIndex: -2 }]}
                                />
                            </View>

                            <Text style={[componentStyle.fs22NormalLineHeight25, styles.alignSelfCenter, styles.textCenter, { color: 'white' }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.container, styles.flex1, { backgroundColor: 'black' }]}>
            <StatusBar barStyle="light-content" backgroundColor='black' />
            {searchingTopNavBar('Danh mục sách', colorStyle.color3, 'black', colorStyle.color3)}
            <ScrollView style={[styles.paddingTop4vw, { backgroundColor: colorStyle.color3, }]}
                // hide scroll bar
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}></View>
                {renderItem()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookCategoryScreen;