import React from 'react';
import { View, Text, Button, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, RefreshControl } from 'react-native';
import { auth } from '../firebase'


import { topNavBar, avataTopNavBar, FeedSliceBanner, FlatListBook2Col, marginBottomForScrollView } from './components';
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
                    </View>

                    {FlatListBook2Col(16)}
                </View>
                {marginBottomForScrollView()}
            </ScrollView>

                
        </SafeAreaView>
    );
}

export default FeedScreen;