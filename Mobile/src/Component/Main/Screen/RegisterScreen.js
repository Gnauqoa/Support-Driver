import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,ActivityIndicator, Image,Dimensions } from 'react-native';
import { useState } from 'react';
import Color from "../../UI/Theme";
import  Dialog  from "react-native-dialog";
import { Alert } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { Toggle } from '../ExtraComponent';
import { getRegisterRequest } from '../../Network/register';
import { getLoginData } from '../../Network/login';
const {height,width} = Dimensions.get("window");
let checkData = {
    alert:"",
    flag:true
}
export default function RegisterScreen(props) {
    const [account,setAccount] = useState("quanglng20111@gmail.com");
    const [password,setPassword] = useState("quangkk123123");
    const [name,setName] = useState("Le Dang Quang");
    const [phone,setPhone] = useState("0385912050");
    const [birth,setBirth] = useState(null);
    const [gender,setGender] = useState(true);
    const [FlagVisible,setFlagVisible] = useState(false);
    const [show,setShow] = useState(false);
    const [showDate,setShowDate] = useState(false);
 
    const CheckBirth = () => {
        if(birth == null){
            checkData.alert += "nhập ngày sinh \n";
            checkData.flag = false; 
        }
    }
    const CheckPhone = () => {
        if(phone.length != 10){
            checkData.alert += "tên phải dài hơn 6 kí tự \n";
            checkData.flag = false; 
        }
    }
    const CheckName = () => {
        if(name.length < 6){
            checkData.alert += "tên phải dài hơn 6 kí tự \n";
            checkData.flag = false; 
        }
    }
    const CheckPassword = () => {
        if(password.length < 6){
            checkData.alert += "mật khẩu phải dài hơn 6 \n";
            checkData.flag = false; 
        }
    }
    const CheckEmail = () => {
        
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(account) === false) {
            checkData.alert += "email không đúng \n";
            checkData.flag = false;            
        }
    }
    const ClickRegister = async() => {
        setFlagVisible(true);
        checkData.alert = "";
        checkData.flag = true;
        CheckEmail();CheckPassword();CheckName();CheckPhone();CheckBirth();
        if(!checkData.flag){
            Alert.alert("Đăng ký thất bại ",checkData.alert);
            setFlagVisible(false);
            return;
        }
        const RegisterRequest = await getRegisterRequest(account,password,name,phone,birth,gender);
        if(!RegisterRequest){
            setFlagVisible(false);
            Alert.alert("Đăng ký thất bại ","Tài khoản đã tồn tại");
            return 0;
        }
        Alert.alert(
            "Đăng ký thành công",
            "",
            [
                {
                    text: "Đăng nhập ngay",
                    onPress: () => StartLogin(),
                }
            ]
        )
    }
    const StartLogin = async() => {
        const LoginData = await getLoginData(account,password);
        if(!LoginData.flag){
            setFlagVisible(false);
            Alert.alert("Đăng nhập thất bại ","Tài khoản hoặc mật khẩu sai");
            return 0;
        }
        const re = {
            account: account,
            password:password,
            session:LoginData.session
        }
        props.RegisterDone(re);
    }
    return(
        <View style={styles.container}>
        <Text style = {{color:"white",fontSize:25,marginBottom:10,fontWeight:"bold"}}>Chào mừng đến với Gama</Text> 
        <View style = {{flexDirection:"row",marginBottom:20}}>
            <Text style = {{color:"white",fontSize: 15}}>Đăng ký để bắt đầu sử dụng </Text>
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="Tài khoản" 
                placeholderTextColor="#003f5c"
                onChangeText = {(value) => setAccount(value)}
            />
        </View>
        <View style={[styles.inputView]} >
            <View style = {{flexDirection:"row"}}>
                <TextInput  
                    style={styles.inputText}
                    placeholder="Mật khẩu" 
                    placeholderTextColor="#003f5c"
                    onChangeText = {(value) => setPassword(value)}
                    secureTextEntry = {!show}
                />
                <TouchableOpacity style = {{marginLeft:width*43/100}} onPress = {() => setShow(!show)}>
                    <Image
                        style = {styles.Icon}
                        source = {show ? require("../../../img/show.png"): require("../../../img/notshow.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="Tên" 
                placeholderTextColor="#003f5c"
                onChangeText = {(value) => setName(value)}
            />
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="Số điện thoại" 
                placeholderTextColor="#003f5c"
                onChangeText = {(value) => setPhone(value)}
                keyboardType = {"number-pad"}
            />
        </View>
        <TouchableOpacity style={styles.inputView} onPress = {() => setShowDate(true)} >
            <Text
                style={[styles.inputText,{color:"#003f5c"}]}
            >{birth != null ? Moment(birth).format('DD-MM-YYYY') : "Ngày sinh"}</Text>
        </TouchableOpacity>

        <View style = {{flexDirection:"row"}}>
            <View style = {{justifyContent:"center"}}>
                <Text style={{color:"white",fontSize:18}} > Nam </Text>
            </View>
            <Toggle
                value = {gender}
                onValueChange = {() => {setGender(!gender)}}
                type = {true}
                trackColor = {"asd"}
            />
            <View style = {{justifyContent:"center"}}>
                <Text style={{color:"white",fontSize:18}}> Nữ </Text>
            </View>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress = {() => ClickRegister()}>
            <Text style={{color:"white",fontSize:16}}>Đăng Ký</Text>
        </TouchableOpacity>

        

        <View style = {{flexDirection:"row",marginTop:20}}>
            <Text style = {{color:"white",fontSize: 15}}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress = {() => props.changePage(0)}>
                <Text style = {{color:"white",fontSize: 15,fontWeight: "bold"}}>Đăng nhập tại đây</Text>
            </TouchableOpacity>
        </View>

        <DateTimePicker
            value = {birth}
            isVisible={showDate}
            testID = "dateTimePicker"
            mode = {"date"}
            onConfirm = {(data) => {
                setBirth(data);
                setShowDate(false);
            }}
            onCancel = {() => setShowDate(false)}
        />
        <Dialog.Container 
            visible={FlagVisible} 
        >   
            <ActivityIndicator size="large" color={Color.Primary.normal}/>
        </Dialog.Container>  
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.Primary.normal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputView:{
      width:width*80/100,
      backgroundColor:"#fff",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      paddingLeft:20
    },
    inputText:{
      color:"black"
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#fb5b5a",
      marginBottom:40
    },
    forgot:{
      
      color:"white",
      fontSize:15
    },
    loginBtn:{
      width:"80%",
      backgroundColor:Color.Primary.dark,
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      marginBottom:10
    },
    Icon:{
        width: 30,
        height: 30,
        tintColor: "black"
    },
  });