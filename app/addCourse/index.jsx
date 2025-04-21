
import { View, Text, StyleSheet, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import { GenerateCourseAIModel, GenerateTopicsAIModel } from './../../config/AIModel';
import Prompt from './../../constant/Prompt';
import { db } from '././../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import Colors from './../../constant/Colors';

export default function AddCourse() {
    const [loading, setLoading] = useState(false);
    const { userDetail } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const router = useRouter();

    const onGenerateTopic = async () => {
        if (!userInput.trim()) {
            alert("Please enter a course topic.");
            return;
        }

        setLoading(true);
        const PROMPT = userInput + Prompt.IDEA;
        const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT);
        const topicIdea = JSON.parse(aiResp.response.text());
        setTopics(topicIdea?.course_titles || []);
        setLoading(false);
    };

    const onTopicSelect = (topic) => {
        const isAlreadyExist = selectedTopics.includes(topic);
        if (!isAlreadyExist) {
            setSelectedTopics(prev => [...prev, topic]);
        } else {
            setSelectedTopics(selectedTopics.filter(item => item !== topic));
        }
    };

    const isTopicSelected = (topic) => selectedTopics.includes(topic);



    const onGenerateCourse = async () => {
        setLoading(true);
        // const PROMPT = selectedTopics + Prompt.COURSE;
        const PROMPT = `Generate a course for each of these topics: ${selectedTopics.join(', ')}. ${Prompt.COURSE}`;
    
        try {
            const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
            const rawResponse = aiResp.response.text();
            console.log("Raw AI Response:", rawResponse);
    
            if (rawResponse) {
                try {

                // Ensure we have a valid JSON string
                const cleanResponse = rawResponse.trim()
                .replace(/^\s*{\s*"courses"\s*:\s*/, '{"courses":')
                .replace(/\}\s*$/, '}');
            
            const resp = JSON.parse(cleanResponse);
            const courses = resp.courses || [];

            if (!courses.length) {
                throw new Error("No courses generated");
            }
                    for (const course of courses) {
                        const docId = Date.now().toString();
                        await setDoc(doc(db, 'Courses', docId), {
                            ...course,
                            createdOn: new Date(),
                            createdBy: userDetail?.email ?? '',
                            docId: docId
                        });
                    }
    
                    router.push('/(tabs)/home');
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    console.error("Raw Response:", rawResponse);
                    alert('Failed to parse AI response. Please try again.');
                }
            } else {
                throw new Error("Empty response from AI model");
            }
        } catch (e) {
            console.error("Error generating course:", e);
            alert('Failed to generate course. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create New Course</Text>
            <Text style={styles.subTitle}>What you want to learn today?</Text>
            <Text style={styles.text}>What course you want to create (ex. Learn Python, etc...)</Text>

            <TextInput
                placeholder='(Ex. Learn Python)'
                style={styles.textInput}
                numberOfLines={3}
                multiline={true}
                onChangeText={setUserInput}
            />

            <TouchableOpacity 
                style={styles.createButton} 
                onPress={onGenerateTopic}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.createButtonText}>Generate Topic</Text>
                )}
            </TouchableOpacity> 

            {topics.length > 0 && (
                <View style={styles.topicSelectionContainer}>
                    <Text style={styles.topicSelectionText}>Select all topics which you want to add in the course</Text>
                    <View style={styles.topicsContainer}>
                        {topics.map((item, index) => (
                            <Pressable key={index} onPress={() => onTopicSelect(item)}>
                                <Text style={{
                                    ...styles.topics,
                                    backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : null,
                                    color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY
                                }}>{item}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {selectedTopics.length > 0 && (
                <TouchableOpacity style={styles.createButton} onPress={onGenerateCourse} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.createButtonText}>Generate Course</Text>
                    )}
                </TouchableOpacity>
            )}

            <View style={{ height: 200 }}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 30,
    },
    text: {
        fontSize: 20,
        marginTop: 8,
        color: "GRAY",
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        height: 100,
        marginTop: 10,
        fontSize: 18,
    },
    createButton: {
        backgroundColor: '#268242',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    topicSelectionContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    topicSelectionText: {
        fontSize: 20,
        color: '#333',
    },
    topics: {
        padding: 7,
        borderWidth: 0.4,
        borderRadius: 99,
        paddingHorizontal: 15,
    },
    topicsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 6,
    },
});