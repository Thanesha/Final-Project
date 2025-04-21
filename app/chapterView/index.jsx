import { View, Text, Dimensions, StyleSheet, FlatList ,TouchableOpacity} from 'react-native';
import React, { useState,useEffect } from 'react'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useSearchParams } from 'expo-router/build/hooks';

export default function ChapterView() {
    const { chapterParams,courseParams, docId,courseId, chapterIndex } = useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const [currentPage, setCurrentPage] = useState(0);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const GetProgress = (currentPage) => {
        const percent = (currentPage / chapters?.content?.length);
        return percent;
    }
    useEffect(() => {
        if (!courseParams) {
            GetCourseById();
        }
        else {
            setCourse(JSON.parse(courseParams));
        }
    }, [courseId])


    const GetCourseById = async () => {
        const docRef = await getDoc(doc(db, 'Courses', courseId));
        const courseData = docRef.data();
        setCourse(courseData)
    }

    const onChapterComplete = async () => {
        //Save Chapter Complete
        setLoader(true)
        await updateDoc(doc(db, 'Courses', docId), {
            completedChapter: arrayUnion(chapterIndex)
        })

        setLoader(false);
        // router.replace('/courseView/' + docId);
        router.replace('/(tabs)/home');
        // Go Back
    }


    return (
        <View style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            flex: 1
        }}>
            <Progress.Bar progress={GetProgress(currentPage)}
                width={Dimensions.get('screen').width * 0.85} color={'#59C5A3'} />

            <FlatList data={[]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{
                        marginTop: 20
                    }}>
                        <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 25
                        }}>{chapters?.content[currentPage]?.topic}</Text>

                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 20,
                            marginTop: 7
                        }}>{chapters?.content[currentPage]?.explain}</Text>
                        <Text style={styles.exampleLabel}>Example:</Text>
                        {chapters?.content[currentPage]?.example && (
                        <Text style={styles.exampleText}>
                            {chapters?.content[currentPage]?.example}
                        </Text>)}
                        <Text style={styles.codeLabel}>Code Example:</Text>
                        {chapters?.content[currentPage]?.code && (
                            <Text style={[styles.codeExampleText, { backgroundColor: Colors.BLACK, color: Colors.WHITE }]}>
                                {chapters?.content[currentPage]?.code}
                            </Text>
                        )}

                        </View>} />

                <View style={{
                position: 'absolute',
                bottom: 15,
                width: '100%',
                left: 25
                }}>
                {chapters?.content?.length - 1 !== currentPage ? (
                    <TouchableOpacity style={styles.button} onPress={() => setCurrentPage(currentPage + 1)}>
                        <Text style={styles.ButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.fbutton} onPress={() => onChapterComplete()} disabled={loader}>
                        <Text style={styles.ButtonText}>{loader ? 'Loading...' : 'Finish'}</Text>
                    </TouchableOpacity>
                )}
            </View>
    </View>
)}

const styles = StyleSheet.create({
    codeExampleText: {
        padding: 15,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 15,
        fontFamily: 'outfit',
        fontSize: 18,
        marginTop: 15
    },
    button: {
        backgroundColor: '#268242', // Primary color for Next button
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
        elevation: 3, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    fbutton: {
        backgroundColor: '#44DA67', // Secondary color for Finish button
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    ButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16, // Increase font size for better readability
    },
    exampleText: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: Colors.DARK_GRAY, // Use a darker color for visibility
        marginTop: 10,
        fontStyle: 'italic', // Italicize the example text
    },
    codeLabel: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        marginTop: 15,
        color: Colors.PRIMARY, // Use a primary color for the label
    },
    exampleLabel: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        marginTop: 15,
        color: Colors.PRIMARY, // Use a primary color for the label
    },
})