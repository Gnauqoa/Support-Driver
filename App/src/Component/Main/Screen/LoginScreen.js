
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,ActivityIndicator,Dimensions,Image,AsyncStorage,Alert } from 'react-native';
import { useState } from 'react';
import Color from "../../UI/Theme";
import { getLoginData } from '../../Network/login';
import  Dialog  from "react-native-dialog";
async function saveDataStorage(name,data){
    try {
        await AsyncStorage.setItem(
            name,
            data
        );
    } 
    catch (error) {
        //console.log(error);
    }
};
async function getDataStorage (name)  {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      //console.log(error);
    }
  };
const {height,width} = Dimensions.get("window");

export default function LoginScreen(props) {
    const [account,setAccount] = useState("");
    const [password,setPassword] = useState("");
    const [FlagVisible,setFlagVisible] = useState(false);
    const [autoLogin,setAutoLogin] = useState(true);
    const [show,setShow] = useState(false);
    useEffect( () => {
        AutoLogin();
    });
    const AutoLogin = async () => {
        if(autoLogin){
            setAutoLogin(false);
            const OldLoginData = JSON.parse(await getDataStorage("LoginData"));
            if(OldLoginData == "" || OldLoginData == null) return;
            setFlagVisible(true);
            const re = {
                account: OldLoginData.account,
                password: OldLoginData.password,
                session: OldLoginData.session
            }
           
            setTimeout(
                function() {
                    props.LoginDone(re);
                },1000
            );
        }
    }
    const ClickLogin = async() => {
        setFlagVisible(true);
        const LoginData = await getLoginData(account,password);
        if(!LoginData.flag){
            setFlagVisible(false);
            Alert.alert("Đăng nhập thất bại ","Tài khoản hoặc mật khẩu sai");
            return 0;
        }
        const re = {
            account: account,
            password:password,
            session: LoginData.session
        }
        saveDataStorage("LoginData",JSON.stringify(re));
        setFlagVisible(false);
        props.LoginDone(re);
    }
    return (
        <View style={styles.container}>
            <Text style = {{color:"white",fontSize:20,marginBottom:10}}>Xin chào</Text> 
            <View style = {{flexDirection:"row",marginBottom:20}}>
                <Text style = {{color:"white",fontSize: 15}}>đăng nhập để tiếp tục hoặc </Text>
                <TouchableOpacity onPress = {() => props.changePage(1)}>
                    <Text style = {{color:"white",fontSize: 15,fontWeight: "bold"}}>Đăng ký tại đây</Text>
                </TouchableOpacity>
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
            <TouchableOpacity style={styles.loginBtn} onPress = {() => ClickLogin()}>
                <Text style={{color:"white"}}>Đăng Nhập</Text>
            </TouchableOpacity>

            <View  style = {{justifyContent:"flex-start"}}>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>      
            <Dialog.Container 
                visible={FlagVisible} 
            >   
                <ActivityIndicator size="large" color={Color.Primary.normal}/>
            </Dialog.Container>  
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Primary.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView:{
    width:"80%",
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