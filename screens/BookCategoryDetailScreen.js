import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground, ScrollView, RefreshControl, Keyboard } from 'react-native'
import { useNavigatio, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import firebase
import { auth, firestore } from '../firebase'
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';

// Import local Icon
import Svg, { SvgUri, SvgXml } from 'react-native-svg';
import { } from '../assets/svg/1stRingSVG';

// Import API
import { BlurView } from 'expo-blur';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

import { queryCollectionBInsideCollectionA, marginBottomForScrollView, completeURIforImage, toggleBookmark, retrieveData } from './components';

function BookCategoryDetailScreen({ route, navigation }) {
    const { itemId } = route.params;
    const [DATA, setDATA] = useState([]);
    const [categoryName, setCategoryName] = useState('')
    const [bookId, setBookId] = useState([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const db = firestore;
                const docRef = doc(db, "category", itemId);
                const docSnap = await getDoc(docRef);
                const cateName = docSnap.data();
                setCategoryName(cateName.name);

                const querySnapshot = await getDocs(collection(db, "category", itemId, "contain"));
                const { docs } = querySnapshot;
                const data = docs.map(doc => doc.data());
                const id = docs.map(doc => doc.id);

                // filter book isContain === true
                const data3 = data.map((book, index) => ({
                    id: id[index],
                    ...book
                })).filter(book => book.isContain === true);

                console.log(data3);

                // loop through bookId to get book data
                const bookData = [];
                for (let i = 0; i < data3.length; i++) {
                    const docRef = doc(db, "books", data3[i].id);
                    const docSnap = await getDoc(docRef);
                    const book = docSnap.data();
                    // add id to book
                    book.id = data3[i].id;
                    bookData.push(book);
                }
                setBookId(bookId);
                setDATA(bookData);
            }
            fetchData()
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    }, [itemId]);

    const searchingTopNavBar = (heading, textColor, bgColor, envColor) => {
        const [text, onChangeText] = React.useState('');
        const [onChangePlaceholder, setonChangePlaceholder] = React.useState(null);
        return (
            <View>
                <View style={[styles.dFlex, styles.flexCol, styles.alignItemsCenter, styles.w100, styles.paddingH4vw, { backgroundColor: `${bgColor}`, paddingBottom: vw(4), borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4), }]}>
                    <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.justifyContentSpaceBetween, styles.w100,]}>
                        <TouchableOpacity
                            style={[styles.paddingV1vw,]}
                            onPress={() => navigation.goBack()}
                        >
                            <SvgXml width={vw(10)} height={vw(10)} xml={`<svg width="100%" height="100%" viewBox="0 0 36 36" fill="none"><path d="M22.5 30L10.5 18L22.5 6" stroke="${textColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                        </TouchableOpacity>
                        <Text numberOfLines={1} style={[styles.w60, componentStyle.LibreBold20LineHeight122, styles.paddingV1vw, styles.overflowHiddenEllipsis, { color: `${textColor}` }]}>{categoryName}</Text>
                        <TouchableOpacity
                            style={[styles.paddingV1vw,]}
                            onPress={() => { }}
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
        const [bookmark, setBookmark] = useState(false);
        const toggleBookmark = async (itemId) => {
            try {
                // change it in local
                setBookmark(!bookmark);

                const bookRef = doc(firestore, 'books', itemId); // Assuming 'books' is your Firestore collection

                // Get the current bookmark state from Firestore
                const docSnapshot = await getDoc(bookRef);
                const currentBookmarkState = docSnapshot.data().bookmark;

                // Update the bookmark state by toggling it
                await updateDoc(bookRef, {
                    bookmark: !currentBookmarkState,
                });

                // Update the local state (DATA) to reflect the change
                setDATA((prevData) => {
                    return prevData.map((item) => {
                        if (item.id === itemId) {
                            return { ...item, bookmark: !currentBookmarkState };
                        }
                        return item;
                    }
                    );
                });
            } catch (error) {
                console.error('Error toggling bookmark:', error);
            }
        };
        return (
            <View style={[styles.w100, styles.dFlex, styles.flexRow, styles.flexWrap, styles.rowGap6vw, styles.justifyContentSpaceAround,]}>
                {DATA.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.w45vw, styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.gap2vw, styles.paddingV2vw, styles.positionRelative, { backgroundColor: '#F5EFE1', borderRadius: vw(4), }]}
                        >
                            <Image source={completeURIforImage(item.image)} style={[styles.w40vw, styles.h40vw, styles.alignSelfCenter, { margin: '5%', borderRadius: vw(2.5) }]} />
                            <View style={[styles.w90, styles.h20vw, styles.alignSelfCenter, styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween]}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={[componentStyle.LibreBold18LineHeight20]}>{item.title}</Text>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.fsLight10LineHeight14, { color: '#858585', }]}>{item.category}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Tác giả: {item.author}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Số lượng: {item.quantity}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { toggleBookmark(item.id) }} style={[styles.positionAbsolute, styles.padding1vw, { bottom: vw(2), right: vw(2), backgroundColor: '#00000033', borderRadius: vw(2.5) }]}>
                                <SvgXml fill={
                                    item.bookmark ? `black` : `none`
                                } xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8C6 5.18536 8 4 12 4C16 4 18 5.18537 18 8V19.0858C18 19.9767 16.9229 20.4229 16.2929 19.7929L12.7071 16.2071C12.3166 15.8166 11.6834 15.8166 11.2929 16.2071L7.70711 19.7929C7.07714 20.4229 6 19.9767 6 19.0858V8Z" stroke="#2F2F2F" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                            </TouchableOpacity>
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
            >
                <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}></View>
                {renderItem()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookCategoryDetailScreen