import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Header from './../../components/Home/Header'
import NoCourse from './../../components/Home/NoCourse'
import Colors from './../../constant/Colors'
import { db } from './../../config/firebaseConfig'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { UserDetailContext } from './../../context/UserDetailContext'
import CourseList from './../../components/Home/CourseList'
import PracticeSection from './../../components/Home/PracticeSection'
import CourseProgress from './../../components/Home/CourseProgress'
import { useRouter } from 'expo-router'

export default function Home() {
    const route = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchCourses = async () => {
            // Don't fetch if already loading or no user email
            if (!userDetail?.email || loading) return;
            
            setLoading(true);
            try {
                const q = query(collection(db, 'Courses'), 
                    where("createdBy", '==', userDetail.email)
                );
                const querySnapshot = await getDocs(q);
                
                if (isMounted) {
                    const courses = [];
                    querySnapshot.forEach((doc) => {
                        courses.push({
                            ...doc.data(),
                            docId: doc.id
                        });
                    });
                    setCourseList(courses);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();
        return () => {
            isMounted = false;
        };
    }, []);

    const GetCourseList = async () => {

        setCourseList([])
        console.log("User Detail:", userDetail);
        try {
            
            const q = query(collection(db, 'Courses'), where("createdBy", '==', userDetail?.email));


            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log("--", doc.data());
                setCourseList(prev => [...prev, doc.data()])

            })
            setLoading(false);
        } catch (e) {
            console.error("Error fetching course list:", e); // Log the error


            setLoading(false);

        }
    }
    return (
        
        <FlatList
            data={[]}
            onRefresh={() => GetCourseList()}
            refreshing={loading}

            style={{
                flex: 1,
                backgroundColor: '#BDFFD6'
            }}
            ListHeaderComponent={
                <View >
                <View >
                    <View style={{
                        padding: 20,

                    }}>
                        
                        <Header />
                        {!loading && courseList?.length == 0 ?
                            <NoCourse /> :
                            <View>
                                <CourseProgress courseList={courseList} />
                                <PracticeSection />
                                <CourseList courseList={courseList} />


                            </View>
                        }
                                    <TouchableOpacity onPress={() => route.push('/addCourse')} 
            style={styles.createButton}>
            <Text style={styles.createButtonText}>
                + Create New Course</Text></TouchableOpacity>
                        {loading && <ActivityIndicator size={'large'} />}

                    </View>
                </View>
                </View>
            } />
    )
}


const styles = StyleSheet.create({
    createButton: {
        backgroundColor: '#59C582',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 100,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    })

