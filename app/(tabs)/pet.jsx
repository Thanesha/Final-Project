import { View, Text, StyleSheet, Image, TouchableOpacity,ActivityIndicator,RefreshControl,ScrollView, TextInput, Alert } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { UserDetailContext } from './../../context/UserDetailContext'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './../../config/firebaseConfig'
import Colors from './../../constant/Colors'
import LottieView from 'lottie-react-native'

export default function Pet() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [petName, setPetName] = useState('')
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showNightSky, setShowNightSky] = useState(false);
  const [isHungry, setIsHungry] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [lastFeedReset, setLastFeedReset] = useState(null);
  const [isFullMessage, setIsFullMessage] = useState(false);
  const [cash, setCash] = useState(0)
  const [isTired, setIsTired] = useState(false);
  const animationRef = useRef(null)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPetDetails().then(() => setRefreshing(false));
  }, []);
  const [isCreating, setIsCreating] = useState(false);
  const checkPetAgeAndFeeding = (lastFed,feedCount, lastAgeUpdate) => {
    const now = new Date();
    // const lastFedDate = new Date(lastFed);
     const lastAge = new Date(lastAgeUpdate);
    const daysSinceLastFed = Math.floor((now - lastFed) / (1000 * 60 * 60 * 24));
    const daysSinceAgeUpdate = Math.floor((now - lastAge) / (1000 * 60 * 60 * 24));

    if (daysSinceLastFed <= 7 && daysSinceAgeUpdate >= 7) {
      // const minutesSinceLastFed = Math.floor((now - lastFedDate) / (1000 * 60));
      // const minutesSinceAgeUpdate = Math.floor((now - lastAge) / (1000 * 60));
  
      // Changed from 7 days to 2 minutes
      // if (minutesSinceLastFed <= 5 && minutesSinceAgeUpdate >= 5 && feedCount >= getMaxFeedCount(pet?.age || 0)) {
      return {
        shouldUpdateAge: true,
        newAgeUpdateTime: now.toISOString()
      };
    }
    return { shouldUpdateAge: false };
  };
  const updateCash = async (newCash) => {
    try {
      const userRef = doc(db, 'users', userDetail.email);
      await updateDoc(userRef, {
        cash: newCash
      });
      // Update local state
      setUserDetail({
        ...userDetail,
        cash: newCash
      });
    } catch (error) {
      console.error('Error updating cash:', error);
    }
  };
 useEffect(() => {
    if (!userDetail?.uid || !pet?.lastFeedReset) return;

    const checkReset = setInterval(async () => {
      if (!userDetail?.uid) return;
      
      try {
        const petDoc = await getDoc(doc(db, 'pets', userDetail.uid));
        if (petDoc.exists()) {
          const petData = petDoc.data();
          const { shouldReset, newResetTime } = checkAndResetFeedCount(petData.lastFeedReset);
          
          if (shouldReset) {
            const petRef = doc(db, 'pets', userDetail.uid);
            await updateDoc(petRef, {
              feedCount: 0,
              lastFeedReset: newResetTime
            });
            setPet(prev => ({...prev, feedCount: 0, lastFeedReset: newResetTime}));
            setFeedCount(0);
            setLastFeedReset(newResetTime);
            setIsFullMessage(false);
          }
        }
      } catch (error) {
        console.error('Error in reset check:', error);
      }
    }, 50000);

    return () => clearInterval(checkReset);
  }, [userDetail?.uid, pet?.lastFeedReset]);
  // Check every minute
  useEffect(() => {
    let isMounted = true;

    const initializePet = async () => {
      if (!userDetail?.uid) return;
      
      try {
        const petDoc = await getDoc(doc(db, 'pets', userDetail.uid));
        if (petDoc.exists() && isMounted) {
          const petData = petDoc.data();
          setPet(petData);
          setFeedCount(petData.feedCount || 0);
          setLastFeedReset(petData.lastFeedReset);
        }
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializePet();
    return () => {
      isMounted = false;
    };
  }, [userDetail?.uid]);

  useEffect(() => {
    if (!userDetail) {
      setLoading(true);
      return;
    }
  }, [userDetail]);
  const checkAndResetFeedCount = (lastResetTime) => {
    const now = new Date();
    const lastReset = new Date(lastResetTime);
    const hoursDiff = (now - lastReset) / (1000 * 60 * 60); //to 1 hour
    // const minutesDiff = Math.floor((now - lastReset) / (1000 * 60)); // Changed to minutes

    // for 12hour
     if (hoursDiff >= 2) { 
      // if (minutesDiff >= 10) {
      return {
        shouldReset: true,
        newResetTime: now.toISOString()
      };
    }
    return { shouldReset: false };
  };

  const getPetDetails = async () => {
    try {
      const petDoc = await getDoc(doc(db, 'pets', userDetail.uid))
      if (petDoc.exists()) {
        const petData = petDoc.data();
        const { shouldUpdateAge,  newAgeUpdateTime } = 
        checkPetAgeAndFeeding(petData.lastFed,petData.feedCount, petData.lastAgeUpdate);
      
      if (shouldUpdateAge) {
        console.log('Updating age...');
        const petRef = doc(db, 'pets', userDetail.uid);
        const updatedData = {
          age: (petData.age || 0) + 1,
          lastAgeUpdate: newAgeUpdateTime
        };
        await updateDoc(petRef, updatedData);
        petData.age = updatedData.age;
      }
      
      // Then check feed count reset
      const { shouldReset, newResetTime } = checkAndResetFeedCount(petData.lastFeedReset);
      if (shouldReset) {
        console.log('Resetting feed count to 0...');
        const petRef = doc(db, 'pets', userDetail.uid);
        await updateDoc(petRef, {
          feedCount: 0,
          lastFeedReset: newResetTime
        });
        petData.feedCount = 0;
        petData.lastFeedReset = newResetTime;
      }
      setFeedCount(petData.feedCount || 0);
      setLastFeedReset(petData.lastFeedReset);
      setPet(petData);
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching pet:', error);
    setLoading(false);
  }
};

  const getMaxFeedCount = (age) => {
    if (age <= 1) return 3;
    return 5;
  };
  const feedPet = async () => {
    if (!userDetail || !pet) {
      Alert.alert('Error', 'Unable to feed pet at this time');
      return;
    }
    const maxFeed = getMaxFeedCount(pet.age);
    if (!userDetail.cash || userDetail.cash < 25) {
      alert('Not enough cash! You need $25 to feed your pet.')
      return
    }
    if (feedCount >= maxFeed) {
      const lastReset = new Date(pet.lastFeedReset);
      const now = new Date();
      const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
      
      if (hoursSinceReset < 1) {
        const minutesLeft = Math.ceil(60 - (hoursSinceReset * 60));
        alert(`Pet is full! Please wait ${minutesLeft} minutes before feeding again.`);
        return;
      }
    }
    try {
      setIsFeeding(true);
      setIsHungry(false);
      const newFeedCount = feedCount + 1;
      
      const petRef = doc(db, 'pets', userDetail.uid)
      await updateDoc(petRef, {
        lastFed: new Date().toISOString(),
        feedCount: newFeedCount,
      });
  
      setFeedCount(newFeedCount);

      // Calculate new cash value
      const newCash = userDetail.cash - 25

      // Deduct cash from user in database
      const userRef = doc(db, 'users', userDetail.email)
      await updateDoc(userRef, {
        cash: newCash
      })

      // Update local state
      setUserDetail({
        ...userDetail,
        cash: newCash
      })

      setTimeout(() => {
        setIsFeeding(false);
      }, 5000);
      // Refresh pet details
      getPetDetails()
    } catch (error) {
      console.error('Error feeding pet:', error)
      alert('Failed to feed pet')
      setIsFeeding(false);
    }
  }

  const createPet = async () => {
    if (!petName.trim()) {
      Alert.alert('Error', 'Please enter a name for your pet')
      return
    }
  
    try {
      setIsCreating(true);
      const now = new Date().toISOString(); 
      await setDoc(doc(db, 'pets', userDetail.uid), {
        name: petName,
        age: 0,
        happiness: 0,
        lastFed: now,
        lastAgeUpdate: now,
        ownerUid: userDetail.uid,
        feedCount: 0,
        lastFeedReset: now,
      })
  
      // Initialize user's cash in database
      const userRef = doc(db, 'users', userDetail.email)
      await updateDoc(userRef, {
        cash: cash
      })

      getPetDetails()
    } catch (error) {
      console.error('Error creating pet:', error)
    } finally {
      setIsCreating(false);
    }
  }
  const playWithPet = async () => {
    if (!userDetail || !pet) {
      Alert.alert('Error', 'Unable to play with pet at this time');
      return;
    }

    if (!userDetail.cash || userDetail.cash < 10) {
      alert('Not enough cash! You need $10 to play with your pet.')
      return
    }
    try {
      setIsPlaying(true);
      const petRef = doc(db, 'pets', userDetail.uid)
      const newHappiness = (pet?.happiness || 0) + 1
      await updateDoc(petRef, {
        happiness: newHappiness,
      })
      if (newHappiness >= 3) {
        setIsTired(true);
      }
      // Deduct cash from user
      const newCash = userDetail.cash - 10
      const userRef = doc(db, 'users', userDetail.email)
      await updateDoc(userRef, {
        cash: newCash
      })
  
      // Update local state
      setUserDetail({
        ...userDetail,
        cash: newCash
      })
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);
  
      // Refresh pet details
      getPetDetails()
    } catch (error) {
      console.error('Error playing with pet:', error)
      alert('Failed to play with pet')
      setIsPlaying(false);
    }
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading pet...</Text>
      </View>
    )
  }
  const putPetToSleep = async () => {
    try {
      setIsSleeping(true);
      setIsTired(false); 
      
      // Show sleeping animation for 3 seconds
      setTimeout(() => {
        setShowNightSky(true);
      }, 3000);
  
      // Wake up after 5 minutes (300000 milliseconds)
      setTimeout(async () => {

        const petRef = doc(db, 'pets', userDetail.uid);
        await updateDoc(petRef, {
          happiness: 0
        });


        setIsSleeping(false);
        setShowNightSky(false);
        setIsHungry(true);  // Set hungry state when waking up
        await getPetDetails();

      }, 120000);// 2mins
  
    } catch (error) {
      console.error('Error putting pet to sleep:', error);
      setIsSleeping(false);
      setShowNightSky(false);
    }
  };



  return (
    <ScrollView 
    contentContainerStyle={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    {!pet ? (
      <View style={styles.createPetContainer}>
        <View style={styles.createPetContainer}>
          <Text>Every 50 points gained = $10</Text>
          <Text style={styles.title}>Create Your Pet</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pet name"
            value={petName}
            onChangeText={setPetName}
          />
 <TouchableOpacity 
          style={styles.createButton}
          onPress={createPet}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.buttonText}>Create Pet</Text>
          )}
          </TouchableOpacity>
        </View>
        </View>
      ) : (
        <View style={styles.petContainer}>
        {showNightSky ? (
        <View style={styles.sleepContainer}>

       <LottieView
        source={require('./../../assets/animation/night.json')}
        style={styles.petAnimation}
        autoPlay
        loop
      />
      <Text style={styles.sleepText}>{pet.name} is sleeping...</Text>
    </View>
    
  ) : (
    <LottieView
      ref={animationRef}
      source={isFeeding 
        ? require('./../../assets/animation/feed.json')
        : isPlaying
          ? require('./../../assets/animation/play.json')
          : isSleeping
            ? require('./../../assets/animation/sleep.json')
            : require('./../../assets/animation/pet.json')
      }
      style={styles.petAnimation}
      autoPlay
      loop={!isFeeding && !isPlaying && !isSleeping}
      speed={0.4}
    />  )}
          {isHungry && !isSleeping && (
            <Text style={styles.hungryText}>{pet.name} is hungry!</Text>
          )}
          {isTired && !isSleeping && (
            <Text style={styles.tiredText}>{pet.name} is tired and wants to sleep! 😴</Text>
          )}
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petInfo}>Age: {pet.age}</Text>
        <Text style={styles.petInfo}>Happiness: {pet?.happiness || 0} ❤️</Text>
        <Text style={styles.petInfo}>Cash Available: ${userDetail?.cash || 0}</Text>
       
        {isFullMessage && feedCount >= 3 && (
        <Text style={styles.fullText}>{pet.name} is full!.</Text>
      )}
       
       <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${(feedCount / getMaxFeedCount(pet?.age || 0)) * 100}%` }]} />
    <Text style={styles.progressText}>Food Progress: {feedCount}/{getMaxFeedCount(pet?.age || 0)}</Text>
  </View>


        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.actionButton,  (!userDetail?.cash || userDetail?.cash < 25 || isSleeping || feedCount >= getMaxFeedCount(pet?.age || 0)) && styles.disabledButton]}
            onPress={feedPet}
            disabled={!userDetail?.cash || userDetail?.cash < 25 || isSleeping || feedCount >= getMaxFeedCount(pet?.age || 0)}
          >
            <Text style={styles.buttonText}>Feed Pet ($25)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
    style={[
      styles.actionButton, 
      (!userDetail?.cash || userDetail?.cash < 10 || isSleeping || isTired) && styles.disabledButton
    ]}
    onPress={playWithPet}
    disabled={!userDetail?.cash || userDetail?.cash < 10 || isSleeping || isTired}
  >
    <Text style={styles.buttonText}>Play ($10)</Text>
  </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, isSleeping && styles.disabledButton]}
            onPress={putPetToSleep}
            disabled={isSleeping}
          >
            <Text style={styles.buttonText}>Sleep</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
      </ScrollView>


)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#C2FFD4",
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  petContainer: {
    alignItems: 'center',
    width: '100%'
  },
  petImage: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  petName: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 10
  },
  petInfo: {
    fontSize: 18,
    fontFamily: 'outfit',
    marginBottom: 10
  },
  createButton: {
    backgroundColor: "#268242",
    padding: 15,
    borderRadius: 10,
    width: '80%'
  },
  feedButton: {
    backgroundColor: "#268242",
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginTop: 20
  },
  disabledButton: {
    backgroundColor: Colors.GRAY,
    opacity: 0.7
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'outfit-bold'
  },
  createPetContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'outfit',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#268242",
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  petAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  sleepContainer: {
    alignItems: 'center',
  },
  sleepText: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginTop: 10,
  },
  hungryText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  progressContainer: {
    width: '80%',
    height: 20,
    backgroundColor: Colors.GRAY,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: "#59C5A3",
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: 'outfit-bold',
    lineHeight: 20,
  },
  fullText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  tiredText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
})