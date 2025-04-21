import { View, Text, FlatList, Image,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from './../../constant/Colors';

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function CourseListGrid({ courseList, option }) {
    const router = useRouter();
    const windowHeight = Dimensions.get('window').height;

    const onPress = (course) => {

        router.push({
            pathname: option.path,
            params: {
                courseParams: JSON.stringify(course)
            }
        })

    }
    const isCompleted = (course) => {
        return course.quizResult || course.flashcardResult || course.qaResult;
    }

    return (
        <View>
            <FlatList
                data={courseList}
                numColumns={2}
                style={{ padding: 20 }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        onPress={() => onPress(item)} 
                        key={index}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 15,
                            backgroundColor: Colors.WHITE,
                            margin: 7,
                            borderRadius: 15,
                            elevation: 1
                        }}
                    >
                        {isCompleted(item) && (
                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color={Colors.GREEN}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 20
                                }}
                            />
                        )}
                        <Image 
                            source={option?.icon} 
                            style={{
                                width: '100%',
                                height: 70,
                                objectFit: 'contain'
                            }} 
                        />
                        <Text 
                            style={{
                                fontFamily: 'outfit',
                                textAlign: 'center',
                                marginTop: 7
                            }}
                            numberOfLines={2}
                        >
                            {item.courseTitle}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}