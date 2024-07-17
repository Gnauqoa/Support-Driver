import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View,Image, TouchableOpacity } from 'react-native';
import Color from '../UI/Theme';
import ProfileScreen from './Screen/ProfileScreen';
import GuideScreen from './Screen/GuideScreen';
import AlertScreen from './Screen/AlertScreen';
import HistoryScreen from './Screen/HistoryScreen';
import DeviceScreen from './Screen/DeviceScreen';
const BottomTab = createBottomTabNavigator();
const Screen = [
  {
    name : "Guide",
    ImgSrc : require('../../img/Guide.png'),
    component: GuideScreen,
  },
  {
    name : "User",
    ImgSrc : require('../../img/User.png'),
    component: ProfileScreen
  },
  {
    name : "Alert",
    ImgSrc : require('../../img/alert.png'),
    component: AlertScreen,
    main: true
  },
  {
    name : "History",
    ImgSrc : require('../../img/History.png'),
    component: HistoryScreen,
    title: "Xem lại lịch sử"
  },
  {
    name : "Device",
    ImgSrc : require('../../img/Device.png'),
    component: DeviceScreen
  }
]

export default function BottomTabBar (){
    
    return(    
        <BottomTab.Navigator 
          screenOptions={{ 
              tabBarShowLabel: false,
              headerStyle: styles.header,
              tabBarStyle : styles.bottomTabBar,
              headerShown: false
          }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          {Screen.map((data,index)=>
            <BottomTab.Screen key = {index} name={data.name} component={data.component} options={{ 
              title: data.title
          }}/>
          )}
      </BottomTab.Navigator>  

    )
}
function BottomTabBarIcon(props){
  return(
    <View style = {styles.IconView}>
      <Image
        source = {props.ImgSrc}
        resizeMode="contain"
        style = {[styles.IconImg,{tintColor:props.flag ? ColorChange.colorFocused : ColorChange.colorNotFocused }]}
      />
    </View>
  )
}
function BottomTabBarMainIcon(props){
  return(
    <View style = {styles.MainIconView}>
      <View style = {styles.MainIconWhiteView}>
        <View style = {[styles.MainIconTouchableOpacity,{backgroundColor: props.flag ? ColorChange.colorFocused : ColorChange.colorNotFocused}]}>
          <Image 
            style = {styles.MainIconImg}
            source = {props.ImgSrc}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  )
}
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.bottomTabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key = {index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            {Screen[index].main == null 
              ? <BottomTabBarIcon  ImgSrc ={Screen[index].ImgSrc} flag = {isFocused}/>
              : <BottomTabBarMainIcon  ImgSrc ={Screen[index].ImgSrc} flag = {isFocused}/>
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const ColorChange = {
  colorFocused: Color.Primary.dark,
  colorNotFocused: Color.Primary.light
};
const styles = StyleSheet.create({
  MainIconView:{
    alignItems:"center",
    bottom:12
  },
  MainIconText:{
    fontSize: 12,
  },
  MainIconTouchableOpacity:{
    width:50,
    height:50,
    backgroundColor:Color.Secondary.dark,
    borderRadius: 50,
    justifyContent:"center",
    alignItems:"center",
  },
  MainIconWhiteView:{
    width:70,
    height:70,
    borderRadius: 70,
    backgroundColor:"white",
    bottom:15,
    justifyContent:"center",
    alignItems:"center",
  },
  MainIconImg:{
    width:25,
    height:25,
    tintColor:"white"
  },
  IconText:{
    fontSize: 12,
  },
  IconImg:{
    width: 25,
    height: 25,
  },
  IconView:{
    alignItems:"center",
    justifyContent:"center",
    top: 10
  },
  header:{
    backgroundColor: Color.Primary.normal,
  },
  bottomTabBar:{
    flexDirection:"row",
    height: "6%",
    position:"absolute",
    bottom: "3%",
    left: "7%",
    right: "7%",
    borderRadius: 10,
    backgroundColor: "white",
    
  }
});