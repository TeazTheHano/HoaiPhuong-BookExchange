import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import firebase
import { auth, firestore } from '../firebase'
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Import the custom CSS
import styles from './stylesheet';
import componentStyle, { useCustomFonts, colorStyle } from './componentStyleSheet';

// Import local Icon
import Svg, { SvgUri, SvgXml } from 'react-native-svg';
import FirstRingSVG, { top1MostPeople, top2MostPeople, top3MostPeople } from '../assets/svg/1stRingSVG';

// Import API
import Checkbox from 'expo-checkbox';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { BlurView } from 'expo-blur';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tempData from './appTemp';

/**
 * 
 * @returns Trả về thông tin User hiện tại
 */
const fetchUserData = async () => {
    try {
        const user = auth.currentUser;

        if (user) {
            const db = firestore;
            const docRef = doc(db, "userList", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Save data to AsyncStorage
                try {
                    const jsonObject = JSON.parse(docSnap.data());
                    await AsyncStorage.setItem('userData', JSON.stringify());
                    console.log('Data saved successfully.', 'userData', docSnap.data());

                    return docSnap.data();
                } catch (error) {
                    console.error('JSON string is invalid:', error.message);
                }
            }
        } else {
            console.log("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
    return null;
};
// Call the function when you want to fetch user data
fetchUserData();

export const queryCollectionBInsideCollectionA = async (collectionAName, documentAID, collectionBName, objectProperties) => {
    try {
        const db = firestore;
        const docRef = doc(db, collectionAName, documentAID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const collectionB = data[collectionBName];
            const querySnapshot = await getDocs(collectionB);

            const collectionBdata = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const docData = doc.data();
                const item = { id: doc.id };

                for (const prop of objectProperties) {
                    if (prop === 'image' || prop === 'avatar') {
                        if (docData[prop] === null || docData[prop] === undefined || docData[prop] === '') {
                            item[prop] = require('../assets/images/placeholder.jpg');
                        } else {
                            item[prop] = { uri: `${docData[prop]}` };
                        }
                    } else {
                        item[prop] = docData[prop];
                    }
                }

                return item;
            }));

            return collectionBdata; // Return the data from Collection B
        } else {
            console.log("No such document!");
            return null; // Return null if the document doesn't exist
        }
    } catch (error) {
        console.error('Error fetching Collection A.1 data:', error);
        return null;
    }
}



/**
 * Trả về một mảng các object chứa dữ liệu của các đối tượng thuộc Collection yêu cầu
 * @param {string} keyname : tên key của AsyncStorage
 * @param {string} collectionName : tên collection của Firestore
 * @param {string} objectProperties : mảng các thuộc tính của đối tượng
 * @returns : mảng các object chứa dữ liệu của các đối tượng thuộc Collection yêu cầu
 */
export const fetchAndSaveData = async (keyname, collectionName, objectProperties, filterCondition) => {
    try {
        const db = firestore;
        const documentCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(where(documentCollection, ...filterCondition));

        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const docData = doc.data();
            const item = { id: doc.id };

            for (const prop of objectProperties) {
                if (prop === 'image' || prop === 'avatar') {
                    if (docData[prop] === null || docData[prop] === undefined || docData[prop] === '') {
                        item[prop] = require('../assets/images/placeholder.jpg');
                    } else {
                        item[prop] = { uri: `${docData[prop]}` };
                    }
                } else {
                    item[prop] = docData[prop];
                }
            }

            return item;
        }));

        // Save data to AsyncStorage
        const jsonString = JSON.stringify(data);
        if (isValidJson(jsonString)) {
            await AsyncStorage.setItem(keyname, jsonString);
            console.log('fetchAndSaveData() Data saved successfully.', keyname, data);
            return data;
        } else {
            console.error('fetchAndSaveData() Invalid JSON string:', jsonString);
        }
    } catch (error) {
        console.error('fetchAndSaveData() Error fetching and saving data:', error);
    }
}

/**
 * Phục vụ cho hàm fetchAndSaveData() kiểm tra xem chuỗi JSON có hợp lệ hay không
 * @param {*} jsonString 
 * @returns 
 */
function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

export const completeURIforImage = (imageURI) => {
    if (imageURI === null || imageURI === undefined || imageURI === '') {
        return require('../assets/images/placeholder.jpg');
    } else {
        return { uri: `${imageURI}` };
    }
}

/**
 * 
 * @param {string} keyname : tên key của AsyncStorage
 * @returns : lấy dữ liệu từ AsyncStorage
 */
