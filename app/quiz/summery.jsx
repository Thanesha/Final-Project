
import { View, Text, Image, StyleSheet, FlatList,TouchableOpacity ,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from './../../constant/Colors';

export default function QuizSummery() {
    const { quizResultParam } = useLocalSearchParams();
    const quizResult = JSON.parse(quizResultParam)
    const [correctAns, setCorrectAns] = useState(0);
    const [totalQuestion, setTotalQuestion] = useState(0);
    const router = useRouter();


    useEffect(() => {
        console.log(quizResult);
        quizResult && CalculateResult()
    }, [quizResult])


    const CalculateResult = () => {
        if (quizResult !== undefined) {
            const correctAns_ = Object.entries(quizResult)
                ?.filter(([key, value]) =>
                    value?.isCorrect == true)

            const totalQues_ = Object.keys(quizResult).length;

            setCorrectAns(correctAns_.length);
            setTotalQuestion(totalQues_);
        }

    }

    const GetPercentMark = () => {
        return ((correctAns / totalQuestion) * 100).toFixed(0)
    }


    return (
        <FlatList
        data={Object.entries(quizResult)} // Use this as the main list
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 20, flexGrow: 1 }}
        ListHeaderComponent={
            <View>
                <Image source={require('./../../assets/images/wave.png')}
                    style={{ width: '100%', height: 400 }}
                />
                <View style={{ position: 'absolute', width: '100%', padding: 35 }}>
                    <Text style={styles.headerTitle}>Quiz Summary</Text>
                    <View style={styles.summaryContainer}>
                        <Image source={require('./../../assets/images/trophy.png')}
                            style={styles.trophy}
                        />
                        <Text style={styles.congratText}>
                            {GetPercentMark() >= 60 ? 'Congratulations!' : 'Try Again!'}
                        </Text>
                        <Text style={styles.percentText}>
                            You gave {GetPercentMark()}% Correct Answers
                        </Text>
                        <View style={styles.resultRow}>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText}>Q {totalQuestion}</Text>
                            </View>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText}>✅ {correctAns}</Text>
                            </View>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText}>❌ {totalQuestion - correctAns}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => router.replace('/(tabs)/home')}>
                        <Text style={styles.ButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Summary:</Text>
                </View>
            </View>
        }
                                
        renderItem={({ item, index }) => {
            const quizItem = item[1]; // Access the actual quiz object
            return (
                <View style={{
                    padding: 15,
                    borderWidth: 1,
                    marginTop: 5,
                    borderRadius: 15,
                    backgroundColor: quizItem?.isCorrect ? Colors.LIGHT_GREEN : Colors.LIGHT_RED,
                    borderColor: quizItem?.isCorrect ? Colors.GREEN : Colors.RED,
                }}>
                    <Text style={styles.questionText}>{quizItem.question}</Text>
        
                    <Text style={styles.correctAnswerText}>✅ Correct Answer: {quizItem?.correctAns}</Text>
        
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 15,
                        color: quizItem?.isCorrect ? Colors.GREEN : Colors.RED, // Show correct/incorrect in color
                    }}>
                        {quizItem?.isCorrect ? '✔️ Your Answer: ' : '❌ Your Answer: '} {quizItem?.userChoice}
                    </Text>
                </View>
            );
                }}
                />);
            }

                    
            
const styles = StyleSheet.create({
    resultTextContainer: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        elevation: 1
    },
    resultText: {
        fontFamily: 'outfit',
        fontSize: 20
    },
    ButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16, 
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2ecc71', // Secondary color for Finish button
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,


    },
    sectionTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 25,
        marginBottom: 5, // Reduce bottom margin
    },

    questionText: {
        fontFamily: 'outfit',
        fontSize: 20,
    },
    answerText: {
        fontFamily: 'outfit',
        fontSize: 15,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'outfit-bold',
        fontSize: 30,
        color: Colors.WHITE
    },
    summaryContainer: {
        backgroundColor: Colors.WHITE,
        padding: 20,
        borderRadius: 20,
        marginTop: 60,
        alignItems: 'center'
    },
    trophy: {
        width: 100,
        height: 100,
        marginTop: -60
    },
    congratText: {
        fontSize: 26,
        fontFamily: 'outfit-bold',
    },
    percentText: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        fontSize: 17
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    resultTextContainer: {
        padding: 15,
        backgroundColor: Colors.WHITE,
  
    },
    resultText: {
        fontFamily: 'outfit',
        fontSize: 20
    },
});
