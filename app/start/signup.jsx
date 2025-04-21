import React, {useContext, useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Pressable,ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext'

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState(); // Initialize with an empty string
    const [password, setPassword] = useState(); // Initialize with an empty string
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [loading,setLoading]=useState(false);
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const CreateNewAccount = async () => {
        if (loading) return;
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = {
                name: username,
                email: email,
                uid: userCredential.user.uid,
                point: 0,
                level: 1,
                cash: 100, // Give initial cash to new users
                lastConvertedPoints: 0,
                rank: "Beginner",
                createdAt: new Date().toISOString()
            };
         
            // Add retry mechanism for Firestore
            let retries = 5;
            let delay = 1000;
            while (retries > 0) {
                try {
                    await setDoc(doc(db, 'users', userCredential.user.email), userData, {
                       
                    });
 // If successful, break the loop
                setUserDetail(userData);
                router.replace('/(tabs)/home');
                return;
                } catch (error) {
                console.log(`Retry attempt ${6 - retries} failed`);
                retries--;
                
                if (retries === 0) {
                    // If all retries failed, still proceed but show warning
                    setUserDetail(userData);
                    router.replace('/(tabs)/home');
                    return;
                }
                
                // Wait with exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Double the delay for next attempt
                }
                }
                } catch (error) {
                console.error('Error creating account:', error);
                if (error.code === 'auth/network-request-failed') {
                setError('Network error. Please check your connection.');
                } else if (error.code === 'auth/email-already-in-use') {
                setError('Email already in use');
                } else {
                setError('Failed to create account. Please try again.');
                }
                } finally {
                setLoading(false);
                }
                };

   
    return (
        <View style={styles.container}>
            <Image 
                source={require('./../../assets/images/up.png')} // Replace with your image path
                style={styles.image}
            />
            <Text style={styles.title}>Start your learning journey with us!</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Username" 
                onChangeText={(value) => setUsername(value)}
                placeholderTextColor="#888" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Email"
                onChangeText={(value) => setEmail(value)}
                placeholderTextColor="#888" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                onChangeText={(value) => setPassword(value)}
                placeholderTextColor="#888" 
                secureTextEntry={true}
            />
    <TextInput 
        style={styles.input} 
        placeholder="Confirm password" 
        onChangeText={(value) => setConfirmPassword(value)}
        placeholderTextColor="#888" 
        secureTextEntry={true}
    />
    
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity onPress={CreateNewAccount}
            disable={loading} style={styles.button}>
            {!loading?  <Text style={styles.buttonText}>Sign up</Text>:
            
            <ActivityIndicator size="small" color="#0000ff" /> }
            </TouchableOpacity>

            <View style={styles.footer}>
                <Pressable onPress={() => router.push('/start/signin')}>
                    <Text style={styles.loginLink}>Already have an account? Log in</Text>
                </Pressable>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#3498DB',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    orText: {
        marginVertical: 10,
    },
    link: {
        color: '#3498DB',
    },
    loginLink: {
        padding: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center'
    },
});

