import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Colors from './../../constant/Colors'
import { CourseCategory } from './../../constant/option'
import CourseListByCategory from './../../components/Explore/CourseListByCategory'

export default function Explore() {


    return (
        <FlatList data={[]}
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,

            }}
            ListHeaderComponent={
                <View style={{
                    padding: 25,
                    backgroundColor: Colors.WHITE,
                    flex: 1
                }}>
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 30,

                    }}>Explore More Courses</Text>

                    {CourseCategory.map((item, index) => (
                        <View key={index} style={{
                            marginTop: 10
                        }}>
                            <CourseListByCategory category={item} />
                        </View>
                    ))}

                </View>} />
    )
}