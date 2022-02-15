import React from 'react';
import { 
    DrawerContentScrollView,
    DrawerItem, 
    createDrawerNavigator
}  from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import { View, StyleSheet, Image,Linking, AsyncStorage } from 'react-native';
import BottomTabBar from './TabBar';
import { AddContext } from './ScreenContext';


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

const CreateDrawer = createDrawerNavigator();

export default function MyDrawer(props) {
    return(
        <CreateDrawer.Navigator
            drawerContent={(prop) => <CustomDrawer { ...props} {...prop} />}
            screenOptions={{
                headerShown: false
            }}
        >
            <CreateDrawer.Screen
                name="BottomTabScreen" 
                component={AddContext(BottomTabBar)}
                
            />
        </CreateDrawer.Navigator>
    )
}
function CustomDrawer (props) {
    return(
        <View style = {{flex:1,justifyContent:"space-between"}}>
          <DrawerContentScrollView>
                <DrawerItem
                    label="Gama"
                    onPress={() => props.navigation.toggleDrawer()}
                    icon = {({color,size}) => (
                        <View></View>
                    )}
                    onPress={() => {}}
                    labelStyle = {{fontSize: 25}}
                />

                <Drawer.Section title = {"Theme"} style={styles.drawerSection}>
                
                </Drawer.Section>

                <Drawer.Section title = "Liên lạc" style={styles.drawerSection}>
                    <DrawerItem
                        label="quanglng2022@gmail.com"
                        onPress={() => props.navigation.toggleDrawer()}
                        icon = {({color,size}) => (
                            <Image
                                source = {require('../../img/gmail.png')}
                                style = {{width:size,height:size}}
                            />
                        )}
                        onPress={() => Linking.openURL('mailto:quanglng2022@gmail.com')}
                    
                    />
                    <DrawerItem
                        label="https://support-driver.herokuapp.com/"
                        onPress={() => props.navigation.toggleDrawer()}
                        icon = {({color,size}) => (
                            <Image
                                source = {require('../../img/web.png')}
                                style = {{width:size,height:size}}
                            />
                        )}
                        onPress={() => Linking.openURL('https://support-driver.herokuapp.com/')}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={{bottom:0}}>
            <DrawerItem
                label="Đăng xuất"
                onPress={() => { 
                    const re = "";
                    saveDataStorage("LoginData",JSON.stringify(re));
                    props.Logout();
                }}
                icon = {({color,size}) => (
                    <Image
                        source = {require('../../img/logout.png')}
                        style = {{width:size,height:size,tintColor:color}}
                    />
                )}
            />  
            </Drawer.Section>
        </View>

    )
}
const styles = StyleSheet.create({
    DrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
    },
  });