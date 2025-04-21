
import { useFonts } from "expo-font";
import { Stack, Slot } from "expo-router";
import { UserDetailContext } from './../context/UserDetailContext'
import { useState, useEffect } from "react";
import { auth } from './../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './../config/firebaseConfig'
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'lato': require('./../assets/fonts/Lato-Regular.ttf'),
    'lato-bold': require('./../assets/fonts/Lato-Bold.ttf'),
  })

  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true);
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.email));
          if (userDoc.exists()) {
            setUserDetail({
              ...userDoc.data(),
              uid: user.uid,
              email: user.email
            });
          }
        } else {
          setUserDetail(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDetail(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loaded]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Slot />
    </UserDetailContext.Provider>
  )
}