export const retrieveData = async (keyname) => {
    try {
        const value = await AsyncStorage.getItem(keyname);
        if (value !== null) {
            if (isValidJson(value)) {
                console.log(`Retrieved data for keyname ${keyname}:`, value);
                return JSON.parse(value);
            } else {
                console.error(`retrieveData() Invalid JSON string for keyname ${keyname}:`, value);
            }
        } else {
            console.log(`Data not found for keyname ${keyname}.`);
        }
    } catch (error) {
        console.error('retrieveData() Error retrieving data:', error);
    }
}
/** how to use?
const keynamesToRetrieve = ['books', 'clubs', 'userList'];
async function fetchAndDisplayData() {
    for (const keyname of keynamesToRetrieve) {
        const data = await retrieveData(keyname);
        // Use the retrieved data if needed
        console.log(`Retrieved data for keyname ${keyname}:`, data);
    }
}
*/

/**
 * xoá dữ liệu khỏi AsyncStorage
 * @param {string} keyname : tên key của AsyncStorage
 */
async function deleteData(keyname) {
    try {
        await AsyncStorage.removeItem(keyname);
        console.log(`Data for keyname ${keyname} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

/**
 * xoá toàn bộ dữ liệu khỏi AsyncStorage
 */
async function clearAllData() {
    try {
        await AsyncStorage.clear();
        console.log('All data cleared successfully.');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

/**
 * fetch dữ liệu cho màn hình FeedScreen.
 * Hàm tiêu chuẩn cho mọi màn hình để lấy dữ liệu từ Firestore và lưu vào AsyncStorage
 */
export const FeedScreenFetch = () => {
    // Define fetchRequests within the component's scope
    const fetchRequests = [
        {
            keyname: 'books',
            collectionName: 'books',
            objectProperties: ['author', 'bookmark', 'image', 'owner', 'quantity', 'title', 'distance', 'category'],
            filterCondition: []
        },
        {
            keyname: 'clubs',
            collectionName: 'club',
            objectProperties: ['image', 'memberNumber', 'subtitle', 'title'],
            filterCondition: []
        },
        {
            keyname: 'userList',
            collectionName: 'userList',
            objectProperties: ['avatar', 'bookGiveAwayCount', 'bookOwnCount', 'name', 'tradeCount'],
            filterCondition: []
        },
        {
            keyname: 'category',
            collectionName: 'category',
            objectProperties: ['image', 'name',],
            filterCondition: []
        }
    ];

    useEffect(() => {
        async function fetchData() {
            for (const request of fetchRequests) {
                const { keyname, collectionName, objectProperties, filterCondition } = request;
                const data = await fetchAndSaveData(keyname, collectionName, objectProperties, filterCondition);
                // Use the retrieved data if needed
                console.log('Retrieved data:', data);
            }
        }
        fetchData();
    }, []);
}

/**
 * fetch dữ liệu cho màn hình BookCategoryScreen.
 */
export const BookCategoryScreenFetch = () => {
    const fetchRequests = [
        {
            keyname: 'category',
            collectionName: 'category',
            objectProperties: ['image', 'name',],
            filterCondition: []
        }
    ];

    useEffect(() => {
        async function fetchData() {
            for (const request of fetchRequests) {
                const { keyname, collectionName, objectProperties, filterCondition } = request;
                const data = await fetchAndSaveData(keyname, collectionName, objectProperties, filterCondition);
                // Use the retrieved data if needed
                console.log('Retrieved data:', data);
            }
        }
        fetchData();
    }, []);
}


// FEED SCREEN //

/**
 * dùng ở FeedScreen
 * @returns 
 */
export const FeedSliceBanner = () => {
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('books');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

    const Item = ({ id, title, author, image, distance, owner }) => (
        <View key={id} style={[styles.positionRelative, styles.w90vw, styles.h100, { backgroundColor: 'black', borderRadius: vw(4) }]}
        >
            <ImageBackground
                source={image} style={[styles.flex1]}>
                <BlurView intensity={40} style={[styles.positionAbsolute, styles.padding2vw, styles.top4vw, styles.right4vw, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <SvgXml xml={`<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 9.33335C7 6.04961 9.33333 4.66669 14 4.66669C18.6667 4.66669 21 6.04961 21 9.33335V22.2668C21 23.3062 19.7433 23.8267 19.0084 23.0917L14.825 18.9083C14.3693 18.4527 13.6307 18.4527 13.175 18.9083L8.99163 23.0917C8.25667 23.8267 7 23.3062 7 22.2668V9.33335Z" stroke="#FBF8F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`} />
                </BlurView>
                <BlurView intensity={30} style={[styles.w100, styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.positionAbsolute, styles.bottom0, styles.padding4vw, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}>
                        <Text style={[componentStyle.LibreBold18LineHeight20, { color: 'white' }]}>{title}</Text>
                        <Text style={[componentStyle.LibreNormal14LineHeight16, { color: 'white' }]}>Tác giả: {author}</Text>
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
            renderItem={({ item }) => <Item title={item.title} author={item.author} image={item.image} distance={item.distance} owner={item.owner} id={item.id} />}
            keyExtractor={item => item.id}
            style={[styles.w100, styles.h100,]}
            borderRadius={16}
        />
    )
}

/**
 * dùng ở FeedScreen
 * @returns Trả về một danh sách các cuốn sách được hiển thị dưới dạng lưới 2 cột
 */
export const FlatListBook2Col = () => {
    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);
    const [DATA, setDATA] = useState([]);
    const [bookmark, setBookmark] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('books');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

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
                });
            });
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    return (
        <View>
            <View style={[styles.dFlex, styles.flexRow, styles.flexWrap, styles.w100vw, styles.justifyContentSpaceEvenly, styles.hAuto, styles.alignSelfCenter, { rowGap: vw(6) }]}>
                {DATA.slice(0, numberOfItemsToRender).map((item) => {
                    return (
                        <View
                            key={item.id}
                            style={[styles.w45vw, styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.gap2vw, styles.paddingV2vw, styles.positionRelative, { backgroundColor: '#F5EFE1', borderRadius: vw(4), }]}
                        >
                            <Image source={item.image} style={[styles.w40vw, styles.h40vw, styles.alignSelfCenter, { margin: '5%', borderRadius: vw(2.5) }]} />
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
                        </View>
                    )
                })
                }
            </View>

            <TouchableOpacity
                onPress={() => { setNumberOfItemsToRender(numberOfItemsToRender + 10) }}
                style={[styles.alignSelfCenter, styles.w60, styles.hAuto, styles.dFlex, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.paddingV4vw, styles.marginTop6vw, { backgroundColor: '#F5EFE1', borderRadius: vw(4), }]}
            >
                <Text style={[componentStyle.fsLight18LineHeight20]}>Xem thêm</Text>
            </TouchableOpacity>

        </View>
    )
}

