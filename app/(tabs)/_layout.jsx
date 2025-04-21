import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { UserDetailContext } from './../../context/UserDetailContext'
import { auth } from './../../config/firebaseConfig'

export default function Tablayout() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/start/signin');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userDetail) {
    return null;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#268242",
      tabBarInactiveTintColor: "black",
      tabBarStyle: {
         backgroundColor: "#C2FFD4",},
    }}>
      <Tabs.Screen name="home"
        options={{
          tabBarIcon: ({color}) => <Ionicons name="home" size={26} color={color} />,
          tabBarLabel: "Home"
        }}
      />
      
      <Tabs.Screen name="explore"
        options={{
          tabBarIcon: ({color}) => <Ionicons name="search" size={26} color={color} />,
          tabBarLabel: "Search"
        }}
      />

      <Tabs.Screen name="pet"        
        options={{
          tabBarIcon: ({color}) => <MaterialIcons name="pets" size={26} color={color} />,
          tabBarLabel: "Pet"
        }}
      />

      <Tabs.Screen name="leaderboard"
        options={{
          tabBarIcon: ({color}) => <MaterialIcons name="leaderboard" size={26} color={color} />,
          tabBarLabel: "Leaderboard"
        }}
      />

      <Tabs.Screen name="profile"
        options={{
          tabBarIcon: ({color}) => <FontAwesome name="user" size={26} color={color} />,
          tabBarLabel: "Profile"
        }}
      />
    </Tabs>
  )
}