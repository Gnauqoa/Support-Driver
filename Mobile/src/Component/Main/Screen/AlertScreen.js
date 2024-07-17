import React, { useState,useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View ,Text,StyleSheet,Image, TouchableOpacity,Dimensions,RefreshControl,ScrollView} from "react-native";

import { CheckPasswordAcceptAlert,HeaderBtn } from "../ExtraComponent";
import { AddContext } from "../ScreenContext";
import Color from "../../UI/Theme";

import { getAlerAccepttData, getAlertData } from "../../Network/getAlert";


const AlertStack= createNativeStackNavigator();
const {height,width} = Dimensions.get("window");
let IDdeviceAccept;
function MainAlertScreen(props) {
    const [AlertData,setAlertData] = useState();
    const [FlagVisible,setFlagVisible] = useState(false);
    const [reloadPage, setReloadPage] = useState(true);
    const [reloadAlertData,setReloadAlertData] = useState(true);
    useEffect(() => {
        LoadAlertScreen();
    });
    const LoadAlertScreen = () => {
        if(reloadAlertData){
            getAlertData(
                props.LoginData.session,
                props.LoginData.account,
                (value) => setAlertData(value),
                () => {
                    setReloadAlertData(false);
                    setReloadPage(false);
                }
            );   
        }
    }
    const acceptAlert = (IDdevice) => {
        IDdeviceAccept = IDdevice;
        setFlagVisible(true);
    }
    const GetDataAlertAccept = () => {
        setReloadPage(true);
        getAlerAccepttData(
            props.LoginData.session,
            props.LoginData.account,
            IDdeviceAccept,
            (value) => {
                const newAlertData = AlertData;
                const index = newAlertData.findIndex((element) => element.IDdevice == IDdeviceAccept);
                newAlertData[index] = value;
                setAlertData(newAlertData);
            },
            () => {
                setReloadPage(false);
            }
        );
        return 1;
    }
    const onReloadPage =  () => {        
        setReloadPage(true);
        setReloadAlertData(true);
    }
    return(
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={reloadPage}
                    onRefresh={onReloadPage}
                />
            }
        >
            {AlertData != undefined && AlertData.length > 0 ? AlertData.map((data,index) => {
                if(data.status == 1)
                return(
                    <View key = {index+"alert"} style = {styles.notificationView} >
                    <View style = {styles.notificationImgView}>
                        <Image
                            source = {require("../../../img/accident.png")}
                            style = {styles.notificationImg}
                        />
                    </View>
                    <View style = {styles.notificationTextView}>
                        <Text style = {styles.notificationText}>Bị tai nạn</Text>
                        { data.address.map((addressData,indexAddress) => 
                            <View  key = {indexAddress + index + "alert"}>
                                <Text numberOfLines = {3} style = {styles.notificationText}>Vị trí: {addressData.xa}, {addressData.huyen}, {addressData.tinh}</Text>
                                <Text style = {styles.notificationText}>Thời gian: {addressData.time}</Text>
                            </View>
                        )}
                        {data.confirm != undefined ?
                            <Text style = {styles.notificationText}>Link google map: http://maps.google.com/maps?q=loc:{addressData.coordinates}</Text>
                        
                        :
                        <View>
                            <TouchableOpacity onPress ={() => acceptAlert(data.IDdevice)}>
                                <Text 
                                    style = {[styles.notificationText,{fontWeight: "bold"}]}
                                > Nhấn vào đây để xác nhận và nhận link google map</Text>
                            </TouchableOpacity>
                            <CheckPasswordAcceptAlert
                                checkTrueFunction = {() => GetDataAlertAccept()}
                                setFlagVisible = {setFlagVisible}
                                FlagVisible = {FlagVisible}
                                trueData = {props.LoginData.password}
                            />
                        </View>
                        }
                    </View>
                    
                    </View>
                )
                else return (
                    <View key = {index+"alert"} style = {styles.notificationView2} >
                    
                    <View style = {styles.notificationImgView2}>
                        <Image
                            source = {require("../../../img/robbery.png")}
                            style = {styles.notificationImg2}
                        />
                    </View>
                    <View style = {styles.notificationTextView2}>
                        <Text style = {styles.notificationText2}>Bị cướp</Text>
                        <View style = {styles.notificationMargin}></View>
                        { data.address.map((addressData,indexAddress) => 
                            <View  key = {indexAddress + index + "alert"}>
                                {indexAddress == 0 ? 
                                    <View>
                                        <Text style = {styles.notificationText2}>Thời gian xảy ra: {addressData.time}</Text>
                                        <Text numberOfLines = {3} style = {styles.notificationText2}>Địa điểm xảy ra: {addressData.xa}, {addressData.huyen}, {addressData.tinh}</Text>
                                    </View>
                                    :
                                    <View>
                                        {indexAddress == 1 && 
                                            <Text style = {styles.notificationText2}>Lịch trình di chuyển: </Text>
                                        }
                                        <Text style = {styles.notificationText2}>Thời gian: {addressData.time}</Text>
                                        <Text numberOfLines = {3} style = {styles.notificationText2}>Vị trí: {addressData.xa}, {addressData.huyen}, {addressData.tinh}</Text>
                                    </View>
                                }
                                <View style = {styles.notificationMargin}></View>
                                {data.confirm != undefined &&
                                    <Text style = {styles.notificationText2}>Link google map: http://maps.google.com/maps?q=loc:{addressData.coordinates}</Text>
                                }
                            </View>
                        )}
                        {data.confirm == undefined &&
                        <View>
                            <TouchableOpacity onPress ={() => acceptAlert(data.IDdevice)}>
                                <Text 
                                    style = {[styles.notificationText2,{fontWeight: "bold"}]}
                                > Nhấn vào đây để xác nhận và nhận link google map</Text>
                            </TouchableOpacity>
                            <CheckPasswordAcceptAlert
                                checkTrueFunction = {() => GetDataAlertAccept()}
                                setFlagVisible = {setFlagVisible}
                                FlagVisible = {FlagVisible}
                                trueData = {props.LoginData.password}
                            />
                        </View>
                        }
                    </View>
                        
                    </View>
                )}):
                <View style = {{alignItems:"center",justifyContent:"center"}}>
                    <Text style = {{fontSize: 18}}>Không có người bị tai nạn trong khu vực</Text>
                </View>
            }
        </ScrollView>
    )

}


