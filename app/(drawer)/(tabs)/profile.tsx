import React, {useLayoutEffect} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from "@/hooks/useAuth";
import {useNavigation} from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import AntDesign from "@react-native-vector-icons/ant-design";
import {LinearBgView} from "@/components/LinearBg";
import {Avatar} from "@/components/ui/Avatar";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import DrawingCameraIcon from "@/components/ui/DrawingCameraIcon";

export default function ProfileScreen() {
    const {userProfile, user} = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <CustomHeader
                    title={"Your Profile"}
                    showBackButton={true}
                    headerInMiddle={true}
                    rightAction={
                        <TouchableOpacity onPress={() => Alert.alert("More", "More actions to be added.")}>
                            <AntDesign name={"more"} size={24} color="white"/>
                        </TouchableOpacity>
                    }
                />
            )
        })
    }, [navigation]);

    return (
        <LinearBgView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                {user && (
                    <View style={styles.infoContainer}>
                        <Avatar imageUrl={user?.photoURL || ""} avatarBorderWidth={4} avatarBorderColor={"#0094ff"}/>
                        <Text
                            style={[styles.text, styles.nameText]}>{userProfile?.fullName || userProfile?.email}</Text>
                        <Text style={[styles.roleText, styles.text]}>{userProfile?.role?.toUpperCase()}</Text>
                        <Text style={styles.descriptionText}>A professional vehicle enthusiast and car collector</Text>
                    </View>
                )}
                <View style={{backgroundColor: "#10181E", paddingVertical: 20}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", padding: 10}}>
                        <Text style={styles.text}>Your garage</Text>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={styles.text}>Condition</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" style={{marginLeft: 5}}/>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require("../../../assets/images/cars/garage1.png")}
                    />
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 20}}>
                    <Text style={styles.text}>Gallery</Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginRight: 40,
                        gap: 30
                    }}>
                        <TouchableOpacity style={{backgroundColor: "#1C293A", borderRadius: 10, padding: 5}}>
                            <Ionicons name="chevron-back" size={24} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: "#1C293A", borderRadius: 10, padding: 5}}>
                            <Ionicons name="chevron-forward" size={24} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*camera open*/}
                <TouchableOpacity>
                    <DrawingCameraIcon size={56}/>
                </TouchableOpacity>
                <View style={{paddingVertical: 50}}/>
            </ScrollView>
        </LinearBgView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    nameText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    roleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },
    text: {
        color: 'white'
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 10,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: '#ccc',
        fontFamily: 'Montserrat-Regular',
    }
});