export const RenderBook = () => {
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('books');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);
    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);

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
                });
            });
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    return (
        <View style={[styles.dFlex, styles.flexRow, styles.flexWrap, styles.w100vw, styles.justifyContentSpaceEvenly, styles.hAuto, styles.alignSelfCenter, { rowGap: vw(6) }]}>
            {DATA.slice(0, numberOfItemsToRender).map((item) => {
                return (
                    <View

                        key={item.id}

                        style={[styles.w45vw, styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.gap2vw, styles.paddingV2vw, styles.positionRelative, { backgroundColor: '#F5EFE1', borderRadius: vw(2), }]}
                    >
                        <Image source={item.image} style={[styles.w40vw, styles.h40vw, styles.alignSelfCenter, { margin: '5%', borderRadius: vw(2) }]} />
                        <View style={[styles.w90, styles.h20vw, styles.alignSelfCenter, styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween]}>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={[componentStyle.LibreBold18LineHeight20]}>{item.title}</Text>
                            <View>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.fsLight10LineHeight14, { color: '#858585', }]}>{item.category}</Text>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Tác giả: {item.author}</Text>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Số lượng: {item.quantity}</Text>
                            </View>
                        </View>
                    </View>
                )
            })
            }
        </View>
    )
}

export const categoryFlatList = () => {
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

    const Item = ({ name, image }) => (
        <TouchableOpacity style={[styles.marginLeft5vw]}>
            <Image source={image} style={[styles.w20vw, styles.h20vw, { borderRadius: 1000 }]} />
            <Text numberOfLines={2} ellipsizeMode='clip' style={[styles.textCenter, styles.w20vw, styles.fontSize3vw, { fontFamily: `fsLight`, }]}>{name}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={DATA}
            renderItem={({ item }) => <Item name={item.name} image={item.image} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // hide scroll bar
            showsHorizontalScrollIndicator={false}
        />)
}

/**
 * dung o FeedScreen
 * @returns Trả về màn hình danh sách các CLB
 */
export const RenderClubList = () => {
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('clubs');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);

    return (
        <View style={[styles.dFlex, styles.flexCol, styles.gap2vw, styles.w100]}>
            {DATA.slice(0, numberOfItemsToRender).map((item) => {
                return (
                    <View key={item.id} style={[styles.w100, styles.padding4vw, { backgroundColor: '#F5EFE1', borderRadius: vw(4) }]}>
                        <View style={[styles.dFlex, styles.flexRow, styles.gap4vw, styles.w100, styles.alignItemsCenter,]}>
                            <Image source={item.image} style={[styles.w15vw, styles.h15vw, { borderRadius: 1000 }]} />
                            <View style={[styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.flex1,]}>
                                <Text style={[componentStyle.LibreBold20LineHeight122]}>{item.title}</Text>
                                <Text style={[componentStyle.fsLight10LineHeight14, { color: '#816219' }]}>{item.subtitle}</Text>
                            </View>
                        </View>
                        <View style={[styles.dFlex, styles.flexRow, styles.justifyContentSpaceBetween, styles.alignItemsCenter]}>
                            {/* member avt */}
                            <View style={{ width: vw(8), height: vw(8), borderRadius: 1000, backgroundColor: 'blue' }}></View>
                            <View style={[styles.paddingV2vw, styles.paddingH4vw, { backgroundColor: 'black', borderRadius: 1000 }]}>
                                <Text style={[componentStyle.fsBold16LineHeight24, { color: 'white' }]}>{item.memberNumber} thành viên</Text>
                            </View>
                        </View>
                    </View>
                )
            })
            }
            <TouchableOpacity
                onPress={() => { setNumberOfItemsToRender(numberOfItemsToRender + 10) }}
                style={[styles.alignSelfCenter, styles.w60, styles.hAuto, styles.dFlex, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.paddingV4vw, styles.marginTop6vw, { backgroundColor: colorStyle.color1, borderRadius: vw(4), }]}
            >
                <Text style={[componentStyle.fsSemiBold18LineHeight20, { color: colorStyle.color3, }]}>Xem thêm</Text>
            </TouchableOpacity>
        </View>
    )
}

