import { Icon, Text } from '@rneui/themed';
import { View } from 'react-native';
import { IconType } from '../../enum/IconType';
import { FC } from 'react';

export const ModalTitle: FC<{
  title: string;
  onClose: () => void;
}> = ({ title, onClose }) => {
  return (
    <View
      style={{
        backgroundColor: '#FFF4E5',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
      }}>
      <Icon
        type={IconType.IONICON}
        name="close"
        color={'red'}
        size={24}
        style={{
          marginLeft: 8,
          flex: 1
        }}
        onPress={onClose}
      />
      <Text
        style={{
          textAlign: 'center',
          flex: 11
        }}>
        {title}
      </Text>
    </View>
  );
};
