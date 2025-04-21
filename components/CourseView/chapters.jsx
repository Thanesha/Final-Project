import { View, Text, StyleSheet, FlatList, TouchableOpacity ,ActivityIndicator} from 'react-native';
import React, { useState, useEffect, useContext } from "react";
import { db } from './../../config/firebaseConfig'; // Adjust the path as necessary
import { doc, updateDoc, getDoc, setDoc,collection } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useLocalSearchParams } from 'expo-router';

export default function Chapters({ course, setTotalPoints }) {
    const [loadingChapters, setLoadingChapters] = useState({}); // State to manage loading for each chapter

    console.log("Course prop:", course); // Log the course prop
    console.log("Completed Chapters:", course.completedChapter); // Log completed chapters

    useEffect(() => {
        const totalPoints = course?.chapters?.reduce((total, chapter) => total + (chapter.points || 0), 0);
        setTotalPoints(totalPoints);
    }, [course, setTotalPoints]);

    console.log("Chapters array:", course.chapters); // Log the chapters array

    const isChapterCompleted = (index) => {
        // Check if the course belongs to the current user
        if (course.createdBy !== userDetail.email) {
            return false;
        }
        return course?.completedChapter?.includes(index.toString());
    };

    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);
    const handleChapterCompletion = async (index) => {
        console.log("Current completed chapters:", course.completedChapter); // Log the current state of completedChapter
            // Only track completion for user's own courses
        if (course.createdBy !== userDetail.email) {
            return;
        }
        // Check if the chapter is already completed (convert index to string)
        if (course.completedChapter.includes(index.toString())) {
            console.log("Chapter already completed, no points added");
            return; // Prevent adding points if already completed
        }
    
        // Get points for the completed chapter
        const chapterPoints = course.chapters[index].points || 0;
    
        // Update points in Firestore using userDetail.uid
        try {
            const userRef = doc(db, "users", userDetail.email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                // Retrieve current points
                const currentPoints = userDoc.data().point || 0;
    
                // Calculate new total points
                const newTotalPoints = currentPoints + chapterPoints;
    
                // Update existing user document
                await updateDoc(userRef, {
                    point: newTotalPoints // Update the 'point' field
                });
            } 
    
            // Update the completedChapter array and repopulate points
            if (!Array.isArray(course.completedChapter)) {
                course.completedChapter = []; // Initialize if not defined
                console.log("Initializing completedChapter array", course.completedChapter);
            }
            

            // Update course completion status
            const courseRef = doc(db, "Courses", course.docId);
            await updateDoc(courseRef, {
                completedChapter: [...(course.completedChapter || []), index.toString()]
            });

            // Update local state
            course.completedChapter = [...(course.completedChapter || []), index.toString()];
            setTotalPoints(prevPoints => prevPoints + chapterPoints);

        } catch (error) {
            console.error("Error updating completion status: ", error);
        }
    };
    
    const handleChapterClick = async (index) => {
        setLoadingChapters((prev) => ({ ...prev, [index]: true })); // Set loading for the chapter being clicked
    
        await handleChapterCompletion(index); // Ensure this function is called
    
        router.replace({
            pathname: '/chapterView',
            params: {
                chapterParams: JSON.stringify(course.chapters[index]),
                docId: course?.docId,
                chapterIndex: index
            }
        });
    
        setLoadingChapters((prev) => ({ ...prev, [index]: false })); // Reset loading after navigation
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Chapters</Text>
           
            <FlatList
                data={course?.chapters || []}  // Ensure we have an array even if chapters is undefined
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        onPress={() => handleChapterClick(index)} 
                        style={[
                            styles.chap,
                            isChapterCompleted(index) && styles.completedChapter
                        ]}
                    >
                        {loadingChapters[index] ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <View style={styles.item}>
                                <View style={styles.chapterInfo}>
                                    <Text style={styles.chaptertext}>{index + 1}. </Text>
                                    <Text style={styles.chaptertext}>{item.chapterName}</Text>
                                </View>
                                <Text style={styles.pointsText}>Points: {item.points}</Text>
                            </View>
                        )}
                        <Ionicons 
                            name={isChapterCompleted(index) ? "checkmark-circle" : "play"} 
                            size={24} 
                            color={isChapterCompleted(index) ? "green" : "black"} 
                        />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.text}>No chapters available</Text>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,

    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    chaptertext: {
        fontSize: 20,
    },

    pointsText: {
        fontSize: 16,
        color: 'gray', // Optional: style for points text
    },
    chap: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
        item: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
    },
    chapterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedChapter: {
        borderColor: 'green',
        backgroundColor: '#f0fff0',
    },
});
