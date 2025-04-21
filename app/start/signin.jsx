
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter} from 'expo-router'
import React, {useContext, useState} from 'react';
import { auth, db } from './../../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const onSignInClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', email));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await setUserDetail({
          ...userData,
          uid: userCredential.user.uid,
          email: userCredential.user.email
        });
        // Add a small delay before navigation
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 100);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Incorrect Email & Password');
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
      <Text style={styles.title}>Welcome back!</Text>
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
        secureTextEntry 
      />
      <TouchableOpacity onPress={onSignInClick} 

      style={styles.button}>
       {!loading? <Text style={styles.buttonText}>Log in</Text>:
            <ActivityIndicator size="small" color="#0000ff"/>
        }
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.link}>Reset password</Text>
        </TouchableOpacity>
        <Pressable onPress={() => router.push('/start/signup')}>
        <Text style={styles.link}>New here? Join the fun!</Text>
    
        </Pressable>     
          
    
      </View>
    </View>
  );
};

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  link: {
    color: '#3498DB',
  },
});
