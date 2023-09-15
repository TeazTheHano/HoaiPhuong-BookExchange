import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, SafeAreaView, StatusBar, Image, FlatList, Dimensions, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native';
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
import FirstRingSVG from '../assets/svg/1stRingSVG';

// Import API
import Checkbox from 'expo-checkbox';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { BlurView } from 'expo-blur';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

/**
 * REUSEABLE FUNCTION
 * @returns Trả về thông tin user
 */
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

/**
 * REUSEABLE FUNCTION
 * @returns Trả về danh sách ID sách
 */
const fetchAllBookIDs = async () => {
    try {
        const db = firestore;
        const booksRef = collection(db, "books");
        const querySnapshot = await getDocs(booksRef);

        const bookIds = [];

        querySnapshot.forEach((doc) => {
            bookIds.push(doc.id);
        });

        return bookIds;
    } catch (error) {
        console.error("Error fetching book IDs:", error);
        return [];
    }
};

/**
 * REUSEABLE FUNCTION
 * @param {*} bookId 
 * @returns Trả về dữ liệu của một cuốn sách
 */
const fetchBookData = async (bookId) => {
    try {
        const db = firestore;
        const docRef = doc(db, "books", bookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
    return null;
};

// Function to fetch document IDs by collection name
/**
 * REUSEABLE FUNCTION
 * @param {string} collectionName : Tên của collection trong Firestore
 * @returns trả về mảng ID của các document trong collection
 */
const fetchDocumentIDs = async (collectionName) => {
    try {
        const db = firestore;
        const documentCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(documentCollection);

        const documentIDs = [];

        querySnapshot.forEach((doc) => {
            documentIDs.push(doc.id);
        });

        return documentIDs;
    } catch (error) {
        console.error(`Error fetching ${collectionName} IDs:`, error);
        return [];
    }
};

// Function to fetch document data by ID
/**
 * REUSEABLE FUNCTION
 * @param {string} collectionName : Tên của collection trong Firestore
 * @param {string} documentID : ID của document trong collection
 * @returns trả về object dữ liệu của document
 */
const fetchDocumentData = async (collectionName, documentID) => {
    try {
        const db = firestore;
        const documentRef = doc(db, collectionName, documentID);
        const docSnap = await getDoc(documentRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (error) {
        console.error(`Error fetching ${collectionName} document (${documentID}):`, error);
    }
    return null;
};

/**
 * REUSEABLE FUNCTION
 * @param {string} documentName : Tên của collection trong Firestore
 * @param {Array} objectProperties : Các field cần lấy trong collection
 * @returns trả về mảng object dữ liệu của các document trong collection
 */
const RenderThings = (documentName, objectProperties) => {
    const [DATA, setDATA] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const documentIDs = await fetchDocumentIDs(documentName);
                const docList = {};

                await Promise.all(documentIDs.map(async (documentID) => {
                    const docData = await fetchDocumentData(documentName, documentID);
                    docList[documentID] = docData;
                }));

                const data = Object.keys(docList).map((docID) => {
                    const item = {
                        id: docID,
                    };

                    for (const prop of objectProperties) {
                        if (prop === 'image' || prop === 'avatar') {
                            item[prop] = { uri: `${docList[docID][prop]}` };
                        } else {
                            item[prop] = docList[docID][prop];
                        }
                    }

                    return item;
                });

                setDATA(data);
            } catch (error) {
                console.error(`Error fetching ${documentName} data:`, error);
            }
        };
        fetchData();
    }, [documentName, objectProperties]);

    // Add your toggleBookmark or other functions here if needed

    return {
        DATA,
    };
};

/**
 * dùng ở FeedScreen
 * @param {*} borderRadius 
 * @returns Trả về màn hình slide sách
 */
