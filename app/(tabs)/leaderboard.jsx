import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from './../../context/UserDetailContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const getRank = (level) => {
    if (level < 10) return 'Beginner';
    if (level < 20) return 'Intermediate';
    if (level < 30) return 'Advanced';
    return 'Expert';
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        const sortedList = userList.sort((a, b) => b.level - a.level);
        const top5Users = sortedList.slice(0, 5);
        setLeaderboardUsers(top5Users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading leaderboard...</Text>
      </View>
    );
  }

  if (!userDetail) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your progress</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboardUsers && leaderboardUsers.length > 0 ? (
        <FlatList
          data={leaderboardUsers}
          keyExtractor={item => item.uid}
          renderItem={({ item, index }) => (
            <View style={styles.userContainer}>
              <Text style={styles.rank}>{index + 1}.</Text>
              <Image source={{ uri: `data:image/png;base64,${item.profileImage}` }} style={styles.userImage} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text>Level: {item.level}</Text>
                <Text>Total Points: {item.point}</Text>
              </View>
            </View>
          )}
          horizontal={true} // make the list horizontal
          showsHorizontalScrollIndicator={false} // hide the scrollbar
          contentContainerStyle={styles.carousel} // style the carousel
          />
      ) : (
        <Text>No users available</Text>
      )}
    <Text style={styles.userProgressTitle}>Your Progress</Text>
<View style={styles.userProgressContainer}>
    <View style={styles.userProgressRow}>
        <View style={{ flex: 1 }}>
        <Image source={require('./../../assets/images/trophy.png')}
                style={{
                    height: 50,
                    width: '50%',
                    resizeMode: 'contain',
                    alignSelf: 'center'
                }}
            />
          <Text  style={styles.userProgressLabel}>Level:</Text>
          <Text style={styles.userProgressValue}>{userDetail.level}</Text>
        </View>
        <View style={{ flex: 1 }}>
        <Image source={require('./../../assets/images/gamification.png')}
                style={{
                    height: 50,
                    width: '50%',
                    resizeMode: 'contain',
                    alignSelf: 'center'
                }}
            />
          <Text style={styles.userProgressLabel}>Total Points:</Text>
          <Text style={styles.userProgressValue}>{userDetail.point}</Text>
        </View>
        <View style={{ flex: 1 }}>
        <Image source={require('./../../assets/images/reward.png')}
                style={{
                  height: 50,
                  width: '50%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  
              }}
            />
          <Text style={styles.userProgressLabel}>Rank:</Text>
          <Text style={styles.userProgressValue}>{getRank(userDetail.level)}</Text>
        </View>
      </View>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carousel: {
    paddingVertical: 20,
  },
  userProgressContainer: {
    backgroundColor: '#ccc',
    padding: 20,
    marginBottom: 170,
  },
  userProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  userProgressTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 20, 
  },
  userProgressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',  
    
  },
  userProgressValue: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',  },
});