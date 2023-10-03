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

import { FeedScreenFetch, topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView, RenderClubList, MostPeople, testReadingTempData, retrieveData, completeURIforImage } from './components';

function ProfileScreen() {
    const navigation = useNavigation();
    const [profileData, setprofileData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await retrieveData('userData');
            setprofileData(data);
            console.log(data);
        }
        fetchData();
    }, []);

    const gatheringNotiAndRequestData = (notificationData, myRequestData, setToRenderNotiData, setToRenderMyRequestData) => {
        if (notificationData.some(notification => notification.status === 'pending')) {
            const pendingNotifications = notificationData.filter(notification => notification.status === 'pending');
            // sort it by date
            pendingNotifications.sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
            setToRenderNotiData(pendingNotifications);
            console.log(pendingNotifications);
        }
        if (myRequestData.some(notification => notification.status === 'pending')) {
            const pendingNotifications = myRequestData.filter(notification => notification.status === 'pending');
            // sort it by date
            pendingNotifications.sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
            setToRenderMyRequestData(pendingNotifications);
            console.log(pendingNotifications);
        }
    };

    const notificationProfileScreen = () => {
        const [toRenderNotiData, setToRenderNotiData] = useState([]);
        const [toRenderMyRequestData, setToRenderMyRequestData] = useState([]);

        // gather the name and avatar of the sender with the senderId


        // const notificationData = 

        const notificationData = [
            {
                bookId: "nWXvDDAwGrHSQgcmQESL",
                bookType: "trade",
                message: "Xin chào, tôi muốn muốn mượn cuốn sách của bạn",
                receiderID: "Hf2WWGnALicR70ZqE6TIZjfgObt2",
                senderAvatar: "https://i.pinimg.com/originals/47/b2/7e/47b27e888b015a48bf15baa6cf9c09f0.jpg",
                senderId: "gHT3PcCfdmOnT30399VIbBqjiF02",
                senderName: "Test5",
                time: "October 2, 2023 at 12:00:00 AM UTC+ 7",
                type: "pending"
            }
        ];

        const myRequestData = [
            {
                id: 5,
                senderId: 'user2',
                receiderID: 'user6',
                type: 'trade',
                status: 'pending',
                bookId: 'book5',
                bookType: 'trade',
                time: '2021-09-30T12:00:00',
                message: 'Xin chào, tôi muốn muốn mượn cuốn sách của bạn',
            }
        ];

        useEffect(() => {
            gatheringNotiAndRequestData(notificationData, myRequestData, setToRenderNotiData, setToRenderMyRequestData);
        }, []);

        const Item = ({ item }) => {
            return (
                <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.gap1vw, styles.marginBottom4vw,]}>
                    <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.gap1vw]}>
                        <Image source={completeURIforImage()} style={[styles.alignSelfCenter, { width: vw(10), height: vw(10), borderRadius: 1000, borderWidth: vw(0.5), borderColor: colorStyle.colorTopNav }]} />
                        <View style={[styles.dFlex, styles.flexCol, styles.gap1vw]}>
                            <Text style={[componentStyle.fsLight16LineHeight16, { color: colorStyle.colorTagHeading }]}>{profileData?.name}</Text>
                            <Text style={[componentStyle.fsLight16LineHeight16]}>{item.message}</Text>

                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View>
                <Text>Đề xuất trao đổi từ bạn sách</Text>
                <FlatList
                    data={toRenderNotiData}
                    renderItem={Item}
                    keyExtractor={item => item.id}
                />
                <Text>Đề xuất của bạn (chờ xác nhận)</Text>
                <FlatList
                    data={toRenderMyRequestData}
                    renderItem={Item}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    };

    return (
        <SafeAreaView style={[styles.container, styles.flex1, { backgroundColor: colorStyle.colorTopNav }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colorStyle.colorTopNav} />
            {avataTopNavBar('Thông tin cá nhân của bạn', 'white', colorStyle.colorTopNav, colorStyle.color3)}
            <ScrollView showsVerticalScrollIndicator={false} style={[styles.flex1, { backgroundColor: colorStyle.color3 }]}>
                <View style={[styles.dFlex, styles.flexCol, styles.gap2vw, styles.marginTop4vw, styles.alignItemsCenter]}>
                    <Image source={{ uri: profileData?.avatar }} style={[styles.alignSelfCenter, { width: vw(22), height: vw(22), borderRadius: 1000, borderWidth: vw(0.5), borderColor: colorStyle.colorTopNav }]} />
                    <Text style={[styles.alignSelfCenter, componentStyle.LibreBold18LineHeight20]}>{profileData?.name}</Text>
                    <Text style={[styles.alignSelfCenter, componentStyle.fsLight14, { color: colorStyle.colorTopNav }]}>{profileData?.email}</Text>
                    <View style={[styles.dFlex, styles.w90, styles.flexRow, styles.justifyContentSpaceBetween, styles.paddingV4vw, styles.paddingH8vw, styles.marginTop4vw, { backgroundColor: '#385AD3', borderRadius: vw(5) }]}>
                        <View>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Sở hữu</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold32]}>{profileData?.bookOwnCount}</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Đầu sách</Text>
                        </View>
                        <View>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Đã trao đổi</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold32]}>{profileData?.tradeCount}</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Lượt</Text>
                        </View>
                        <View>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Đã tặng</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold32]}>{profileData?.bookGiveAwayCount}</Text>
                            <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fs12NormalLineHeight12]}>Đầu sách</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.w90, styles.alignSelfCenter, styles.marginVertical4vw]}>
                    <View style={[styles.dFlex, styles.flexRow, styles.gap1vw, styles.alignItemsCenter]}>
                        <SvgXml xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" fill="#204B9F"/><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#204B9F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                        <Text style={[componentStyle.fsLight16LineHeight16, { color: colorStyle.colorTagHeading }]}>Tham gia:</Text>
                        <Text style={[componentStyle.fsLight16LineHeight16]}>11/06/2020 (3 nam)</Text>
                    </View>
                    <View style={[styles.dFlex, styles.flexRow, styles.gap1vw, styles.alignItemsCenter]}>
                        <SvgXml xml={`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.66667 22.7506H17.3333M13 22.7506V18.4173M13 18.4173C10.0085 18.4173 7.58333 15.9922 7.58333 13.0007V6.50065M13 18.4173C15.9915 18.4173 18.4167 15.9922 18.4167 13.0007V6.50065M18.4167 6.50065C18.4167 5.30403 17.4466 4.33398 16.25 4.33398H9.75C8.55338 4.33398 7.58333 5.30403 7.58333 6.50065M18.4167 6.50065H20.0417C21.5374 6.50065 22.75 7.71321 22.75 9.20898C22.75 10.7048 21.5374 11.9173 20.0417 11.9173H18.4167M7.58333 6.50065H5.95833C4.46256 6.50065 3.25 7.71321 3.25 9.20898C3.25 10.7048 4.46256 11.9173 5.95833 11.9173H7.58333" stroke="#204B9F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                        <Text style={[componentStyle.fsLight16LineHeight16, { color: colorStyle.colorTagHeading }]}>Nhận danh hiệu:</Text>
                        <Text style={[componentStyle.fsLight16LineHeight16]}>Bạn sách nổi bật tháng 7</Text>
                    </View>
                    <View style={[styles.dFlex, styles.flexRow, styles.gap1vw, styles.alignItemsCenter]}>
                        <SvgXml xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8L4.44293 16.6576C4.76439 18.5863 6.43315 20 8.38851 20H15.6115C17.5668 20 19.2356 18.5863 19.5571 16.6576L21 8M3 8L6.75598 11.0731C7.68373 11.8321 9.06623 11.6102 9.70978 10.5989L12 7M3 8C3.82843 8 4.5 7.32843 4.5 6.5C4.5 5.67157 3.82843 5 3 5C2.17157 5 1.5 5.67157 1.5 6.5C1.5 7.32843 2.17157 8 3 8ZM21 8L17.244 11.0731C16.3163 11.8321 14.9338 11.6102 14.2902 10.5989L12 7M21 8C21.8284 8 22.5 7.32843 22.5 6.5C22.5 5.67157 21.8284 5 21 5C20.1716 5 19.5 5.67157 19.5 6.5C19.5 7.32843 20.1716 8 21 8ZM12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7Z" stroke="#204B9F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                        <Text style={[componentStyle.fsLight16LineHeight16, { color: colorStyle.colorTagHeading }]}>Quản trị viên câu lạc bộ:</Text>
                        <Text style={[componentStyle.fsLight16LineHeight16]}>Câu lạc bộ sách HANU</Text>
                    </View>
                </View>
                <View style={[styles.w90, styles.alignSelfCenter, styles.marginVertical4vw]}>

                </View>
                {notificationProfileScreen()}
                {marginBottomForScrollView()}
            </ScrollView>
        </SafeAreaView>

    )
}

export default ProfileScreen;