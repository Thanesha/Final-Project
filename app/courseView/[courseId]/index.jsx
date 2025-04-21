import { View, Text, StyleSheet, FlatList,ScrollView,Pressable  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { db } from './../../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Colors from './../../../constant/Colors';
import Intro from './../../../components/CourseView/intro';
import Chapters from './../../../components/CourseView/chapters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export default function CourseView() {
    const [totalPoints, setTotalPoints] = useState(0);
    const { courseParams, courseId, enroll } = useLocalSearchParams();
    const [course, setCourse] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const initializeCourse = async () => {
            try {
                if (courseParams) {
                    const parsedCourse = JSON.parse(courseParams);
                    // Ensure course has all required fields
                    setCourse({
                        ...parsedCourse,
                        id: courseId,
                        completedChapter: parsedCourse.completedChapter || []
                    });
                } else {
                    await GetCourseById();
                }
            } catch (error) {
                console.error("Error initializing course:", error);
                await GetCourseById(); // Fallback to fetching from database
            }
        };

        initializeCourse();
    }, [courseId, courseParams]);

    const GetCourseById = async () => {
        try {
            const docRef = await getDoc(doc(db, 'Courses', courseId));
            if (docRef.exists()) {
                const courseData = docRef.data();
                setCourse({
                    ...courseData,
                    id: courseId,
                    completedChapter: courseData.completedChapter || []
                });
            } else {
                console.error("No such document!");
                router.replace('/(tabs)/home');
            }
        } catch (error) {
            console.error("Error fetching course data: ", error);
            router.replace('/(tabs)/home');
        }
    };
    const renderItem = ({ item }) => {
        if (item.type === 'intro') {
            return <Intro course={course} enroll={enroll} />;
        } else if (item.type === 'chapters') {
            return <Chapters course={course} setTotalPoints={setTotalPoints} />;
        }
        return null;
    };

    const data = [
        { key: 'intro', type: 'intro' },
        { key: 'chapters', type: 'chapters' },
    ];

    return course && (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/home')}>
                    <Ionicons name="arrow-back" size={30} color="Black" />
                </Pressable>
                <Text style={styles.totalPointsText}>Total Points: {totalPoints || 0}</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                contentContainerStyle={styles.contentContainer}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    totalPointsText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: Colors.WHITE,
    },
});