import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ScannerScreen from './src/screens/ScannerScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Scanner') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            title: 'QR Code Scanner',
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'Scan History',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
