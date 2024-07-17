import React, { useEffect, useState } from "react";
import { View ,Text,StyleSheet,Image} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";
import { HeaderBtn } from "../ExtraComponent";
import Color from "../../UI/Theme"; 


const GuideData = [
    {
        key : "s1",
        ImgSrc:require('../../../img/k2.jpg'),
        title:"This is title",
        description:"description",
        

    },
    {   key : "s2",
        ImgSrc:require('../../../img/k3.jpg'),
        title:"This is title",
        description:"description",
    },
    {
        key : "s3",
        ImgSrc:require('../../../img/k4.jpg'),
        title:"This is title",
        description:"description",
    },
    {
        key : "s4",
        ImgSrc:require('../../../img/k4.jpg'),
        title:"This is title",
        description:"description",
    },
    
]
const GuideStack = createNativeStackNavigator();
export default function GuideScreen({navigation}){
    const [item,setitem] = useState();
    const [test,setTest] = useState(true);
    useEffect(() => {
        if(test){
            //console.log("Start Guide Screen");
            setTest(false);
        }
    });
    const renderGuideScreen = () => { return(
        <View style = {styles.GuideScreen}>
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
            {GuideData.map((data,index) => 
            <View style={{flex:1,backgroundColor:data.backgroundColor}} key = {index}>
                <View style = {styles.ImgView} >
                    <Image
                        
                        source = {data.ImgSrc}
                        style = {styles.ImgImage}
                    />
                </View>
                <View style = {styles.ViewTitle}>
                    <Text style = {styles.title}>{data.title}</Text>
                    <Text style = {styles.description}>{data.description}</Text>
                </View>
                   
            </View>
                )}
            </Swiper>
        </View>
    )}
    
                
    return (
        <GuideStack.Navigator screenOptions={{ 
            tabBarShowLabel: false,
            headerStyle: {backgroundColor:Color.Primary.normal},
        }}>
            <GuideStack.Screen
                name = "GuideScreen"
                component = {renderGuideScreen}
                options={{ 
                    title: 'Hướng dẫn',
                    headerTitleStyle:styles.headerTitle,
                    headerTitleAlign: "left",
                    headerLeft: () => (
                        <HeaderBtn
                            onPress = {() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
        </GuideStack.Navigator>
        
    );
}
const styles = StyleSheet.create({
    GuideScreen:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        marginTop: 20
    },
    headerTitle:{
        color:"white",
        fontFamily: "sans-serif-medium",
        fontSize: 22,
    },
    ImgView:{
        flex:2,
        justifyContent:"center",
        alignItems:"center",
    },
    ImgImage:{
        width: "90%",
        height: "100%"
    },
    ViewTitle:{
        flex:1,
        alignItems:"center",
        paddingTop:10
    },
    title:{
        textAlign: "center",
        //fontFamily: "Roboto-Regular", 
        color: "#6A6A6A",
        fontSize:30, 
    },
    description:{
        textAlign: "center",
        //fontFamily: "Roboto-Regular",
        color: "#6A6A6A", 
        fontSize: 16, 
    },
});
