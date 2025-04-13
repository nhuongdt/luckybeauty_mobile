import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSaleManagerStackContext } from '../store/react_context/SaleManagerStackProvide';
import { useEffect } from 'react';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useFadeAndSlideUpAnimation } from '../hooks/useFadeAndSlideUpAnimation';
import { Dimensions } from 'react-native';

export const CustomerTabBar = (props: BottomTabBarProps) => {
  const { isHideTabs } = useSaleManagerStackContext();
  const animatedStyle = useFadeAndSlideUpAnimation(!(isHideTabs ?? false));
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 10
        }
      ]}>
      <BottomTabBar {...props} />
    </Animated.View>
  );
};
