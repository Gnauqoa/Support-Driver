import React, { useState,useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View ,Text,StyleSheet,Image,TextInput, TouchableOpacity,Dimensions,RefreshControl,ScrollView} from "react-native";

import { CheckPassword,CountBox,DateInput,PasswordInput,Toggle,HeaderBtn } from "../ExtraComponent";
import { AddContext } from "../ScreenContext";
import { getUserData } from "../../Network/getUserData";
import { uploadUserData } from "../../Network/uploadUserData";
import ModalSelector from "react-native-modal-selector";
import { tinh } from "../../Data/DataAddressVN";

import Color from "../../UI/Theme";
const ProfileStack = createNativeStackNavigator();
const {height,width} = Dimensions.get("window");
export default function ProfileScreen ({navigation}){
    return(
        <ProfileStack.Navigator
            screenOptions={{ 
                tabBarShowLabel: false,
                headerStyle: styles.header,
            }}
        >
            {/* <ProfileStack.Screen
                name = "MainProfileScreen"
                component = {AddContext(EditProfileScreen)}
                options={{ 
                    headerRight: () => (
                    <TouchableOpacity onPress = {()=>(props.navigation.navigate('EditProfileScreen'))}>
                        <Image
                            source = {require('../../../img/edit.png')}
                            style = {styles.EditProfileBtn}
                        />
                    </TouchableOpacity>
                    ),
                    title: 'Thông tin người dùng',
                    headerTitleStyle:styles.headerTitle,
                    headerTitleAlign: "center",
                }}
            /> */}
            <ProfileStack.Screen
                name = "EditProfileScreen"
                component = {AddContext(EditProfileScreen)}
                options={{ 
                    title: 'Sửa đổi thông tin',
                    headerTitleStyle:styles.headerTitle,
                    headerTitleAlign: "left",
                    headerLeft: () => (
                        <HeaderBtn
                            onPress = {() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
        </ProfileStack.Navigator>
    );
}



function EditProfileScreen(props){
    const [UserData,setUserData] = useState();
    const [AddressData,setAddressData] = useState();
    const [NumAdr,SetNumAdr] = useState();   

    const [reloadPage, setReloadPage] = useState(true);
    const [reloadUserData,setReloadUserData] = useState(true);
    useEffect(() => {
        LoadEditProfileScreen();
    });
    const LoadEditProfileScreen = () => {
        if(reloadUserData){
            console.log("Start Edit Profile Screen");
            getUserData(
                props.LoginData.session,
                props.LoginData.account,
                (value) => {setUserData(value)},
                (value) => {
                    setAddressData(value);
                    SetNumAdr(value.length);
                    setReloadPage(false);
                }
            ); 
            setReloadUserData(false); 
        }
    };
    const onReloadPage =  () => {
        setReloadUserData(true);
        setReloadPage(true);
    }
    const setUserArray = (data,valueSet,index) => {
        setUserData( 
            [ 
                ...UserData.slice(0, index),
                {
                    ...data,
                    value: valueSet
                },
                ...UserData.slice(index + 1)
            ]
        );
    };
    const setAddressArray = (data,valueSet,index) => {
        setAddressData( 
            [ 
                ...AddressData.slice(0, index),
                {
                    ...data,
                    ...valueSet
                },
                ...AddressData.slice(index + 1)
            ]
        );
    };
    
    if(UserData != undefined && AddressData != undefined)
    return(
        <View style = {{flex:1}}>
        <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing={reloadPage}
                    onRefresh={onReloadPage}
                />
            }
        >
            <View style = {[styles.AvatarView,{flexDirection:"column"}]}>
                <Image
                    style = {styles.avatar}
                    source = {require('../../../img/avatar.jpg')}
                />
                <TouchableOpacity style = {styles.EditAvatarView} onPress = {() => console.log(UserData)}>
                    <Text style = {styles.EditAvatarText}>Đổi avatar</Text>
                </TouchableOpacity>
            </View>
            {UserData.map((data,index) => {
                if(data.type == "password") 
                    return(
                        <View key = {index}>
                            <PasswordInput
                                ImgSrc = {data.ImgSrc}
                                text = {data.value}
                                placeholder = {data.placeholder}
                                onChangeText = {(value) => setUserArray(data,value,index)}
                            />
                        </View>
                    )
                if(data.type == "birth") 
                    return(
                        <View key = {index}>
                            <DateInput
                                ImgSrc = {data.ImgSrc}
                                defaultValue = {data.value}
                                placeholder = {data.placeholder}
                                onConfirm = {
                                    function (value){
                                        setUserArray(data,value,index);
                                    }
                                }
                            />
                        </View>
                    )
                if(data.type == "gender")
                    return(
                        <View key = {index} style = {styles.EditProfileView}>
                            <Image
                                style = {styles.ProfileMainIcon}
                                source = {data.ImgSrc}
                            />
                            <View style = {{justifyContent:"center",marginLeft:"3%"}}>
                                <Text > Nam </Text>
                            </View>
                            <Toggle
                                value = {data.value}
                                onValueChange = {() => {setUserArray(data, !UserData[index].value,index)}}
                                type = {true}
                            />
                            <View style = {{justifyContent:"center",marginLeft:"3%"}}>
                                <Text > Nữ </Text>
                            </View>
                        </View>
                    )
                if(data.type != "userID" && data.type != "email") 
                return(
                    <View style = {styles.EditProfileView} key = {index}>
                        <Image
                            style = {styles.ProfileMainIcon}
                            source = {data.ImgSrc}
                        />
                        <TextInput
                            defaultValue = {data.value}
                            placeholder = {data.placeholder}
                            placeholderTextColor = {Color.Text.placeholder}
                            style = {styles.EditProfileInput}
                            keyboardType = {data.type == undefined ? "default" : "number-pad"}
            
                            onChangeText ={ (value) => {setUserArray(data,value,index)}}
                        />
                    </View>
                )
            })}
            <CountBox
                text1 = "Bạn đã cài"
                text2 = "địa chỉ"
                CountValue = {NumAdr}
                SetCountUp = {()=>{
                    if(NumAdr == 5) return;
                    AddressData.push(
                        {
                            xa:"",
                            huyen:"",
                            tinh:"",
                        }
                    );
                    SetNumAdr(NumAdr+1);
                }}
                SetCountDw = {()=>{
                    if(NumAdr == 1) return;
                    AddressData.splice(NumAdr-1, 1);
                    SetNumAdr(NumAdr-1);
                }}
            />
            {AddressData.map((data,index) => 
                <AddressPicker
                    key = { "adr" + index }
                    defaultValue = {data}
                    onChange1 = {(value) => {
                        setAddressArray(
                            data,
                            {
                                tinh:value,
                                huyen:"",
                                xa:""
                            },
                            index
                        );
                    }}
                    onChange2 = {(value) => {
                        setAddressArray(
                            data,
                            {
                                huyen:value,
                                xa:""
                            },
                            index
                        );
                    }}
                    onChange3 = {(value) => {
                        setAddressArray(
                            data,
                            {
                                xa:value
                            },
                            index
                        );
                    }}
                />
            )}
            <View style = {styles.LastView}></View>
        </ScrollView>
        <CheckPassword
            checkTrueFunction = { () => 
                uploadUserData(
                    props.LoginData,UserData,AddressData,
                    () => {}
                ) 
            }
            trueData = {props.LoginData.password}
        />
        
        </View>
    )
    return(
        <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing={reloadPage}
                    onRefresh={onReloadPage}
                />
            }
        />
    )
}
const AddressPicker = (props) => {
    const index1 = props.defaultValue.tinh != "" ? tinh.findIndex(x => x.label == props.defaultValue.tinh) : null;
    const index2 = index1 != null && props.defaultValue.huyen != "" ? tinh[index1].huyen.findIndex(x => x.label == props.defaultValue.huyen) : null;
    const [idhuyen,setidhuyen] = useState(index1);
    const [idxa,setidxa] = useState(index2);
    return(
    <View style = {styles.EditProfileView} >
        <Image
            style = {styles.ProfileMainIcon}
            source = {require("../../../img/address.png")}
        />
        <ModalSelector
            data = {tinh}
            initValue = {props.defaultValue.tinh == null ? "tỉnh" : props.defaultValue.tinh}
            onChange = {(option)=>{setidhuyen(parseInt(option.key)); props.onChange1(option.label)}} 
            selectStyle = {styles.AddressPickerView}
            initValueTextStyle = {styles.AddressPickerInitText}
            optionTextStyle = {{color: "black"}}
        />
        <ModalSelector
            data = {tinh[idhuyen == null ? 0 : idhuyen].huyen}
            initValue = {props.defaultValue.huyen == null ? "tỉnh" : props.defaultValue.huyen}
            onChange = {(option)=>{setidxa(parseInt(option.key)); props.onChange2(option.label)}} 
            selectStyle = {styles.AddressPickerView}
            initValueTextStyle = {styles.AddressPickerInitText}
            optionTextStyle = {{color: "black"}}
            disabled = {idhuyen == null ? true : false}
        />
        <ModalSelector
            data = {tinh[idhuyen == null ? 0 : idhuyen].huyen[idxa == null ? 0 : idxa].xa}
            initValue = {props.defaultValue.xa == null ? "tỉnh" : props.defaultValue.xa}
            onChange = {(option)=>{props.onChange3(option.label)}} 
            selectStyle = {styles.AddressPickerView}
            initValueTextStyle = {styles.AddressPickerInitText}
            optionTextStyle = {{color: "black"}}
            disabled = {idxa == null ? true : false}
        />
    </View>
    )
}
const styles = StyleSheet.create({
    header:{
        backgroundColor: Color.Primary.normal,
    },
    headerTitle:{
        color:"white",
        fontFamily: "sans-serif-medium",
        fontSize: 22,
    },
    AvatarView:{
        flex:1,
        alignItems:"center",
        flexDirection:"row"
    },
    avatar:{
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: "white",
        margin: 20
    },
    hiText:{
        fontSize: 15,
    },
    userName:{
        fontSize: 19,
        marginBottom:"5%"
    },
    ProfileMainView:{
        marginLeft: 15,
        marginBottom: "5%",
        alignItems:"stretch",
        flexDirection: "row",
        borderBottomColor: Color.Text.underLine,
        borderBottomWidth: 1,
        paddingBottom: 2
    },
    ProfileMainIcon:{
        width: 30,
        height: 30,
        tintColor: Color.Primary.normal
    },
    ProfileMainText:{
        fontSize:15,
        marginLeft: "4%"
    },
    EditProfileBtn:{
        width:25,
        height:25,
        tintColor: "black"
    },
    EditAvatarView:{
        backgroundColor:Color.Primary.normal,
        height: 50,
        width: 150,
        borderRadius: 20,
        alignItems:"center",
        justifyContent:"center"
    },
    EditAvatarText:{
        fontSize: 16,
        color: "white"
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
    CounterView:{
        alignItems:"center",
        marginTop: 10,
        marginBottom: -10
    },
    CounterText:{
        color : Color.Primary.normal,
        fontSize: 18,
        marginTop: 10
    },
    CounterShowView:{
        width:50,
        height:50,
        backgroundColor: Color.Primary.normal,
        borderRadius: 15,
        marginTop: 10,
        justifyContent: "center",
        alignItems:"center",
    },
    CounterShowText:{
        color:"white",
        fontSize: 20,
    },
    CounterBtnView:{
        alignItems:"center",
        justifyContent:"center"
    },
    CounterBtnImg:{
        width:40,
        height:40,
        tintColor:Color.Primary.normal
    },
    LastView:{
        marginBottom:height*20/100
    },
    AddressPickerText:{
        fontSize: 12,
        color: Color.Text.text
    },
    AddressPickerView:{
        width: width*20/100,
        marginLeft: width*5/100
    },
    AddressPickerInitText:{
        fontSize: 15,
        color: Color.Text.text
    }
}); 
// function MainProfileScreen(props){
//     const UserData = props.UserData;
//     const AddressData = props.AddressData;
   
//     if(UserData != undefined && AddressData != undefined)
//     return(
//         <SafeAreaView style = {{flex:1}}>
//         <ScrollView>
//             <View style = {styles.AvatarView}>
//                 <Image
//                     style = {styles.avatar}
//                     source = {require('../../../img/avatar.jpg')}
//                 />
//                 <View>
//                     <Text style = {styles.hiText}>Xin chào</Text>
//                     <Text style = {styles.userName}>{UserData[1].value}</Text>
//                 </View>
//             </View>
//             {UserData.map( (data,index) => {
               
                
//                 if(data.disable != false && data.type != "password")
//                 return(
//                     <View style = {styles.ProfileMainView} key = {index+"21"}>
//                         <Image
//                             style = {styles.ProfileMainIcon}
//                             source = {data.ImgSrc}
//                         />
                        
//                         <Text style = {[styles.ProfileMainText,data.value == undefined ? {color:Color.Text.placeholder}:null ]}>
//                             {data.type == "birth" ?  
//                                 Moment(data.value).format('DD-MM-YYYY') 
//                                 :( data.type != "gender" ?
//                                     ( data.value != undefined ? 
//                                         data.value 
//                                         : data.placeholder+ " (chưa có)")
//                                     : data.value ? "nữ" : "nam")}
//                         </Text>
                        
//                     </View>
//                 )
//             }
//             )}  
//             {AddressData.map( (data,index) => 
//                 <View style = {styles.ProfileMainView} key = {index}>
//                     <Image
//                         style = {styles.ProfileMainIcon}
//                         source = {require("../../../img/address.png")}
//                     />
//                     <Text style = {styles.ProfileMainText}>{ data.xa + ", " + data.huyen + ", " + data.tinh}</Text>
//                 </View>
//             )}   
//             <View style = {styles.LastView}></View>
//         </ScrollView></SafeAreaView>
//     )
//     return(
//         <WaitLoading
//             onRefresh = {() => {getUserData(
//                 props.LoginData.session,props.LoginData.account,
//                 (data) => props.updateUserData(data),
//                 (data) => props.updateAddressData(data)
//             )}}
//         />
//     )
// }