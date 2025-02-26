/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Appearance, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import AppNavigation from './app/navigation/app_navigation';
import { ThemeProvider } from '@rneui/themed';
import { darkTheme, lightTheme } from './app/theme/theme';
import { RootNavigation } from './app/navigation/root_navigation';

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
  const isDarkMode = useColorScheme() === 'dark';

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    // Lắng nghe sự thay đổi của hệ thống (dark/light mode)
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme); // Cập nhật lại theme
    });

    // Hủy bỏ lắng nghe khi component bị unmount
    return () => subscription.remove();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'yellow' }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <NavigationContainer>
          {/* <RootNavigation /> */}
          <AppNavigation />
        </NavigationContainer>
      </ThemeProvider>

    </SafeAreaView>
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