export const MostPeople = () => {
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('userList');
                setDATA(data);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

    const sortedData = DATA.sort((a, b) => {
        return b.tradeCount - a.tradeCount;
    });

    return (
        <View style={[styles.dFlex, styles.flexCol, styles.gap2vw, styles.justifyContentCenter, { backgroundColor: colorStyle.colorSecondary3, paddingTop: vw(8), paddingHorizontal: vw(4), paddingBottom: vw(6), borderTopLeftRadius: vw(12), borderTopRightRadius: vw(12) }]}>
            <Text style={[componentStyle.LibreBold24LineHeight140, styles.textCenter, { color: 'white' }]}>“Bạn sách” thân thiết</Text>
            <Text style={{ fontFamily: 'fsLight', fontSize: vw(3), lineHeight: vw(4), textAlign: 'center', color: 'white' }}>Top “Bạn sách” tích cực hoạt động và sở hữu lượng sách cùng chia sẻ với cộng đồng uy tín và lớn nhất</Text>
            <View style={[styles.dFlex, styles.flexRow, styles.gap2vw, styles.w100, styles.justifyContentSpaceBetween, styles.alignItemsCenter, styles.alignSelfCenter,]}>
                {sortedData.slice(1, 2).map((item) => {
                    return (
                        <View
                            key={item.id} style={[styles.positionRelative, { width: '25%', height: '60%', marginTop: vw(6) }]}>
                            <View style={[styles.w100, styles.h100, styles.positionAbsolute, { top: '-16%', zIndex: -1 }]}>{top2MostPeople()}</View>
                            <Text style={[styles.textCenter, styles.w80, styles.alignSelfCenter, styles.overflowHiddenEllipsis, { fontFamily: 'LibreBodoni_700Bold', color: '#243D5F', fontSize: vw(3), marginTop: vw(1) }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.textCenter, styles.w80, styles.alignSelfCenter, { fontFamily: 'fsLight', color: colorStyle.colorNeutral1, fontSize: vw(1.5), letterSpacing: 2.4 }]}>TOP 2</Text>
                            <Image source={item.avatar} style={[styles.alignSelfCenter, { borderRadius: 1000, width: vw(12), height: vw(12) }]} />
                            <View style={[styles.dFlex, styles.w100, styles.flexRow, styles.justifyContentSpaceEvenly, styles.marginTop4vw]}>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Sở hữu</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.bookOwnCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đầu sách</Text>
                                </View>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đã trao đổi</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.tradeCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Lượt</Text>
                                </View>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đã tặng</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.bookGiveAwayCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đầu sách</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

                {sortedData.slice(0, 1).map((item) => {
                    return (
                        <View key={item.id} style={[styles.positionRelative, { height: vw(55.5), width: vw(40) }]}>
                            <View style={[styles.positionAbsolute, { width: '100%', height: vw(40), top: vw(12.5), zIndex: -1 }]}>
                                {top1MostPeople()}
                            </View>
                            <View style={[styles.positionAbsolute, styles.dFlex, styles.flexCol, styles.gap2vw, styles.w100]}>
                                <View
                                    key={item.id} style={[styles.positionRelative, styles.alignSelfCenter, { height: vw(25), width: '100%' }]}>
                                    {FirstRingSVG()}
                                    <Image source={item.avatar} style={[styles.positionAbsolute, styles.alignSelfCenter, { borderRadius: 1000, width: vw(19), height: vw(19), zIndex: -1, transform: [{ translate: [0, vw(3)] }], }]} />
                                </View>
                                <Text style={[styles.textCenter, componentStyle.LibreBold18LineHeight20, styles.w100, styles.overflowHiddenEllipsis, { color: '#FFDB68', paddingHorizontal: vw(1) }]} numberOfLines={1}>{item.name}</Text>
                                <View style={[styles.dFlex, styles.w100, styles.flexRow, styles.justifyContentSpaceEvenly,]}>
                                    <View>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Sở hữu</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold24LineHeight140]}>{item.bookOwnCount}</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Đầu sách</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Đã trao đổi</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold24LineHeight140]}>{item.tradeCount}</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Lượt</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Đã tặng</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreBold24LineHeight140]}>{item.bookGiveAwayCount}</Text>
                                        <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight8LineHeight10]}>Đầu sách</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    )
                })}

                {sortedData.slice(2, 3).map((item) => {
                    return (
                        <View
                            key={item.id} style={[styles.positionRelative, { width: '25%', height: '60%', marginTop: vw(6) }]}>
                            <View style={[styles.w100, styles.h100, styles.positionAbsolute, { top: '-16%', zIndex: -1 }]}>{top3MostPeople()}</View>
                            <Text style={[styles.textCenter, styles.w80, styles.alignSelfCenter, styles.overflowHiddenEllipsis, { fontFamily: 'LibreBodoni_700Bold', color: '#243D5F', fontSize: vw(3), marginTop: vw(1) }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.textCenter, styles.w80, styles.alignSelfCenter, { fontFamily: 'fsLight', color: colorStyle.colorNeutral1, fontSize: vw(1.5), letterSpacing: 2.4 }]}>TOP 3</Text>
                            <Image source={item.avatar} style={[styles.alignSelfCenter, { borderRadius: 1000, width: vw(12), height: vw(12) }]} />
                            <View style={[styles.dFlex, styles.w100, styles.flexRow, styles.justifyContentSpaceEvenly, styles.marginTop4vw]}>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Sở hữu</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.bookOwnCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đầu sách</Text>
                                </View>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đã trao đổi</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.tradeCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Lượt</Text>
                                </View>
                                <View>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đã tặng</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.LibreNormal14LineHeight16]}>{item.bookGiveAwayCount}</Text>
                                    <Text style={[styles.textCenter, { color: 'white' }, componentStyle.fsLight4LineHeight6]}>Đầu sách</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )

}

