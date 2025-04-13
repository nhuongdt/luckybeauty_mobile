import { Theme } from '@rneui/base';
import { Icon, Text, useTheme } from '@rneui/themed';
import { Dimensions, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFadeAndSlideUpAnimation } from '../../hooks/useFadeAndSlideUpAnimation';

type ActionMenuProps = {
  visible: boolean;
  onPress: () => void;
  enable?: boolean;
};

export const ActionMenu = ({ visible, onPress, enable = true }: ActionMenuProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const animatedStyle = useFadeAndSlideUpAnimation(visible, SCREEN_HEIGHT);

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
      <TouchableOpacity
        style={[
          styles.actionMenu,
          styles.flexRow,
          { backgroundColor: enable ? theme.colors.primary : theme.colors.disabled }
        ]}
        onPress={onPress}>
        <Icon name="add" color={enable ? theme.colors.white : theme.colors.greyOutline} />
        <Text
          style={{ color: enable ? theme.colors.white : theme.colors.greyOutline, fontSize: 16, fontWeight: 'bold' }}>
          Thêm vào giỏ
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    actionMenu: {
      gap: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      elevation: 10
    }
  });
