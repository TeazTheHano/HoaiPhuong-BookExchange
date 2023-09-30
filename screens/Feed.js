import React, { useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, RefreshControl, Image } from 'react-native';
import { auth } from '../firebase'
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

// import data fetch from firebase custom
import { fetchUserData, fetchAllBookIDs, fetchBookData } from './components';
// import custom components
import {FeedScreenFetch, topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView, RenderClubList, MostPeople, testReadingTempData, categoryFlatList } from './components';
import componentStyle, { colorStyle } from './componentStyleSheet';
import styles from './stylesheet';

import DetailsScreen from './DetailScreen';
import LoadScreen from './LoadScreen';

function FeedScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    FeedScreenFetch()

    return (
        <SafeAreaView style={[styles.container, styles.flex1, { backgroundColor: 'black' }]}>
            <StatusBar barStyle="light-content" backgroundColor='black' />
            {avataTopNavBar('Home', colorStyle.color3, 'black', colorStyle.color3)}
            <ScrollView style={[styles.paddingTop4vw, { backgroundColor: colorStyle.color3,}]}
                // hide scroll bar
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={[styles.dFlex, styles.flexCol, styles.gap2vw]}>
                    <Text style={[componentStyle.LibreBold24LineHeight140, styles.textCenter]}>Gợi ý cuốn sách gần bạn</Text>
                    {/* slide card */}
                    <View style={[{ backgroundColor: 'gray', borderRadius: vw(4) }, styles.w90vw, styles.h90vw, styles.alignSelfCenter,]}>
                        {FeedSliceBanner()}
                    </View>

                    {/* Most rented book */}
                    <View style={[styles.w90vw, styles.alignSelfCenter, styles.flexCol, styles.gap2vw]}>
                        <Text style={[componentStyle.LibreBold24LineHeight140]}>Sách được mượn nhiều nhất</Text>
                        {FlatListBook2Col()}
                    </View>

                    {/* Cataloge */}
                    <View>
                        <Text style={[styles.w90vw, styles.alignSelfCenter, componentStyle.LibreBold24LineHeight140]}>Danh mục đầu sách</Text>
                        {categoryFlatList()}
                    </View>

                    {/* CLB */}
                    <View style={[styles.w90vw, styles.alignSelfCenter, styles.flexCol, styles.gap2vw]}>
                        {RenderClubList()}
                    </View>
                        {MostPeople()}


                </View>
            </ScrollView>


        </SafeAreaView>
    );
}

export default FeedScreen;