import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import firebase
import { auth, firestore } from '../firebase'
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';

// Import local Icon
import Svg, { SvgUri, SvgXml } from 'react-native-svg';

// Import API
import Checkbox from 'expo-checkbox';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { BlurView } from 'expo-blur';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

// fecth from Firebase
const fetchUserData = async () => {
    try {
        const user = auth.currentUser;
        const db = firestore;
        const docRef = doc(db, "userList", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
    return null;
};

const fetchAllBookIDs = async () => {
    try {
        const db = firestore;
        const booksRef = collection(db, "books");
        const querySnapshot = await getDocs(booksRef);

        const bookIds = [];

        querySnapshot.forEach((doc) => {
            console.log('50', doc.id, " => ", doc.data());
            bookIds.push(doc.id);
            console.log('52', bookIds);
        });

        return bookIds;
    } catch (error) {
        console.error("Error fetching book IDs:", error);
        return [];
    }
};

const fetchBookData = async (bookId) => {
    try {
        const db = firestore;
        const docRef = doc(db, "books", bookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('69', docSnap.data());
            return docSnap.data();
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
    return null;
};

export const FeedSliceBanner = (borderRadius) => {
    const [bookList, setBookList] = useState({});
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        fetchAllBookIDs().then((bookIds) => {
            const bookList = {};
            bookIds.forEach((bookId) => {
                fetchBookData(bookId).then((bookData) => {
                    bookList[bookId] = bookData;
                    setBookList(bookList);
                    console.log('90', bookList);
                });
            });
        }).then(() => {
            const data = [];
            Object.keys(bookList).forEach((bookId) => {
                data.push({
                    id: bookId,
                    title: bookList[bookId].title,
                    text: bookList[bookId].author,
                    image: { uri: `${bookList[bookId].image}` },
                    distance: bookList[bookId].distance,
                    owner: bookList[bookId].owner,
                });
            });
            console.log('103', data);
            return data;
        }).then((data) => {
            setDATA(data);
            console.log('107', DATA);
        });

    }, []);

    const Item = ({ title, text, image, distance, owner }, borderRadius) => (
        <View style={[styles.positionRelative, styles.w90vw, styles.h100, { backgroundColor: 'black', borderRadius: `${borderRadius}` }]}
        >
            <ImageBackground
                source={image} style={[styles.flex1]}>
                <BlurView intensity={40} style={[styles.positionAbsolute, styles.padding2vw, styles.top4vw, styles.right4vw, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <SvgXml xml={`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 9.33335C7 6.04961 9.33333 4.66669 14 4.66669C18.6667 4.66669 21 6.04961 21 9.33335V22.2668C21 23.3062 19.7433 23.8267 19.0084 23.0917L14.825 18.9083C14.3693 18.4527 13.6307 18.4527 13.175 18.9083L8.99163 23.0917C8.25667 23.8267 7 23.3062 7 22.2668V9.33335Z" stroke="#FBF8F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                </BlurView>
                <BlurView intensity={30} style={[styles.w100, styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.positionAbsolute, styles.bottom0, styles.padding4vw, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}>
                        <Text style={[componentStyle.LibreBold18LineHeight20, { color: 'white' }]}>{title}</Text>
                        <Text style={[componentStyle.LibreNormal14LineHeight16, { color: 'white' }]}>Tác giả: {text}</Text>
                    </View>
                    <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}>
                        <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.gap1vw]}>
                            <SvgXml xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.05 4.04999C6.36282 2.73717 8.14339 1.99963 10 1.99963C11.8566 1.99963 13.6372 2.73717 14.95 4.04999C16.2628 5.36281 17.0004 7.14338 17.0004 8.99999C17.0004 10.8566 16.2628 12.6372 14.95 13.95L10 18.9L5.05 13.95C4.39992 13.3 3.88424 12.5283 3.53241 11.6789C3.18058 10.8296 2.9995 9.9193 2.9995 8.99999C2.9995 8.08068 3.18058 7.17037 3.53241 6.32104C3.88424 5.47172 4.39992 4.70001 5.05 4.04999ZM10 11C10.5304 11 11.0391 10.7893 11.4142 10.4142C11.7893 10.0391 12 9.53042 12 8.99999C12 8.46956 11.7893 7.96085 11.4142 7.58578C11.0391 7.2107 10.5304 6.99999 10 6.99999C9.46957 6.99999 8.96086 7.2107 8.58579 7.58578C8.21072 7.96085 8 8.46956 8 8.99999C8 9.53042 8.21072 10.0391 8.58579 10.4142C8.96086 10.7893 9.46957 11 10 11Z" fill="white"/></svg>`} />
                            <Text style={[componentStyle.LibreNormal14LineHeight16, { color: 'white' }]}>{distance} m</Text>
                        </View>
                        <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.gap1vw]}>
                            <SvgXml xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="white" stroke-width="2"/><path d="M10 5L10 10L14 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                            <Text style={[componentStyle.LibreNormal14LineHeight16, { color: 'white' }]}>{owner}</Text>
                        </View>
                    </View>
                </BlurView>
            </ImageBackground>
        </View>
    );

    return (
        <FlatList
            data={DATA}
            horizontal={true}
            renderItem={({ item }) => <Item title={item.title} text={item.text} image={item.image} distance={item.distance} owner={item.owner} />}
            keyExtractor={item => item.id}
            style={[styles.w100, styles.h100,]}
            borderRadius={borderRadius}
        />
    )
}

export const FlatListBook2Col = (borderRadius) => {
    const [bookList, setBookList] = useState({});
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        fetchAllBookIDs().then((bookIds) => {
            const bookList = {};
            bookIds.forEach((bookId) => {
                fetchBookData(bookId).then((bookData) => {
                    bookList[bookId] = bookData;
                    setBookList(bookList);
                    console.log('90', bookList);
                });
            });
        }).then(() => {
            const data = [];
            Object.keys(bookList).forEach((bookId) => {
                data.push({
                    id: bookId,
                    title: bookList[bookId].title,
                    text: bookList[bookId].author,
                    image: { uri: `${bookList[bookId].image}` },
                    distance: bookList[bookId].distance,
                    owner: bookList[bookId].owner,
                });
            });
            console.log('103', data);
            return data;
        }).then((data) => {
            setDATA(data);
            console.log('107', DATA);
        });

    }, []);

    return (
        <View style={[styles.dFlex, styles.flexRow, styles.gap2vw, styles.flexRow, styles.w90vw, styles.hAuto, styles.alignSelfCenter]}>
            {DATA.map((item) => {
                return (
                    <View
                        key={item.id}
                        style={[styles.w40vw, styles.h80vw, { backgroundColor: '#F5EFE1', borderColor: 'black', borderWidth: 1, borderRadius: `${borderRadius}`, shadowRadius: '20', shadowColor: '#00000033', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0 }, shadowRadius: 20, elevation: 5 }]}
                    >
                        <Image source={item.image} style={[styles.w90, styles.h45, styles.alignSelfCenter, { margin: '5%', borderRadius: `${borderRadius - vw(1)}` }]} />
                        <View>
                            <Text style={[componentStyle.LibreBold18LineHeight20]}>{item.title}</Text>
                            <Text style={[componentStyle.fsLight10LineHeight14, { color: '#858585' }]}>Văn học nước ngoài</Text>
                            <Text style={[componentStyle.fsLight10LineHeight14,]}>{item.text}</Text>
                        </View>
                    </View>
                )
            })
            }
        </View>
    )
}

