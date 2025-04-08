import { Icon, Text, useTheme } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { IconType } from '../../enum/IconType';
import { FC } from 'react';

export const ModalTitle: FC<{
  title: string;
  onClose: () => void;
}> = ({ title, onClose }) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 50
      }}>
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: 'absolute',
          right: 10,
          top: 13,
          zIndex: 1
        }}>
        <Icon type={IconType.IONICON} name="close" color={theme.colors.white} size={24} />
      </TouchableOpacity>

      <Text
        style={{
          color: theme.colors.white,
          fontWeight: 'bold',
          fontSize: 16
        }}>
        {title}
      </Text>
    </View>
  );
};
