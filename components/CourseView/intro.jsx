
// new


import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native"
import { useContext, useState, useEffect } from "react"
import { imageAssets } from "./../../constant/option"
import { db } from "././../../config/firebaseConfig"
import { UserDetailContext } from "./../../context/UserDetailContext"
import Colors from "./../../constant/Colors"
import { useRouter } from "expo-router"
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore"

export default function Intro({ course, enroll }) {
  const router = useRouter()
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [loading, setLoading] = useState(false)
  const [hasCourse, setHasCourse] = useState(false)
  const [existingCourseId, setExistingCourseId] = useState(null)
  const [isOwnCourse, setIsOwnCourse] = useState(false);


 
useEffect(() => {
  checkExistingCourse();
  checkOwnCourse();
}, [userDetail.email, course.courseTitle]);

const checkOwnCourse = async () => {
  if (!userDetail?.email || !course?.createdBy) {
    return;
  }

  if (userDetail.email === course.createdBy) {
    setIsOwnCourse(true);
  } else {
    setIsOwnCourse(false);
  }
};
const checkExistingCourse = async () => {
  console.log("Checking for existing course...");
  if (!userDetail?.email || !course?.courseTitle) {
    console.log("User detail or course title is missing.");
    return;
  }

  console.log("User Email:", userDetail.email);
  console.log("Course Title:", course.courseTitle);

  try {
    const coursesRef = collection(db, "Courses");
    const q = query(
      coursesRef,
      where("createdBy", "==", userDetail.email),
      where("courseTitle", "==", course.courseTitle)
    );

    const querySnapshot = await getDocs(q);
    console.log("Query Snapshot:", querySnapshot);

    if (!querySnapshot.empty) {
      setHasCourse(true);
      setExistingCourseId(querySnapshot.docs[0].id);
      console.log("Course found:", querySnapshot.docs[0].id);
    } else {
      setHasCourse(false);
      console.log("No existing course found.");
    }
  } catch (error) {
    console.error("Error checking existing course:", error);
  }
};

 

  const onEnrollCourse = async () => {
    const docId = Date.now().toString();
    setLoading(true);
    
    // Check if the course already exists using courseTitle and user email
    const coursesRef = collection(db, "Courses");
    const q = query(
        coursesRef,
        where("createdBy", "==", userDetail.email),
        where("courseTitle", "==", course.courseTitle)
    );
    const querySnapshot = await getDocs(q);
    console.log("Query Snapshot:", querySnapshot);
    if (!querySnapshot.empty) {
        // Course already exists, navigate to it
        const existingDoc = querySnapshot.docs[0];
        router.push({
            pathname: "/courseView/" + existingDoc.id,
            params: {
                courseParams: JSON.stringify(existingDoc.data()),
                addCourse: false,
            },
        });
        setLoading(false);
        return;
    }

    // Add new course
    const data = {
        ...course,
        createdBy: userDetail?.email,
        createdOn: new Date(),
        completedChapter: [], // Reset completed chapters
        progress: 0, // Reset progress
        userPoints: 0 // Reset points for this course
    };
    
    await setDoc(doc(db, "Courses", docId), data);
    router.push({
        pathname: "/courseView/" + docId,
        params: {
            courseParams: JSON.stringify(data),
            addCourse: false,
        },
    });
    setLoading(false);
};

const renderButton = () => {
  if (isOwnCourse) {
    return (
     null
    );
  }

  if (hasCourse) {
    return (
      <Text style={styles.alreadyHaveText}>You already have this course.</Text>
    );
  }else{

  return (
    <TouchableOpacity disabled={loading} onPress={onEnrollCourse} style={styles.button}>
      <Text style={styles.text}>{loading ? "Adding..." : "Add to courses"}</Text>
    </TouchableOpacity>
  );
}
};
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      
      <Image
        source={imageAssets[course?.banner_image]}
        style={{
          width: "100%",
          height: 280,
        }}
      />
      <View
        style={{
          padding: 20,
          marginTop: -10,
          backgroundColor: Colors.WHITE,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          {course?.courseTitle}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
              color: Colors.PRIMARY,
            }}
          >
            {course?.chapters?.length} Chapters
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Description:
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY,
          }}
        >
          {course?.description}
        </Text>
       
      </View>
      {renderButton()}


    </View>
    
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  startButton: {
    backgroundColor: Colors.GREEN,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
  alreadyHaveText: {
    fontSize: 18,
    color: "green", // Change color to green for visibility
    fontWeight: "bold", // Make the text bold
    marginTop: 20, // Add some margin for spacing
},
})
