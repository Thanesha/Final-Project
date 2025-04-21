import { View, Text, FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import Colors from './../../constant/Colors';
import { imageAssets } from './../../constant/option';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function Mycourse() {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCourseList();
  }, [userDetail]);

  const getCourseList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'Courses'),
        where('createdBy', '==', userDetail?.email)
      );

      const querySnapshot = await getDocs(q);
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({
          ...doc.data(),
          docId: doc.id
        });
      });
      setCourseList(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => {
    const totalPoints = item?.chapters?.reduce((total, chapter) => total + (chapter.points || 0), 0);
    
    return (
      <TouchableOpacity
        onPress={() => router.push({
          pathname: '/courseView/' + item?.docId,
          params: {
            courseParams: JSON.stringify(item),
            enroll: false
          }
        })}
        style={styles.courseItem}
      >
        <Image
          source={imageAssets[item.banner_image]}
          style={styles.courseImage}
        />
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item?.courseTitle}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={20} color="black" />
            <Text style={styles.infoText}>{item?.chapters?.length} Chapters</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="star-outline" size={20} color="black" />
            <Text style={styles.infoText}>{totalPoints} Points</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Courses</Text>
    </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading courses...</Text>
      ) : courseList.length > 0 ? (
        <FlatList
          data={courseList}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.docId}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noCourseText}>You haven't created any courses yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  courseItem: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 0.2,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  courseDetails: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  infoText: {
    fontFamily: 'outfit',
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'outfit',
    marginTop: 20,
  },
  noCourseText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'outfit',
    marginTop: 20,
    color: Colors.GRAY,
  }
});