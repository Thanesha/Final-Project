import { View, Text, Image ,TouchableOpacity ,ScrollView ,StyleSheet} from 'react-native'
import React, { useContext } from 'react';
import { UserDetailContext } from './../../context/UserDetailContext';
import { useRouter} from 'expo-router'

export default function NoCourse() {
    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Welcome to Mind-Craft!</Text>
                <Text style={styles.welcomeText}>Start your learning journey by creating your first course or explore existing courses.</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ccffe7',
    },
    scrollContainer: {
        padding: 20,
        flexGrow: 1,
        alignItems: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginVertical: 30,
        marginTop: 300,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    welcomeText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 100,
        paddingHorizontal: 20,
    },
});