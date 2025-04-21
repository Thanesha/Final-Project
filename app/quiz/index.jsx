import { View, Text, Image, Pressable, Dimensions,StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from './../../constant/Colors';
import * as Progress from 'react-native-progress';
import { db } from './../../config/firebaseConfig'
import { arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
export default function Quiz() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const quiz = course?.quiz;
    const [selectedOption, setSelectedOption] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [loader, setLoader] = useState(false);

    const GetProgress = (currentPage) => {
        const percent = (currentPage / quiz?.length);
        return percent;
    }

    const OnOptionSelect = (selectedChoice) => {
        setResult(prev => ({
            ...prev,
            [currentPage]: {
                userChoice: selectedChoice,
                isCorrect: quiz[currentPage]?.correctAns == selectedChoice,
                question: quiz[currentPage]?.question,
                correctAns: quiz[currentPage]?.correctAns
            }
        }));
        console.log(result);
    }

    const onQuizFinish = async () => {
        setLoading(true);
        // Save The result in Database for Quiz
        try {
            await updateDoc(doc(db, 'Courses', course?.docId), {
                quizResult: result
            })
            setLoading(false);

            router.replace({
                pathname: '/quiz/summery',
                params: {
                    quizResultParam: JSON.stringify(result)
                }
            })
        }
        catch (e) {
            setLoading(false);
        }
        // Redirect user to Quiz Summery
    }

    return (
        <FlatList data={[]}
            ListHeaderComponent={
                <View>
                    <Image source={require('./../../assets/images/wave.png')}
                        style={{
                            height: 800,
                            width: '100%'
                        }}
                    />
                    <View style={{
                        position: 'absolute',
                        padding: 25,
                        width: '100%'
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Pressable onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={30} color="white" />
                            </Pressable>
                            <Text style={{
                                fontFamily: 'outfit-bold',
                                fontSize: 25,
                                color: Colors.WHITE
                            }}>{currentPage + 1} of {quiz?.length}</Text>
                        </View>

                        <View style={{
                            marginTop: 20
                        }}>
                            <Progress.Bar progress={GetProgress(currentPage)} width={Dimensions.get('window').width * 0.85}
                                color={Colors.WHITE} height={10} />
                        </View>

                        <View style={{
                            padding: 25,
                            backgroundColor: Colors.WHITE,
                            marginTop: 30,
                            height: Dimensions.get('screen').height * 0.65,
                            elevation: 1,
                            borderRadius: 20
                        }}>

                            <Text style={{
                                fontSize: 25,
                                fontFamily: 'outfit-bold',
                                textAlign: 'center'
                            }}>{quiz[currentPage]?.question}</Text>

                            {quiz[currentPage]?.options.map((item, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedOption(index);
                                        OnOptionSelect(item)
                                    }}
                                    key={index} style={{
                                        padding: 20,
                                        borderWidth: 1,
                                        borderRadius: 15,
                                        marginTop: 8,
                                        backgroundColor: selectedOption == index ? Colors.LIGHT_GREEN : null,
                                        borderColor: selectedOption == index ? Colors.GREEN : null
                                    }}>
                                    <Text style={{
                                        fontFamily: 'outfit',
                                        fontSize: 20
                                    }}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {(selectedOption?.toString() && quiz?.length - 1 > currentPage) &&
                    <TouchableOpacity style={styles.button} onPress={() => { setCurrentPage(currentPage + 1); setSelectedOption(null) }}>
                        <Text style={styles.ButtonText}>Next</Text>
                    </TouchableOpacity>}

                        {(selectedOption?.toString() && quiz?.length - 1 == currentPage) &&
                            <TouchableOpacity style={styles.fbutton} onPress={() => onQuizFinish()} disabled={loader}>
                            <Text style={styles.ButtonText}>{loader ? 'Loading...' : 'Finish'}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>} />
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3498DB', // Primary color for Next button
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
        backgroundColor: '#2ecc71', // Secondary color for Finish button
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
    ButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16, // Increase font size for better readability
    },
    
})