export const FeedSliceBanner = (borderRadius) => {
    const [DATA, setDATA] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookIds = await fetchAllBookIDs();
                const bookList = {};

                await Promise.all(bookIds.map(async (bookId) => {
                    const bookData = await fetchBookData(bookId);
                    bookList[bookId] = bookData;
                }));

                const data = Object.keys(bookList).map((bookId) => ({
                    id: bookId,
                    title: bookList[bookId].title,
                    text: bookList[bookId].author,
                    image: { uri: `${bookList[bookId].image}` },
                    distance: bookList[bookId].distance,
                    owner: bookList[bookId].owner,
                }));

                setDATA(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const Item = ({ title, text, image, distance, owner }, borderRadius) => (
        <View style={[styles.positionRelative, styles.w90vw, styles.h100, { backgroundColor: 'black', borderRadius: 16 }]}
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

/**
 * dùng ở FeedScreen
 * @param {*} borderRadius 
 * @returns Trả về một danh sách các cuốn sách được hiển thị dưới dạng lưới 2 cột
 */
export const FlatListBook2Col = (borderRadius) => {
    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);
    const [DATA, setDATA] = useState([]);
    const [bookmark, setBookmark] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookIds = await fetchAllBookIDs();
                const bookList = {};

                await Promise.all(bookIds.map(async (bookId) => {
                    const bookData = await fetchBookData(bookId);
                    bookList[bookId] = bookData;
                }));

                const data = Object.keys(bookList).map((bookId) => ({
                    id: bookId,
                    title: bookList[bookId].title,
                    author: bookList[bookId].author,
                    image: { uri: `${bookList[bookId].image}` },
                    distance: bookList[bookId].distance,
                    owner: bookList[bookId].owner,
                    quantity: bookList[bookId].quantity,
                    category: bookList[bookId].category,
                    bookmark: bookList[bookId].bookmark,
                }));

                setDATA(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const toggleBookmark = async (itemId) => {
        try {
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
                            style={[styles.w45vw, styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.gap2vw, styles.paddingV2vw, styles.positionRelative, { backgroundColor: '#F5EFE1', borderRadius: 16, }]}
                        >
                            <Image source={item.image} style={[styles.w40vw, styles.h40vw, styles.alignSelfCenter, { margin: '5%', borderRadius: 10 }]} />
                            <View style={[styles.w90, styles.h20vw, styles.alignSelfCenter, styles.dFlex, styles.flexCol, styles.justifyContentSpaceBetween]}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={[componentStyle.LibreBold18LineHeight20]}>{item.title}</Text>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.fsLight10LineHeight14, { color: '#858585', }]}>{item.category}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Tác giả: {item.author}</Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[componentStyle.LibreNormal10LineHeight14,]}>Số lượng: {item.quantity}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { toggleBookmark(item.id) }} style={[styles.positionAbsolute, styles.padding1vw, { bottom: vw(2), right: vw(2), backgroundColor: '#00000033', borderRadius: 10 }]}>
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
                onPress={() => { setNumberOfItemsToRender(DATA.length) }}
                style={[styles.alignSelfCenter, styles.w60, styles.hAuto, styles.dFlex, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.paddingV4vw, styles.marginTop6vw, { backgroundColor: '#F5EFE1', borderRadius: 16, }]}
            >
                <Text style={[componentStyle.fsLight18LineHeight20]}>Xem thêm</Text>
            </TouchableOpacity>

        </View>
    )
}

export const RenderBook = () => {
    const { DATA } = RenderThings('books', ['title', 'author', 'image', 'distance', 'owner', 'quantity', 'category', 'bookmark']);
    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);

    const toggleBookmark = async (itemId) => {
        try {
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

                        style={[styles.w45vw, styles.dFlex, styles.flexCol, styles.justifyContentCenter, styles.gap2vw, styles.paddingV2vw, styles.positionRelative, { backgroundColor: '#F5EFE1', borderRadius: 8, }]}
                    >
                        <Image source={item.image} style={[styles.w40vw, styles.h40vw, styles.alignSelfCenter, { margin: '5%', borderRadius: 8 }]} />
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


/**
 * dung o FeedScreen
 * @returns Trả về màn hình danh sách các CLB
 */
export const RenderClubList = () => {
    const { DATA } = RenderThings('club', ['title', 'image', 'subtitle', 'memberNumber']);
    const [numberOfItemsToRender, setNumberOfItemsToRender] = useState(4);

    return (
        <View style={[styles.dFlex, styles.flexCol, styles.gap2vw, styles.w100]}>
            {DATA.slice(0, numberOfItemsToRender).map((item) => {
                return (
                    <View key={item.id} style={[styles.w100, styles.padding4vw, { backgroundColor: '#F5EFE1', borderRadius: 16 }]}>
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
                onPress={() => { setNumberOfItemsToRender(DATA.length) }}
                style={[styles.alignSelfCenter, styles.w60, styles.hAuto, styles.dFlex, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.paddingV4vw, styles.marginTop6vw, { backgroundColor: colorStyle.color1, borderRadius: 16, }]}
            >
                <Text style={[componentStyle.fsSemiBold18LineHeight20, { color: colorStyle.color3, }]}>Xem thêm</Text>
            </TouchableOpacity>
        </View>
    )
}

export const MostPeople = () => {

    // soft data by the most of tradeCount
    const { DATA: sortedData } = RenderThings('userList', ['name', 'avatar', 'bookOwnCount', 'bookGiveAwayCount', 'tradeCount']);
    sortedData.sort((a, b) => {
        return b.tradeCount - a.tradeCount;
    }
    );
    return (

        <View style={[styles.dFlex, styles.flexCol, styles.gap2vw, styles.w100]}>
            {sortedData.slice(0, 1).map((item) => {
                return (
                    <View
                        key={item.id}>
                        {FirstRingSVG()}
                        <Image source={item.avatar} style={[styles.w15vw, styles.h15vw, { borderRadius: 1000 }]} />
                    </View>
                )
            })}
            {sortedData.slice(1, 2).map((item) => {
                return (
                    <View
                        key={item.id}>
                        <Image source={item.avatar} style={[styles.w15vw, styles.h15vw, { borderRadius: 1000 }]} />
                    </View>
                )
            })}
            {sortedData.slice(2, 3).map((item) => {
                return (
                    <View
                        key={item.id}>
                        <Image source={item.avatar} style={[styles.w15vw, styles.h15vw, { borderRadius: 1000 }]} />
                    </View>
                )
            })}
        </View>
    )

}

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
        fetchUserData().then((data) => {
            if (data) {
                setUserName(data.name);
                setUserAvatar(data.avatar)
            }
        })
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