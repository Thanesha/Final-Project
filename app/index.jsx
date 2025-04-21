
import React, { useContext, useState,useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserDetailContext, UserDetailProvider } from './../context/UserDetailContext'; // Import the provider
import { horizontalScale, verticalScale, moderateScale, isTablet } from './../constant/responsive';
export default function App() {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const result = await getDoc(doc(db, 'users', user?.email));
                    setUserDetail(result.data());
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAuthenticated && !loading) {
            router.replace('/(tabs)/home');
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (isAuthenticated) {
        return null;
    }


    return (
            <ImageBackground source={require('./../assets/images/start.png')} style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.title}>Master the exciting world of AI and computer science with Mind-Craft</Text>
                    <Text style={styles.text}> A gamified learning platform designed specifically for students! Whether you're a complete beginner or looking to deepen your skills, MindCraft makes learning interactive, fun, and rewarding.</Text>

                    <TouchableOpacity style={styles.button} onPress={() => router.push('/start/signup')}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/start/signin')}>
                        <Text style={styles.buttonText}>Already have an Account</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: horizontalScale(30),
        marginTop: verticalScale(20),
        width: isTablet ? '80%' : '100%',
    },
    title: {
        fontSize: moderateScale(24),
        color: '#fff',
        fontFamily: 'lato-bold',
        marginBottom: verticalScale(400),
        textAlign: 'center',
        width: isTablet ? '80%' : '100%',
    },
    text: {
        fontSize: moderateScale(16),
        color: '#fff',
        marginBottom: verticalScale(75),
        textAlign: 'left',
        fontFamily: 'lato-bold',
        marginTop: verticalScale(100),
        width: isTablet ? '70%' : '100%',
        lineHeight: moderateScale(24),
    },
    button: {
        backgroundColor: 'black',
        padding: moderateScale(15),
        borderRadius: moderateScale(20),
        marginBottom: verticalScale(30),
        width: isTablet ? '50%' : '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: moderateScale(18),
        fontFamily: 'lato',
    },
});