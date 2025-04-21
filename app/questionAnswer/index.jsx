import { View, Text, Image, FlatList, Pressable, StyleSheet,ScrollView  } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from './../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function QuestionAnswer() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const qaList = course?.qa;
    const [selectedQuestion, setSelectedQuestion] = useState();
    const router = useRouter();
    const OnQuestionSelect = (index) => {
        if (selectedQuestion == index) {
            setSelectedQuestion(null)
        }
        else {
            setSelectedQuestion(index)
        }
    }
    return (
        <View>
            <FlatList
                data={qaList}
                ListHeaderComponent={() => (
                    <View>
                        <View style={{
                            padding: 20,
                            marginTop: 35
                        }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 7,
                                alignItems: 'center'
                            }}>
                                <Pressable onPress={() => router.back()}>
                                    <Ionicons name="arrow-back" size={30} color="black" />
                                </Pressable>
                                <Text style={{
                                    fontFamily: 'outfit-bold',
                                    fontSize: 28,
                                    color: 'black'
                                }}>Question & Answers</Text>
                            </View>
                            <Text style={{
                                fontFamily: 'outfit',
                                color: 'black',
                                fontSize: 20
                            }}>{course?.courseTitle}</Text>
                        </View>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <Pressable style={styles?.card}
                        onPress={() => OnQuestionSelect(index)}
                    >
                        <Text  style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 20
                        }}>{item?.question}</Text>
                        {selectedQuestion == index &&
                            <View style={{
                                borderTopWidth: 0.4,
                                marginVertical: 10,
                            }}>
                                <Text style={{
                                    fontFamily: 'outfit',
                                    fontSize: 17,
                                    color: Colors.GREEN,
                                    marginTop: 10
                                }}>Answer: {item?.answer}</Text>
                            </View>
                        }
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        marginTop: 15,
        borderRadius: 15,
        elevation: 1
    }
})