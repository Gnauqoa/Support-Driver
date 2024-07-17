import React, { useState } from "react";
import  Dialog  from "react-native-dialog";
import { View ,Text,Image,TouchableOpacity, Switch ,TextInput ,StyleSheet,Dimensions,ScrollView,RefreshControl,SafeAreaView,ActivityIndicator} from "react-native";
import Color from "../UI/Theme"
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { Alert } from "react-native";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export function HeaderBtn(props) {
    return(
        <TouchableOpacity onPress = {props.onPress}>
            <Image
                source = {require('../../img/menu.png')}
                style = {[styles.ProfileMainIcon,{tintColor:"white",marginRight:30}]}
            />
        </TouchableOpacity>
    )
}
export const formatDate = (dateString) => {
    if(dateString == undefined) return;
    var p = dateString.split(/\D/g)
    return [p[2],p[1],p[0] ].join("-")
}

export function DateInput(props) {
    const [date,setDate] = useState(Moment(props.defaultValue).format('DD-MM-YYYY'));
    const [show,setShow] = useState(false);
  
    return(
    <View>
        <TouchableOpacity style = {styles.EditProfileView} onPress = {() => setShow(true)}>
            <Image
                style = {styles.ProfileMainIcon}
                source = {props.ImgSrc}
            />
            <Text style = {[styles.EditProfileInput,date == undefined ? {color:Color.Text.placeholder}:null ]}>
                {date != undefined ? date : props.placeholder+ " (chưa có)"}
            </Text>
        </TouchableOpacity>
        <DateTimePicker
            value = {props.defaultValue}
            isVisible={show}
            testID = "dateTimePicker"
            mode = {"date"}
            onConfirm = {(data) => {
                props.onConfirm(data);
                setDate(Moment(data).format('DD-MM-YYYY'));
                setShow(false);
            }}
            onCancel = {() => setShow(false)}
        />
    </View>
    )
    
}
export function PasswordInput(props) {
    const [show,setShow] = useState(false);
    return(
        <View style = {styles.EditProfileView}>
            <Image
                style = {styles.ProfileMainIcon}
                source = {props.ImgSrc}
            />
            <TextInput
                defaultValue = {props.text}
                placeholder = {props.placeholder}
                placeholderTextColor = {Color.Text.placeholder}
                style = {styles.EditProfileInput}
                onChangeText ={props.onChangeText}
                secureTextEntry = {!show}
                
            />
            <TouchableOpacity onPress = {() => setShow(!show)}>
            <Image
                style = {styles.ProfileMainIcon}
                source = {show ? require("../../img/show.png"): require("../../img/notshow.png")}
            />
            </TouchableOpacity>
        </View>
    )
    
}
export function Toggle(props){
    const [Gender,setGender] = useState(props.value);
    const click = () =>{
        props.onValueChange();
        setGender(!Gender);
    }
    if(props.trackColor == undefined)
    return(
        <Switch
            trackColor={{ false: props.type == undefined ? "#767577" : Color.Primary.normal, true: Color.Primary.normal }}
            thumbColor={!Gender ? (props.type == undefined  ? "#bdbdbd" : Color.Primary.dark) : Color.Primary.dark}
            onValueChange={click}
            value={Gender}
        />
    );
    return(
        <Switch
            trackColor={{ false: props.type == undefined ? Color.Primary.light : Color.Primary.light, true: Color.Secondary.normal }}
            thumbColor={!Gender ? (props.type == undefined  ? Color.Primary.dark : Color.Primary.dark) : Color.Secondary.dark}
            onValueChange={click}
            value={Gender}
        />
    );
}
export function CheckPasswordAcceptAlert(props){
    const [ShowError,setShowError] = useState(false);
    const [InputData,setInputData] = useState("");
    const [Loading,setLoading] = useState(false);
    const checkInputData = async() =>{
        if(InputData != props.trueData){
            setShowError(true);
            if(props.checkFalseFunction != undefined) 
                props.checkFalseFunction();
            return;
        }
        setShowError(false);
        setLoading(true);
        const check = await props.checkTrueFunction()
        if(check == 1)
            Alert.alert("","Chấp nhận thành công");
        else Alert.alert("","Xảy ra lỗi: " + check);
        setLoading(false);
        props.setFlagVisible(false);
    }
    return(
    <View>
        {!Loading ?
        <Dialog.Container 
            onBackdropPress = {() => props.setFlagVisible(false)}
            useNativeDriver
            visible={props.FlagVisible} 
        >
            <Dialog.Title>Xác nhận mật khẩu</Dialog.Title>
            <Dialog.Input onChangeText = {(data) => setInputData(data)} style = {styles.CheckPasswordInput} placeholder = "nhập mật khẩu"></Dialog.Input>
            {ShowError && <Text style = {styles.alert}>Sai mật khẩu</Text>}
            <Dialog.Button color = {Color.Primary.normal} label="Hủy bỏ" onPress={() => props.setFlagVisible(false)} />
            <Dialog.Button color = {Color.Primary.normal} label="Xác nhận" onPress={() => checkInputData()} />    
            
        </Dialog.Container> 
        :
        <Dialog.Container 
            onBackdropPress = {() => props.setFlagVisible(false)}
            useNativeDriver
            visible={props.FlagVisible} 
        >   
            <ActivityIndicator size="large" color={Color.Primary.normal}/>
        </Dialog.Container>
        }
    </View>
    )
}
export function CheckPassword(props){
    const [ShowError,setShowError] = useState(false);
    const [InputData,setInputData] = useState("");
    const [FlagVisible,setFlagVisible] = useState(false);
    const [Loading,setLoading] = useState(false);
    const checkInputData = async() =>{
        if(InputData != props.trueData){
            setShowError(true);
            if(props.checkFalseFunction != undefined) 
                props.checkFalseFunction();
            return;
        }
        setShowError(false);
        setLoading(true);
        const check = await props.checkTrueFunction()
        if(check == 1)
        Alert.alert("","Cập nhật thành công");
       
        else Alert.alert("","Cập nhật thất bại, lỗi: " + check);
        setLoading(false);
        setFlagVisible(false);
    }
    return(
    <View>
        {!Loading ?
        <Dialog.Container 
            onBackdropPress = {() => setFlagVisible(false)}
            useNativeDriver
            visible={FlagVisible} 
        >
        
            <Dialog.Title>Xác nhận mật khẩu</Dialog.Title>
            <Dialog.Input onChangeText = {(data) => setInputData(data)} style = {styles.CheckPasswordInput} placeholder = "nhập mật khẩu"></Dialog.Input>
            {ShowError && <Text style = {styles.alert}>Sai mật khẩu</Text>}
            <Dialog.Button color = {Color.Primary.normal} label="Hủy bỏ" onPress={() => setFlagVisible(false)} />
            <Dialog.Button color = {Color.Primary.normal} label="Xác nhận" onPress={() => checkInputData()} />    
            
        </Dialog.Container> 
        :
        <Dialog.Container 
            onBackdropPress = {() => setFlagVisible(false)}
            useNativeDriver
            visible={FlagVisible} 
        >   
            <ActivityIndicator size="large" color={Color.Primary.normal}/>
        </Dialog.Container>
        }
        <TouchableOpacity  
            onPress = {() => setFlagVisible(true)}
            style = {styles.SaveButtonTouchableOpacity}>
            <Image
                style = {styles.SaveButtonImg}
                source = {require("../../img/save2.png")}
            />
        </TouchableOpacity>
    </View>
    )
}
export function CountBox(props){
    const upCount = () =>{
        props.SetCountUp();
    }
    const dwCount = () =>{
        props.SetCountDw();
    }
    return(
        <View  style = {styles.CounterView}>
            <Text style = {styles.CounterText}>{props.text1}</Text>
            <View style = {{flexDirection:"row"}}>
                <TouchableOpacity 
                    onPress = {dwCount}
                    style = {styles.CounterBtnView}>
                    <Image 
                        source = {require('../../img/leftarrow.png')}
                        style = {styles.CounterBtnImg}/>
                </TouchableOpacity>
                <View style = {styles.CounterShowView}>
                    <Text style = {styles.CounterShowText}>{props.CountValue}</Text>
                </View>
                <TouchableOpacity 
                    onPress = {upCount}
                    style = {styles.CounterBtnView}>
                    <Image 
                        source = {require('../../img/rightarrow.png')}
                        style = {styles.CounterBtnImg}/>
                </TouchableOpacity>
            </View>
            <Text style = {styles.CounterText}>{props.text2}</Text>
        </View>
    )
};
export  function WaitLoading(props) {
    const [refreshing, setRefreshing] = useState(false);
    async function onRefresh () {
        setRefreshing(true);
        props.onRefresh();
    }; 
    return(
    <SafeAreaView style = {{flex:1}}>
        <ScrollView 
            style = {{flex:1}}
            refreshControl={    
                <RefreshControl
                    enabled={true}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
        <ActivityIndicator size="large" color={Color.Primary.normal}/>
        <View style = {{alignItems:"center"}}>
            <Text style = {{fontSize:25}}>Loading...</Text>
        </View>
    </ScrollView></SafeAreaView>
    )
}
const styles = StyleSheet.create({
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
    EditProfileView:{
        marginLeft: 15,
        marginTop: "5%",
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
    EditProfileInput:{
        color:Color.Text.text,
        marginLeft: 10,
        width: width*7/10
    },
});