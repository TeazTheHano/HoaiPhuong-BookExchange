import React from 'react';
import { View, Text, Button, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { auth } from '../firebase'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { topNavBar, avataTopNavBar } from './components';
import componentStyle, { colorStyle } from './componentStyleSheet';
import styles from './stylesheet';
import Svg, { SvgUri, SvgXml } from 'react-native-svg';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';

import DetailsScreen from './DetailScreen';
import LoadScreen from './LoadScreen';
import FeedScreen from './Feed';
import BookCategoryScreen from './BookCategoryScreen';
import BookCategoryDetailScreen from './BookCategoryDetailScreen';
import ClubScreen from './ClubScreen';
import ProfileScreen from './ProfileScreen';

function HomeScreen({ navigation }) {
  const Tab = createBottomTabNavigator();

  const tabBarIcon = (iconXml, focused) => {
    const fill = focused ? 'black' : 'none';
    return (
      <SvgXml
        xml={iconXml}
        fill={fill} // Set the fill color based on whether the tab is focused or not
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "black",
        tabBarStyle: [
          {
            display: "flex",
            // paddingTop: vw(4),
            // marginBottom: 0,
            alignContent: "center",
            alignItems: "center",
          },
          null
        ]

      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon(
              `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.12449 8.75013C9.95118 6.92344 11.9914 5.52386 13.3714 4.67622C14.3772 4.05845 15.6218 4.05845 16.6276 4.67622C18.0076 5.52386 20.0478 6.92344 21.8745 8.75013C25.835 12.7106 25.6245 15.0001 25.6245 18.7501C25.6245 20.5124 25.4865 21.9986 25.3401 23.0791C25.1862 24.2159 24.1947 25.0001 23.0476 25.0001H21.2495C19.8688 25.0001 18.7495 23.8808 18.7495 22.5001V20.0001C18.7495 19.0056 18.3544 18.0517 17.6512 17.3485C16.9479 16.6452 15.9941 16.2501 14.9995 16.2501C14.0049 16.2501 13.0511 16.6452 12.3478 17.3485C11.6446 18.0517 11.2495 19.0056 11.2495 20.0001V22.5001C11.2495 23.8808 10.1302 25.0001 8.7495 25.0001H6.95144C5.80427 25.0001 4.81281 24.2159 4.65885 23.0791C4.51253 21.9986 4.3745 20.5124 4.3745 18.7501C4.3745 15.0001 4.164 12.7106 8.12449 8.75013Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              `,
              focused),
        }} />
      <Tab.Screen name="Detail" component={BookCategoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon(
              `<svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.1875 3.75C5.60294 3.75 4.5 4.85294 4.5 8.4375C4.5 12.0221 5.60294 13.125 9.1875 13.125C12.7721 13.125 13.875 12.0221 13.875 8.4375C13.875 4.85294 12.7721 3.75 9.1875 3.75Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.1875 16.875C5.60294 16.875 4.5 17.9779 4.5 21.5625C4.5 25.1471 5.60294 26.25 9.1875 26.25C12.7721 26.25 13.875 25.1471 13.875 21.5625C13.875 17.9779 12.7721 16.875 9.1875 16.875Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.3125 16.875C18.7279 16.875 17.625 17.9779 17.625 21.5625C17.625 25.1471 18.7279 26.25 22.3125 26.25C25.8971 26.25 27 25.1471 27 21.5625C27 17.9779 25.8971 16.875 22.3125 16.875Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.3125 3.75C18.7279 3.75 17.625 4.85294 17.625 8.4375C17.625 12.0221 18.7279 13.125 22.3125 13.125C25.8971 13.125 27 12.0221 27 8.4375C27 4.85294 25.8971 3.75 22.3125 3.75Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              focused),
        }} />
      <Tab.Screen name="Load" component={LoadScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon(
              `<svg width="45" height="45" viewBox="0 0 61 71" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.5 14.871V47.1291M14.371 31H46.629M59.5323 31C59.5323 47.0341 46.5341 60.0323 30.5 60.0323C14.4659 60.0323 1.46774 47.0341 1.46774 31C1.46774 14.966 14.4659 1.96777 30.5 1.96777C46.5341 1.96777 59.5323 14.966 59.5323 31Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              focused),
        }} />
      <Tab.Screen name="Club" component={ClubScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon(
              `<svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 20C5.25 20 6.5 18.75 10.25 18.75C14 18.75 16.5 21.25 20.25 21.25C24 21.25 25.25 20 25.25 20V5C25.25 5 24 6.25 20.25 6.25C16.5 6.25 14 3.75 10.25 3.75C6.5 3.75 5.25 5 5.25 5V26.25" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              focused),
        }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            tabBarIcon(
              `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.875 26.2501H8.125C6.39911 26.2501 5 24.851 5 23.1251C5 18.0242 12.5 18.1251 15 18.1251C17.5 18.1251 25 18.0242 25 23.1251C25 24.851 23.6009 26.2501 21.875 26.2501Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" stroke="#2F2F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              focused),
        }} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
