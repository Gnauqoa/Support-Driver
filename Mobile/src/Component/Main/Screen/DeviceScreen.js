import React, { useState } from "react";
import { View ,Text,Image, TextInput,TouchableOpacity, ScrollView,StyleSheet} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Color from "../../UI/Theme";
import {CheckPassword, CountBox, Toggle,HeaderBtn} from "../ExtraComponent";
import { AddContext } from "../ScreenContext";

const DeviceStack = createNativeStackNavigator();
const dataScreen = [
    {
        text: "",
        placeholder:"số điện thoại",
        ImgSrc: require("../../../img/smartphone.png")
    }
];


export default function DeviceScreen({navigation}){
    const [FlagVisible, setFlagVisible] = useState(false);
    const [NumPhone, setNumPhone] = useState(dataScreen.length);
    const [FlagCall, setFlagCall] = useState(true);
    
    const renderDeviceScreen = (props) => {
        return(
        <View style = {styles.DeviceScreen}>
            <ScrollView  >
                <View style = {[styles.TitleView]}>
                    <Text style = {styles.Title}>Xin chào Lê Đăng Quang</Text>
                    <Text style = {styles.Description}>ID thiết bị của bạn là {252}, bạn có thể cài đặt, thay đổi dữ liệu của thiết bị tại Tab này</Text>
                </View>
                <CountBox
                    CountValue = {NumPhone}
                    SetCountUp = {()=>{
                        dataScreen.push(
                            {
                                text: "",
                                placeholder:"số điện thoại",
                                ImgSrc: require("../../../img/smartphone.png")
                            }
                        );
                        setNumPhone(NumPhone+1);
                    }}
                    SetCountDw = {()=>{
                        if(NumPhone == 1) return;
                        dataScreen.splice(NumPhone-1);
                        setNumPhone(NumPhone-1);
                    }}
                    text1 = "Bạn đã cài"
                    text2 = "số điện thoại"
                />
                {dataScreen.map((data,index)=>
                <View style = {styles.EditProfileView} key = {index}>
                    <Image
                        style = {styles.ProfileMainIcon}
                        source = {data.ImgSrc}
                    />
                    <TextInput
                        defaultValue = {data.text}
                        placeholder = {data.placeholder}
                        placeholderTextColor = {Color.Text.placeholder}
                        style = {styles.EditProfileInput}
                        editable = {data.disable}
                        onChangeText = {(textVal) => (dataScreen[index].text = textVal)}
                    />
                </View>
                )}
                <View style = {styles.EditProfileView}>
                    <Image
                        style = {styles.ProfileMainIcon}
                        source = {require("../../../img/call.png")}
                    />
                    <View style = {{justifyContent:"center",marginLeft:"3%"}}>
                        <Text >Gọi điện thoại </Text>
                    </View>
                    <Toggle
                        value = {FlagCall}
                        onValueChange = {() => setFlagCall(!FlagCall)}
                    />
                </View>
                <View style = {styles.EditProfileView}>
                    <Text style = {{fontSize:15}} >Bật tắt gọi điện thoại sau khi gửi tin nhắn cầu cứu đến các số điện thoại cài sẵn. </Text>
                </View>
            </ScrollView>
            <CheckPassword
                Close = {() => setFlagVisible(false)}
                FlagClose = {FlagVisible}
                checkTrueFunction = {() => {}}
                trueData = "quang123"
            />
            <TouchableOpacity  
                onPress = {() => setFlagVisible(true)}
                style = {styles.SaveButtonTouchableOpacity}>
                <Image
                    style = {styles.SaveButtonImg}
                    source = {require("../../../img/updated.png")}
                />
            </TouchableOpacity>
    
        </View>
        )
    }
    return(
    <DeviceStack.Navigator screenOptions={{ 
        tabBarShowLabel: false,
        headerStyle: {backgroundColor:Color.Primary.normal},
    }}>
        <DeviceStack.Screen
            name = "DeviceScreen"
            component = {AddContext(renderDeviceScreen)}
            options={{ 
                title:"Quản lí thiết bị",
                headerTitleStyle:styles.headerTitle,
                headerTitleAlign: "left",
                headerLeft: () => (
                    <HeaderBtn
                        onPress = {() => navigation.openDrawer()}
                    />
                ),
            }}
        />
    </DeviceStack.Navigator>
    )
}
const styles = StyleSheet.create({
    DeviceScreen:{
        flex:1,
    },

    headerTitle:{
        color:"white",
        fontFamily: "sans-serif-medium",
        fontSize: 22,
    },
    TitleView:{
        marginLeft:15,
        marginTop: 20
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
    EditProfileView:{
        marginLeft: 15,
        marginTop: "5%",
        alignItems:"stretch",
        flexDirection: "row",
        borderBottomColor: Color.Text.underLine,
        borderBottomWidth: 1,
        paddingBottom: 2
    },
    EditProfileInput:{
        color:Color.Text.text,
        marginLeft: 10,
    },
    ProfileMainIcon:{
        width: 30,
        height: 30,
        tintColor: Color.Primary.normal
    },
    SaveButtonTouchableOpacity: {
        position:"absolute",
        right:20,
        bottom:80,
        width:50,
        height:50,
        backgroundColor:Color.Primary.normal,
        borderRadius: 50,
        justifyContent:"center",
        alignItems:"center",
        marginTop: 20,
    },
    SaveButtonImg:{
        width:30,
        height:30,
        tintColor:"white"
    },

    CheckPasswordInput:{
        marginTop:0,
        paddingBottom:0,
    },
    alert:{
        marginLeft:10,
        marginTop: -20,
        color:"#dd2c00",
        fontSize:14
    },
    
})