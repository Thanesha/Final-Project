
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator,Button } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Colors from './../../constant/Colors';
import { UserDetailContext } from './../../context/UserDetailContext';
import { ProfileMenu } from './../../constant/option';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import {  setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker'; 
import * as FileSystem from 'expo-file-system';
export default function Profile() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProfileImage();
    }, [userDetail]);

    const fetchProfileImage = async () => {
        const userRef = doc(db, 'users', userDetail?.email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileImage(data.profileImage);
        }
    };

    const onMenuClick = (menu) => {
        if (menu.name == 'Logout') {
            signOut(auth).then(() => {
                setUserDetail(null);
                router.push('/');
            }).catch((error) => {
                // Handle error
            });
        } else {
            router.push(menu.path);
        }
    };
    
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.2, // Reduced quality to 20%
                base64: true, // Request base64 directly
                maxWidth: 800, // Limit width
                maxHeight: 800 // Limit height
            });
    
            if (!result.canceled) {
                setImage(result.assets[0].uri);
                // Use the base64 string directly from the picker result
                uploadImageAsBase64(result.assets[0].base64);
            }
        } catch (error) {
            console.error("Error picking an image: ", error);
            alert("An error occurred while trying to pick an image.");
        }
    };
    const uploadImageAsBase64 = async (base64String) => {
        setIsUploading(true);
        try {
            const userRef = doc(db, 'users', userDetail?.email);
            await setDoc(userRef, {
                profileImage: base64String
            }, { merge: true });
    
            console.log('Image stored as base64 in Firestore');
            fetchProfileImage();
        } catch (error) {
            console.error('Error storing image as base64:', error);
            alert('Failed to upload image. Please try a smaller image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={{ padding: 25, flex: 1, backgroundColor: "#C2FFD4" }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 35 }}>Profile</Text>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <Image source={profileImage ? { uri: `data:image/png;base64,${profileImage}` } : require('./../../assets/images/user.png')}
                    style={{ width: 200, height: 200 }} />
                <Text style={{ fontFamily: 'outfit-bold', fontSize: 27 }}>{userDetail?.name}</Text>
                <Text style={{ fontFamily: 'outfit', fontSize: 20, color: Colors.GRAY }}>{userDetail?.email}</Text>
                {isUploading ? (
                    <ActivityIndicator size="small" color={Colors.PRIMARY} style={{ marginTop: 10 }} />
                ) : (
                    <Button title="Change Profile Picture" onPress={pickImage} disabled={isUploading} />
                )}
            </View>
            <FlatList
                data={ProfileMenu}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onMenuClick(item)} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                        marginTop: 5,
                        padding: 17,
                        backgroundColor: Colors.WHITE,
                        elevation: 1,
                        borderRadius: 15
                    }}>
                        <Ionicons name={item.icon} size={24} color={Colors.PRIMARY} style={{
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: Colors.BG_GRAY
                        }} />
                        <Text style={{ fontFamily: 'outfit', fontSize: 20 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}