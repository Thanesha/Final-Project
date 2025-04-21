
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { imageAssets } from "./../../constant/option";
import Colors from "./../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function CourseList({ courseList, heading = "Courses", enroll = true }) {
    const route = useRouter();

    return (
        <View style={{ marginTop: 15 }}>
           
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>{heading}</Text>
                <TouchableOpacity onPress={() => route.push('/Mycourse')}>
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={courseList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const totalPoints = item?.chapters?.reduce((total, chapter) => total + (chapter.points || 0), 0);
                    return (
                        <TouchableOpacity
                            onPress={() => route.push({
                                pathname: '/courseView/' + item?.docId,
                                params: {
                                    courseParams: JSON.stringify(item),
                                    enroll: enroll
                                }
                            })}
                            key={index}
                            style={styles.courseContainer}
                        >
                            <Image
                                source={imageAssets[item.banner_image]}
                                style={{ width: '100%', height: 150, borderRadius: 15 }}
                            />
                            <Text style={{ fontFamily: 'outfit-bold', fontSize: 18, marginTop: 10 }}>
                                {item?.courseTitle}
                            </Text>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                                <Ionicons name="book-outline" size={20} color="black" />
                                <Text style={{ fontFamily: 'outfit' }}>
                                    {item?.chapters?.length} Chapters
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                                <Ionicons name="star-outline" size={20} color="black" />
                                <Text style={{ fontFamily: 'outfit' }}>
                                    {totalPoints || 0} Points
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    courseContainer: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        margin: 6,
        borderRadius: 15,
        width: 260,
        elevation: 1,
        borderWidth: 0.2
    }
});