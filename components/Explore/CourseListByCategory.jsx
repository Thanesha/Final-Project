
import { View, StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { db } from "./../../config/firebaseConfig"
import Colors from "./../../constant/Colors"
import CourseList from "../Home/CourseList"
export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    GetCourseListByCategory()
  }, [category])

  const GetCourseListByCategory = async () => {
    setCourseList([])
    setLoading(true)
    try {
      const q = query(
        collection(db, "Courses"),
        where("category", "==", category),
        orderBy("createdOn", "desc"),
        limit(10),
      )

      const querySnapshot = await getDocs(q)

      querySnapshot?.forEach((doc) => {
        console.log("--", doc.data())
        setCourseList((prev) => [...prev, doc.data()])
      })
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  return (
    <View>{courseList?.length > 0 && <CourseList courseList={courseList} heading={category}  />}</View>
  )
}

const styles = StyleSheet.create({
  courseContainer: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    margin: 6,
    borderRadius: 15,
    width: 260,
    elevation: 1,
    borderWidth: 0.2,
  },
})

