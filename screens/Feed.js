import React from 'react';
import { View, Text, Button, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, RefreshControl, Image } from 'react-native';
import { auth } from '../firebase'

// import data fetch from firebase custom
import { fetchUserData, fetchAllBookIDs, fetchBookData } from './components';
// import custom components
import { topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView } from './components';
import componentStyle, { colorStyle } from './componentStyleSheet';
import styles from './stylesheet';

import DetailsScreen from './DetailScreen';
import LoadScreen from './LoadScreen';

function categoryFlatList() {
    const DATA = [
        {
            id: '1',
            title: 'Sách adfsasdf giáo khoa',
            image: 'https://picsum.photos/200/300',
        },
        {
            id: '2',
            title: 'Sáchas fasf as giáo khoa',
            image: 'https://picsum.photos/200/300',
        },
        {
            id: '3',
            title: 'Sáchasdf as  giáo khoa',
            image: 'https://picsum.photos/200/300',
        },
        {
            id: '4',
            title: 'Sáchasdf as  giáo khoa',
            image: 'https://picsum.photos/200/300',
        },
        {
            id: '5',
            title: 'Sáchasdf as  giáo khoa',
            image: 'https://picsum.photos/200/300',
        },
        {
            id: '6',
            title: 'Sáchasdf as  giáo khoa',
            image: 'https://picsum.photos/200/300',
        }
    ]

    const Item = ({ title, image }) => (
        <TouchableOpacity style={[styles.marginLeft5vw]}>
            <Image source={{ uri: image }} style={[styles.w20vw, styles.h20vw, { borderRadius: '50%' }]} />
            <Text numberOfLines={2} ellipsizeMode='clip' style={[styles.textCenter, styles.w20vw, { fontFamily: `fsLight`, fontSize: 12 }]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={DATA}
            renderItem={({ item }) => <Item title={item.title} image={item.image} />}
            keyExtractor={item => item.id}
            horizontal={true}
        />)
}

function FeedScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView style={[styles.container, styles.flex1, { backgroundColor: 'black' }]}>
            <StatusBar barStyle="light-content" backgroundColor='black' />
            {avataTopNavBar('Home', colorStyle.color3, 'black', colorStyle.color3)}
            <ScrollView style={[styles.paddingTop4vw, { backgroundColor: colorStyle.color3, }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}>
                    <Text style={[componentStyle.LibreBold24LineHeight140, styles.textCenter]}>Gợi ý cuốn sách gần bạn</Text>
                    {/* slide card */}
                    <View style={[{ backgroundColor: 'gray', borderRadius: 16 }, styles.w90vw, styles.h90vw, styles.alignSelfCenter,]}>
                        {FeedSliceBanner(16)}
                    </View>

                    {/* Most rented book */}
                    <View style={[styles.w90vw, styles.alignSelfCenter, styles.flexCol, styles.gap2vw]}>
                        <Text style={[componentStyle.LibreBold24LineHeight140]}>Sách được mượn nhiều nhất</Text>
                        {FlatListBook2Col(16)}
                    </View>

                    {/* Cataloge */}
                    <View>
                        <Text style={[styles.w90vw, styles.alignSelfCenter, componentStyle.LibreBold24LineHeight140]}>Danh mục đầu sách</Text>
                        {categoryFlatList()}
                    </View>

                    {/* CLB */}
                    <View style={[styles.w90vw, styles.alignSelfCenter, styles.flexCol, styles.gap2vw]}>
                        
                    </View>

                </View>
                {marginBottomForScrollView()}
            </ScrollView>


        </SafeAreaView>
    );
}

export default FeedScreen;