/**
 * 
 * @param {*} heading : Tiêu đề của thanh điều hướng
 * @returns : Trả về thanh điều hướng không có menu đi kèm
 */
export const topNavBar = (heading, textColor, bgColor) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.w100, styles.marginTop2vh, { backgroundColor: `${bgColor}` }]}>
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

export const avataTopNavBar = (heading, textColor, bgColor, envColor) => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        fetchUserData().then((data) => {
            if (data) {
                setUserName(data.name);
            }
        });
    }, []);

    return (
        <View style={[styles.positionRelative]}>
            <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.justifyContentSpaceBetween, styles.w100, styles.padding4vw, styles.alignSelfCenter, {
                backgroundColor: `${bgColor}`, borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }]}>
                <View style={[styles.dFlex, styles.flexNoWrap, styles.flexRow, styles.gap4vw, styles.alignContentCenter]}>
                    {/* import svg from file */}
                    <Image source={require('../assets/images/avata.png')} style={[{height: vw(15), width: vw(15)}]} />
                    <View style={[styles.dFlex, styles.flexCol, styles.justifyContentCenter]}>
                        <Text style={[componentStyle.LibreBold20LineHeight122, styles.paddingV1vw, { color: `${textColor}` }]}>Chào {userName}</Text>
                        <Text style={[componentStyle.fsLight16LineHeight16, styles.paddingV1vw, { color: `${textColor}` }]}>{heading}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.paddingLeft4vw, styles.paddingV1vw,]}
                    onPress={() => navigation.goBack()}
                >
                    <SvgXml xml={`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 40L15.6667 24.3333L0 18V14.8889L40 0L25.1111 40H22ZM23.4444 31.7778L32.4444 7.55556L8.22222 16.5556L19.1111 20.8889L23.4444 31.7778Z" fill="white"/></svg>`} />
                </TouchableOpacity>
            </View>
            <View style={[styles.positionAbsolute, styles.w100, styles.h100, { backgroundColor: `${envColor}`, zIndex: -1 }]}></View>
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

export const marginBottomForScrollView = () => {
    return (
        <View style={{ height: vh(5), opacity: 0 }}></View>
    )
}