export default function AlertScreen({navigation}){
    return(
    <AlertStack.Navigator screenOptions={{ 
        tabBarShowLabel: false,
        headerStyle: {backgroundColor:Color.Primary.normal},
    }}>
        <AlertStack.Screen
            name = "AlertScreen"
            component = {AddContext(MainAlertScreen)}
            options={{ 
                title:"Người bị tai nạn, cướp",
                headerTitleStyle:styles.headerTitle,
                headerTitleAlign: "left",
                headerLeft: () => (
                    <HeaderBtn
                        onPress = {() => navigation.openDrawer()}
                    />
                ),
            }}
        />
    </AlertStack.Navigator>
    );
}
















const styles = StyleSheet.create({
    AlertScreen:{
        flex:1,
    },
    headerTitle:{
        color:"white",
        fontFamily: "sans-serif-medium",
        fontSize: 22,
        
    },
    notificationView:{
        flex:1,
        marginTop: "5%",
        paddingBottom: height*1/100,
        paddingTop: height*1/100,
        borderRadius: 15,
        backgroundColor:Color.Primary.normal,
        flexDirection: "row",
        width: width*80/100,
        marginLeft: (width - (width*80/100))/2,
        marginRight: (width - (width*80/100))/2,
        alignItems:"center"
    },
    notificationView2:{
        flex:1,
        marginTop: "5%",
        paddingBottom: height*1/100,
        paddingTop: height*1/100,
        borderRadius: 15,
        backgroundColor:"white",
        flexDirection: "row",
        width: width*80/100,
        marginLeft: (width - (width*80/100))/2,
        marginRight: (width - (width*80/100))/2,
        alignItems:"center"
    },
 
    notificationText:{
        color:"white",
        fontSize: height*0.021,
        marginRight: (width - (width*80/100)),
        marginBottom:  height*0.002
    },
    notificationText2:{
        color:"black",
        fontSize: height*0.021,
        marginRight: (width - (width*80/100)),
        marginBottom:  height*0.003
    },
    notificationMargin:{
        marginBottom: height*1/100
    },
    notificationImgView:{
        backgroundColor: "white",
        height: height*0.054,
        width: height*0.054,
        borderRadius: height*0.054/2,
        justifyContent:"center",
        alignItems:"center",
        marginLeft: width*5/100,
        marginRight: width*5/100
    },
    notificationImgView2:{
        backgroundColor: Color.Primary.normal,
        height: height*0.054,
        width: height*0.054,
        borderRadius: height*0.054/2,
        justifyContent:"center",
        alignItems:"center",
        marginLeft: width*5/100,
        marginRight: width*5/100
    },
    notificationImg:{
        width:  height*0.040,
        height: height*0.040,
        tintColor: Color.Primary.light,
    },
    notificationImg2:{
        width:  height*0.040,
        height: height*0.040,
        tintColor:  "white",
    }
});
