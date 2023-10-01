import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground, ScrollView } from 'react-native'
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

import { FeedScreenFetch, topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView, RenderClubList, MostPeople, testReadingTempData, retrieveData } from './components';

function ClubScreen() {
    const [onChangePlaceholder, setonChangePlaceholder] = React.useState(null);
    const [text, onChangeText] = React.useState('');

    const liveStreamList = () => {
        const Data = [
            {
                id: 1,
                clubName: '5h15',
                clubAvatar: require('../assets/images/placeholder.jpg'),
                title: 'Giao lưu bạn đọc Tháng 7 absbck',
                duration: '1h53p',
                date: '12/07/23',
                status: 'Đang phát',
                image: require('../assets/images/placeholder.jpg'),
            },
            {
                id: 2,
                clubName: 'Luyện thi IELTS 7.5+',
                clubAvatar: require('../assets/images/placeholder.jpg'),
                title: 'Tips độc Writing IELTS',
                duration: '1h53p',
                date: '12/07/23',
                status: 'Phát lại',
                image: require('../assets/images/placeholder.jpg'),
            },
            {
                id: 3,
                clubName: 'NNA fanclub',
                clubAvatar: require('../assets/images/placeholder.jpg'),
                title: 'FM nhà văn Nguyễn Nhật Ánh',
                duration: '1h53p',
                date: '12/07/23',
                status: 'Phát lại',
                image: require('../assets/images/placeholder.jpg'),
            },
        ]

        const Item = ({ item }) => (
            <ImageBackground
                source={item.image}
                borderRadius={vw(4)}
                style={{ width: vw(40), height: vh(10), marginLeft: vw(4), }}
            >
                <View style={[styles.w100, styles.h100, styles.alignSelfCenter, styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween, { paddingVertical: '5%', borderRadius: vw(4), backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.w90, styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.justifyContentSpaceBetween, styles.alignSelfCenter]}>
                        <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter]}>
                            <Image source={item.clubAvatar} style={{ width: vw(4), height: vw(4), borderRadius: 1000, borderWidth: 1, borderColor: componentStyle.color1 }} />
                            <Text numberOfLines={1} style={[styles.overflowHiddenEllipsis, { width: '55%', marginLeft: vw(1), color: 'white', fontFamily: 'LibreBodoni_400Regular', fontSize: vw(2), }]}>{item.clubName}</Text>
                        </View>
                        <Text numberOfLines={1} style={[styles.overflowHiddenEllipsis, { marginRight: vw(1), color: 'white', fontFamily: 'fsLight', fontSize: vw(2), }]}>{item.status}</Text>
                    </View>
                    <View style={[styles.w90, styles.dFlex, styles.flexRow, styles.alignItemsStart, styles.justifyContentSpaceBetween, styles.alignSelfCenter]}>
                        <Text numberOfLines={2} style={[styles.overflowHiddenEllipsis, { width: '65%', color: 'white', fontFamily: 'LibreBodoni_700Bold', fontSize: vw(2), }]}>{item.title}</Text>
                        <View style={[styles.dFlex, styles.flexCol, styles.alignItemsEnd,]}>
                            <Text numberOfLines={1} style={[styles.overflowHiddenEllipsis, { marginRight: vw(1), color: 'white', fontFamily: 'fsLight', fontSize: vw(2), }]}>{item.duration}</Text>
                            <Text numberOfLines={1} style={[styles.overflowHiddenEllipsis, { marginRight: vw(1), color: 'white', fontFamily: 'fsLight', fontSize: vw(2), }]}>{item.date}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );

        return (
            <FlatList
                data={Data}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.id}
                horizontal={true}
            />
        )

    }

    // const clubFilter = () => {
    //     const [selectedId, setSelectedId] = useState(false);
    //     return (
    //         <View style={[styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.alignItemsCenter, styles.marginTop4vw]}>
    //             <TouchableOpacity
    //                 id={1}
    //                 onPress={() => { setSelectedId(!selectedId) }}
    //                 style={{ width: vw(30), padding: vw(2), borderRadius: vw(2), backgroundColor: selectedId ? colorStyle.color1 : null, borderWidth: 1, borderColor: selectedId ? null : colorStyle.colorNeutral2 }}>
    //                 <Text style={{ alignSelf: 'center', color: selectedId ? 'white' : colorStyle.colorNeutral2, fontFamily: 'fsLight', fontSize: vw(4) }}>Nổi bật</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity
    //                 id={2}
    //                 onPress={() => { setSelectedId(!selectedId) }}
    //                 style={{ width: vw(30), padding: vw(2), borderRadius: vw(2), backgroundColor: selectedId ? colorStyle.color1 : null, borderWidth: 1, borderColor: selectedId ? null : colorStyle.colorNeutral2 }}>
    //                 <Text style={{ alignSelf: 'center', color: selectedId ? 'white' : colorStyle.colorNeutral2, fontFamily: 'fsLight', fontSize: vw(4) }}>Đã tham gia</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity
    //                 id={3}
    //                 onPress={() => { setSelectedId(!selectedId) }}
    //                 style={{ width: vw(30), padding: vw(2), borderRadius: vw(2), backgroundColor: selectedId ? colorStyle.color1 : null, borderWidth: 1, borderColor: selectedId ? null : colorStyle.colorNeutral2 }}>
    //                 <Text style={{ alignSelf: 'center', color: selectedId ? 'white' : colorStyle.colorNeutral2, fontFamily: 'fsLight', fontSize: vw(4) }}>Mới nhất</Text>
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }

    const clubFilter = () => {
        const [selectedId, setSelectedId] = useState(null); // Initialize as null

        const Data = [
            {
                id: 1,
                name: 'Nổi bật',
            },
            {
                id: 2,
                name: 'Đã tham gia',
            },
            {
                id: 3,
                name: 'Mới nhất',
            },
        ];

        const Item = ({ item }) => (
            <TouchableOpacity
                onPress={() => {
                    // Toggle the selected state based on the item's id
                    setSelectedId(item.id === selectedId ? null : item.id);
                }}
                style={{
                    width: vw(28),
                    padding: vw(2),
                    marginHorizontal: vw(1),
                    borderRadius: vw(2),
                    backgroundColor: item.id === selectedId ? colorStyle.color1 : null,
                    borderWidth: 1,
                    borderColor: item.id === selectedId ? null : colorStyle.colorNeutral2,
                }}
            >
                <Text
                    style={{
                        alignSelf: 'center',
                        color: item.id === selectedId ? 'white' : colorStyle.colorNeutral2,
                        fontFamily: 'fsLight',
                        fontSize: vw(4),
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );

        return (
            <View>
                <FlatList
                    data={Data}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    style={[styles.marginTop4vw, styles.alignSelfCenter]}
                />
            </View>
        );
    };
    return (
        <SafeAreaView style={[styles.container, styles.flex1, { backgroundColor: colorStyle.color3 }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colorStyle.color3} />
            <View style={[styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.paddingH4vw, styles.w100, styles.alignItemsCenter, styles.paddingBottom4vw, styles.borderRadiusBottom24,]}>
                <Text style={[componentStyle.LibreBold24LineHeight140]}>Bạn đọc</Text>
                <View style={[styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, { borderWidth: 1, borderColor: '#EAEAEA', borderRadius: vw(2), backgroundColor: onChangePlaceholder ? 'white' : `${colorStyle.color3}` }]}>
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
                        placeholderStyle={[componentStyle.LibreBold20LineHeight122, { color: `${colorStyle.colorNeutral2}` }]}
                        style={[{ width: vw(40), borderRadius: vw(2) }, componentStyle.fsLight14LineHeight18, styles.paddingLeft4vw,]} />
                    <TouchableOpacity
                        style={[styles.paddingV1vw, styles.marginRight2vw]}
                        onPress={() => { }}
                    >
                        <SvgXml width={vw(10)} height={vw(10)} xml={`<svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 5L10.5 5M10.5 5C10.5 6.10457 11.3954 7 12.5 7C13.6046 7 14.5 6.10457 14.5 5M10.5 5C10.5 3.89543 11.3954 3 12.5 3C13.6046 3 14.5 3.89543 14.5 5M14.5 5L20.5 5M4.5 12L16.5 12M16.5 12C16.5 13.1046 17.3954 14 18.5 14C19.6046 14 20.5 13.1046 20.5 12C20.5 10.8954 19.6046 10 18.5 10C17.3954 10 16.5 10.8954 16.5 12ZM8.5 19L20.5 19M8.5 19C8.5 17.8954 7.60457 17 6.5 17C5.39543 17 4.5 17.8954 4.5 19C4.5 20.1046 5.39543 21 6.5 21C7.60457 21 8.5 20.1046 8.5 19Z" stroke="#2F2F2F" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round"/></svg>`} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <SvgXml width={vw(12)} height={vw(12)} xml={`<svg width="100%" height="100%" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75 19.7913C6.75 15.6246 14.0417 9.72173 17.1667 7.29118C39.0417 5.20785 39.0417 14.5829 41.125 19.7913C42.7917 23.9579 41.125 29.8607 40.0833 32.2913C40.7778 35.069 42.1667 40.8329 42.1667 41.6663C42.1667 42.7079 32.7917 38.5413 31.75 39.5829C30.7083 40.6246 25.5 41.6663 16.125 38.5413C6.75 35.4163 6.75 24.9996 6.75 19.7913Z" fill="#2F2F2F"/><path d="M32.7917 23.9583H32.8125M24.4583 23.9583H24.4792M16.125 23.9583H16.1458M33.1986 40.0662L40.2973 42.4324C41.926 42.9753 43.4755 41.4259 42.9326 39.7972L40.5663 32.6984M32.3751 39.7918C32.3751 39.7918 29.8431 41.6667 24.4583 41.6667C14.6783 41.6667 6.75 33.7384 6.75 23.9583C6.75 14.1783 14.6783 6.25 24.4583 6.25C34.2384 6.25 42.1667 14.1783 42.1667 23.9583C42.1667 29.1667 40.2917 31.8751 40.2917 31.8751" stroke="#2F2F2F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="17.1667" cy="25.0003" rx="2.08333" ry="2.08333" fill="white"/><circle cx="25.5" cy="25.0003" r="2.08333" fill="white"/><circle cx="33.8333" cy="25.0003" r="2.08333" fill="white"/></svg>`} />
                </TouchableOpacity>
            </View>
            <ScrollView style={[styles.flex1]}>
                <View>
                    <Text style={[componentStyle.fs20BoldLineHeight20, { marginLeft: vw(4), marginVertical: vw(1), color: '#2F2F2F' }]}>Phát trực tiếp</Text>
                    <View>
                        {liveStreamList()}
                    </View>
                </View>
                <View style={[styles.paddingH4vw, styles.marginTop4vw, styles.w100, styles.alignSelfCenter,]}>
                    <Text style={[componentStyle.fs20BoldLineHeight20, { color: '#2F2F2F' }]}>Câu lạc bộ cho “Bạn đọc”</Text>
                    {clubFilter()}
                    <View style={[styles.marginTop4vw]}>
                        {RenderClubList()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ClubScreen;