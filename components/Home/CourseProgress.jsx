import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { imageAssets } from './../../constant/option';
import { useRouter } from 'expo-router';
import Colors from './../../constant/Colors';
import * as Progress from 'react-native-progress';

export default function CourseProgress({ courseList }) {
    const router = useRouter();
    const width = Dimensions.get('screen').width; // Define width variable

    const GetCompletedChapters = (course) => {
        const completedChapter = course?.completedChapter?.length;
        const percent = completedChapter / course?.chapters?.length;
        return percent ?? 0;
    };
    // Filter out completed courses
    const uncompletedCourses = courseList.filter(course => {
        const completedChapters = course?.completedChapter?.length || 0;
        const totalChapters = course?.chapters?.length || 0;
        return completedChapters < totalChapters;
    });
    const GetEarnedPoints = (course) => {
        const completedChapters = course?.completedChapter || [];
        console.log("Completed Chapters:", completedChapters); // Log completed chapters
        return course?.chapters?.reduce((total, chapter, index) => {
            if (completedChapters.includes(index.toString())) { // Convert index to string for comparison
                console.log(`Adding points for chapter ${index}:`, chapter.points); // Log points for each completed chapter
                return total + (chapter.points || 0); // Ensure points are added correctly
            }
            return total;
        }, 0);
    };
    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 25, color: Colors.BLACK }}>In Progress</Text>
            <FlatList
                data={uncompletedCourses}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/courseView/' + item?.docId,
                            params: {
                                courseParams: JSON.stringify(item),
                                addCourse: false,
                                enroll: false
                            }
                        })}
                        key={index}
                    >
                        <View style={{ margin: 7, padding: 15, backgroundColor: Colors.WHITE, borderRadius: 15, width: width }}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <Image
                                    source={imageAssets[item?.banner_image]}
                                    style={{ width: 120, height: 80, borderRadius: 8 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={{ fontFamily: 'outfit-bold', fontSize: 19, flexWrap: 'wrap' }}>
                                        {item?.courseTitle}
                                    </Text>
                                    <Text style={{ fontFamily: 'outfit', fontSize: 15 }}>
                                        {item?.chapters?.length} Chapter
                                    </Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Progress.Bar progress={GetCompletedChapters(item)} height={8} width={width - 50} color={'#59C5A3'}/>
                                <Text style={{ fontFamily: 'outfit', marginTop: 2 }}>
                                    {item?.completedChapter?.length ?? 0} Out of {item.chapters?.length} Chapter Completed
                                </Text>
                                <Text style={{ fontFamily: 'outfit', marginTop: 2 }}>
                                    Earned Points: {GetEarnedPoints(item) || 0}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}