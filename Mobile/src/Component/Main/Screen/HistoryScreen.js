import React, { useEffect } from "react";
import { View ,Text,StyleSheet,Image, TextInput,TouchableOpacity} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";

import Color from "../../UI/Theme";
import { HeaderBtn } from "../ExtraComponent";

const HistoryStack = createNativeStackNavigator();
const HistoryData = [

];

export default function HistoryScreen({navigation}){
    const renderScreen = () => {return(
        <View style = {styles.HistoryScreen}>
        <Swiper 
            loop horizontal = {true}
            dotStyle = {{
               bottom:80
            }}
            activeDotStyle = {{ 
                backgroundColor: Color.Primary.normal,
                width: 20,bottom:80
            }}
        >
            <View>
                <View style = {styles.TitleView}>
                    <Text style = {styles.Title}>Xin chào Lê Đăng Quang</Text>
                    <Text style = {styles.Description}>bạn có thể tra cứu lịch sử của bản thân hoặc người khác thông qua id người dùng</Text>
                </View>
                <View style = {styles.InputIDView} >
                    <View style={{flexDirection: "row",}}>
                        <Image
                            style = {styles.InputIDIcon}
                            source = {require('../../../img/userID.png')}
                        />
                        <TextInput
                            placeholder = {"Mã id người dùng"}
                            placeholderTextColor = {Color.Text.placeholder}
                            style = {styles.InputID}
                        />
                    </View>
                    <TouchableOpacity style = {styles.MainIconTouchableOpacity}>
                        <Image 
                            style = {styles.MainIconImg}
                            source = {require("../../../img/Find.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style = {styles.TitleView}>
                    <Text style = {styles.Title}>Lịch sử hoạt động thiết bị</Text>
                    <Text style = {styles.Description}>bạn có thể tra cứu lịch sử thiết bị bằng id của thiết bị</Text>
                </View>
                <View style = {styles.InputIDView} >
                    <View style={{flexDirection: "row",}}>
                        <Image
                            style = {styles.InputIDIcon}
                            source = {require('../../../img/deviceID.png')}
                        />
                        <TextInput
                            placeholder = {"Mã id thiết bị"}
                            placeholderTextColor = {Color.Text.placeholder}
                            style = {styles.InputID}
                        />
                    </View>
                    <TouchableOpacity style = {styles.MainIconTouchableOpacity}>
                        <Image 
                            style = {styles.MainIconImg}
                            source = {require("../../../img/Find.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>

        </Swiper>
    </View>
    )}
    return(
        <HistoryStack.Navigator screenOptions={{ 
            tabBarShowLabel: false,
            headerStyle: {backgroundColor:Color.Primary.normal},
        }}>
            <HistoryStack.Screen
                name = "HistoryScreen"
                component = {renderScreen}
                options={{ 
                    title:"Xem lại lịch sử",
                    headerTitleStyle:styles.headerTitle,
                    headerTitleAlign: "left",
                    headerLeft: () => (
                        <HeaderBtn
                            onPress = {() => navigation.openDrawer()}
                        />
                    ),
                    
                }}
            />
        </HistoryStack.Navigator>
    )
}
const styles = StyleSheet.create({
    HistoryScreen:{
        flex:1,
      
        marginTop: 20
    },
    headerTitle:{
        color:"white",
        fontFamily: "sans-serif-medium",
        fontSize: 22,
    },
    TitleView:{
        marginLeft:15
    },
    Title:{
        color:Color.Primary.normal,
        fontSize:20,
        fontWeight: 'bold'
    },
    Description:{
        marginTop:10,
        color:Color.Primary.normal,
        fontSize:15
    }, 
    InputIDIcon:{
        width: 30,
        height: 30,
        tintColor: Color.Primary.normal
    },
    InputIDView:{
        marginLeft: 15,
        marginTop: "5%",
        alignItems:"stretch",
        flexDirection: "row",
        borderBottomColor: Color.Text.underLine,
        borderBottomWidth: 1,
        paddingBottom: 2,
    },
    InputID:{
        bottom:6,
        left:10
    },
    MainIconImg:{
        width:15,
        height:15,
        tintColor:"white"
    },
    MainIconTouchableOpacity:{
        width:40,
        height:40,
        backgroundColor:Color.Primary.normal,
        borderRadius: 50,
        justifyContent:"center",
        alignItems:"center",
        left:150,
        bottom:6
    },
    
});
