import React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LoginUserData } from './src/Component/Main/ScreenContext';
import LoginScreen from './src/Component/Main/Screen/LoginScreen';
import RegisterScreen from './src/Component/Main/Screen/RegisterScreen';
import MyDrawer from './src/Component/Main/Drawer'

export default function App() {
  const [FlagPage,setFlagPage] = useState(0);
  const [LoginData,updateLoginData] = useState({
    account:"",
    password:"",
    session:"",
  }); 
  const UserLogin = (data) => {
    updateLoginData(data);
    setFlagPage(2);
  }
  if(!FlagPage)
  return (
    <LoginScreen  
      LoginDone = {(value) => UserLogin(value)}
      changePage = {setFlagPage}
    />
  );
  if(FlagPage == 1)
  return (
    <RegisterScreen
      RegisterDone = {(value) => UserLogin(value)}
      changePage = {setFlagPage}
    />
  )
  if(FlagPage == 2)
  return(
    <LoginUserData.Provider value = {
      {
        "LoginData":LoginData, 
      }
    }>
      <NavigationContainer>
       <MyDrawer
          Logout ={ 
            () => {
              setFlagPage(0);
            }
          }
       />
      </NavigationContainer> 
    </LoginUserData.Provider>
  )
}