// CHUNG //

/**
 * 
 * @param {string} heading : Tiêu đề của thanh điều hướng
 * @param {string} textColor : Màu chữ của thanh điều hướng
 * @param {string} bgColor : Màu nền của thanh điều hướng
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

/**
 * 
 * @param {string} heading : Tiêu đề của thanh điều hướng
 * @param {string} textColor : Màu chữ của thanh điều hướng
 * @param {string} bgColor : Màu nền của thanh điều hướng
 * @param {string} envColor : Màu nền của môi trường
 * @returns 
 */
export const avataTopNavBar = (heading, textColor, bgColor, envColor) => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await retrieveData('userData');
                setUserName(data.name);
                setUserAvatar(data.avatar);
            } catch (error) {
                console.error("Error retriveing data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <View style={[styles.positionRelative]}>
            <View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.justifyContentSpaceBetween, styles.w100, styles.padding4vw, styles.alignSelfCenter, {
                backgroundColor: `${bgColor}`, borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }]}>
                <View style={[styles.dFlex, styles.flexNoWrap, styles.flexRow, styles.gap4vw, styles.alignContentCenter]}>
                    {/* import svg from file */}
                    <Image source={{ uri: userAvatar }} style={[{ height: vw(15), width: vw(15), borderRadius: 1000 }]} />
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

/**
 * 
 * @returns : Căn dưới để không bị menu dưới che phủ
 */
export const marginBottomForScrollView = () => {
    return (
        <View style={{ height: vh(5), opacity: 0 }}></View>
    )
}