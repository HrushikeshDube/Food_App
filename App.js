import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Login from './MainScreens/Login';
import Welcome from './MainScreens/Welcome';
import Register from './MainScreens/Register';
import Home from './MainScreens/Home';
import Wishlist from './MainScreens/Wishlist';
import Order from './MainScreens/Order';
import Account from './MainScreens/Account';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabnavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#FF5733',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 6,
          backgroundColor: '#fff',
          borderRadius:15,
          height: 60,
        },
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} size={22} color={color} />
          ),
        }}
        component={Home}
        name="Home"
      />
      
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHeart} size={22} color={color} />
          ),
        }}
        component={Wishlist}
        name="Wishlist"
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faShoppingCart} size={22} color={color} />
          ),
        }}
        component={Order}
        name="Order"
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUser} size={22} color={color} />
          ),
        }}
        component={Account}
        name="Account"
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Tabnavigation">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabnavigation" component={Tabnavigation} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
