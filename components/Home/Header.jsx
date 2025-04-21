
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import Colors from './../../constant/Colors';
import * as Progress from 'react-native-progress';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

export default function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const width = Dimensions.get('screen').width;

    const db = getFirestore();
    const userRef = userDetail?.email ? doc(db, 'users', userDetail.email) : null; 

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userRef) return;
            try {
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserDetail({
                        ...userData,
                        level: userData.level || 1,
                        cash: userData.cash || 0,                        point: Math.max(0, userData.point || 0),
                        maxPoints: userData.maxPoints || 300,
                        lastConvertedPoints: userData.lastConvertedPoints || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


            
    useEffect(() => {
        const updateUserLevelInDatabase = async () => {
            if (!userDetail || !userRef) return;      

            // Ensure level is at least 1
            const currentLevel = Math.max(1, userDetail.level || 1);
            const maxPoints = currentLevel === 1 ? 300 : 300 + (currentLevel - 1) * 500;
            const points = Math.max(0, userDetail.point || 0); // Ensure points is never negative
           
            const lastConvertedPoints = userDetail.lastConvertedPoints || 0;
            const newPointsToConvert = points - lastConvertedPoints;

            if (newPointsToConvert >= 50) {
                const additionalCash = Math.floor(newPointsToConvert / 50) * 10;
                const currentCash = userDetail.cash || 0;
                const newCash = currentCash + additionalCash;
                const newLastConverted = lastConvertedPoints + (Math.floor(newPointsToConvert / 50) * 50);
                
                // Update Firestore first
                await updateDoc(userRef, {
                    cash: newCash,
                    lastConvertedPoints: newLastConverted
                });

                // Then update context
                setUserDetail(prev => ({
                    ...prev,
                    cash: newCash,
                    lastConvertedPoints: newLastConverted
                }));
            }

            // Then handle level up if points exceed maxPoints
            if (points >= maxPoints) {
                const newLevel = currentLevel + 1;
                const remainingPoints = points - maxPoints;
                const newMaxPoints = 300 + (newLevel - 1) * 500;

                // Update Firestore
                await updateDoc(userRef, {
                    level: newLevel,
                    point: remainingPoints,
                    maxPoints: newMaxPoints
                });

                // Update context
                setUserDetail(prev => ({
                    ...prev,
                    level: newLevel,
                    point: remainingPoints,
                    maxPoints: newMaxPoints
                }));
            }
        };
      
        updateUserLevelInDatabase();
    }, [userDetail?.point, userDetail?.level, userDetail?.cash,userDetail?.maxPoints,]);

    if (!userDetail) {
        return <Text>Loading...</Text>; // Render loading state if userDetail is not available
    }

    const currentLevel = Math.max(1, userDetail?.level || 1);
    const maxPoints = currentLevel === 1 ? 300 : 300 + (currentLevel - 1) * 500;
    const points = Math.max(0, userDetail?.point || 0);
    const progress = Math.min(1, Math.max(0, points / maxPoints));
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <View>
                <Text style={{
                    fontFamily: 'bold',
                    fontSize: 25,
                    color: 'black'
                }}>Hello, {userDetail?.name || 'User'}</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    color: 'black'
                }}>Let's Get Started!</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    color: 'black'
                }}>Level: {userDetail?.level}</Text>
                <Progress.Bar progress={progress} height={8} width={width - 50} color={'#59C5A3'}  />
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    color: 'black'
                }}>Points: {points}/{maxPoints}</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    color: 'black'
                }}>Cash: ${userDetail?.cash || 0}</Text>
            </View>
        </View>
    );
}