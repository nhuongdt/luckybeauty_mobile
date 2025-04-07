/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Appearance, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import AppNavigation from './app/navigation/app_navigation';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { darkTheme, lightTheme } from './app/theme/theme';
import { AuthProvider, useAuthApp } from './app/store/react_context/AuthProvider';
import LoginScreen from './app/screens/login';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black
          }
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark
          }
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const scheme = useColorScheme();
  const isDarkMode = useColorScheme() === 'dark';
  const rneuiTheme = createTheme(scheme === 'dark' ? darkTheme : lightTheme);
  // const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navTheme = scheme === 'dark' ? NavigationDarkTheme : DefaultTheme;

  //if (isLogin == null) return null; // Hiển thị màn hình loading nếu chưa check xong

  // useEffect(() => {
  //   // Lắng nghe sự thay đổi của hệ thống (dark/light mode)
  //   const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     setTheme(colorScheme); // Cập nhật lại theme
  //   });

  //   // Hủy bỏ lắng nghe khi component bị unmount
  //   return () => subscription.remove();
  // }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'yellow'
          }}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  highlight: {
    fontWeight: '700'
  }
});

export default App;
