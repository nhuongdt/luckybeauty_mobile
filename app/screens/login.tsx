import { Platform, View, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Input } from '@rneui/themed';
import { CheckBox } from '@rneui/themed';
import { Button } from '@rneui/themed';
import { FC, useEffect, useState } from 'react';
import LoginService from '../services/login/LoginService';
import { TenantStatus } from '../enum/TenantStatus';
import { ILoginModel, IUserLoginDto } from '../services/login/LoginDto';
import { mmkvStorage } from '../store/mmkvStore';
import { IconType } from '../enum/IconType';
import ChiNhanhService from '../services/chi_nhanh/ChiNhanhService';

const PlaceholderImage = require('@/assets/images/background-image.png');
const { width, height } = Dimensions.get('window');


const LoginScreen: FC<{ onLoginOK: (user: IUserLoginDto) => void }> = ({ onLoginOK }) => {
  const [tenancyName, setTenancyName] = useState('');
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    userName: '',
    passWord: '',
    tenancyName: ''
  });

  useEffect(() => {
    setErrors({
      userName: '',
      passWord: '',
      tenancyName: ''
    });
  }, []);

  const validateForm = () => {
    let errors = { userName: '', passWord: '', tenancyName: '' };
    if (!userName) errors.userName = 'Vui lòng nhập tên đăng nhập';
    if (!passWord) errors.passWord = 'Vui lòng nhập mật khẩu';
    //if (!tenancyName) errors.tenancyName = "Vui lòng nhập Id cửa hàng";
    setErrors(errors);
    return errors.userName == '' && errors.passWord == '' && errors.tenancyName == '';
  };

  const onPressLogin = async () => {
    if (validateForm()) {
      let tenantId = 1;
      if (tenancyName !== '') {
        const tenantData = await LoginService.checkExistsTenant(tenancyName);
        if (tenantData.state == TenantStatus.AVAILABLE) {
          tenantId = tenantData.tenantId;
        } else {
          switch (tenantData.state) {
            case TenantStatus.NOTFOUND:
              {
                setErrors({
                  ...errors,
                  tenancyName: 'Id cửa hàng không tồn tại'
                });
              }
              break;
            case TenantStatus.INACTIVE:
              {
                setErrors({
                  ...errors,
                  tenancyName: 'Cửa hàng ngừng hoạt động'
                });
              }
              break;
            default:
              {
                //
              }
              break;
          }
        }
      }
      const input = {
        userNameOrEmailAddress: userName,
        password: passWord,
        rememberClient: true,
        tenantId: tenantId
      } as ILoginModel;
      const token = await LoginService.checkUserLogin(input, tenantId);
      if (token != null) {
        mmkvStorage.set('accessToken', token.accessToken);

        let idChiNhanh = '';
        const chiNhanhOfUser = await ChiNhanhService.GetChiNhanhByUser();
        if (chiNhanhOfUser?.length > 0) {
          idChiNhanh = chiNhanhOfUser[0].id;
        }
        if (input.rememberClient) {
          mmkvStorage.set('user', JSON.stringify(input));
        }
        onLoginOK({ userName: userName, idChiNhanh: idChiNhanh });
      } else {
        //gotoHome(false);
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.formContainer}>
          <Image
            style={{ resizeMode: 'stretch', width: 200, height: 50 }}
            source={require('./../assets/images/logo_Luckybeauty_full.png')}
          />
          <Text style={{ fontSize: 20, fontWeight: 500, marginTop: 12 }}>Đăng nhập</Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="tenant"
              leftIcon={{
                type: IconType.OCTICON,
                name: 'database'
              }}
              errorStyle={styles.msgErr}
              errorMessage={errors.tenancyName}
              inputContainerStyle={{ gap: 8 }}
              value={tenancyName}
              onChangeText={text => {
                setTenancyName(text);
                setErrors({ ...errors, tenancyName: '' });
              }}
            />
            <Input
              placeholder="username"
              leftIcon={{
                type: IconType.FONT_AWESOME_5,
                name: 'user'
              }}
              errorStyle={styles.msgErr}
              errorMessage={errors.userName}
              inputContainerStyle={{ gap: 8 }}
              value={userName}
              onChangeText={text => {
                setUserName(text);
                setErrors({ ...errors, userName: '' });
              }}
            />
            <Input
              placeholder="password"
              leftIcon={{
                type: IconType.OCTICON,
                name: 'key'
              }}
              secureTextEntry
              errorStyle={styles.msgErr}
              errorMessage={errors.passWord}
              inputContainerStyle={{ gap: 8 }}
              value={passWord}
              onChangeText={text => {
                setPassWord(text);
                setErrors({ ...errors, passWord: '' });
              }}
            />
            <View style={[styles.inputBox, styles.checkBoxContainer]}>
              <CheckBox center title={'Ghi nhớ'} checked={rememberMe} containerStyle={{ paddingLeft: 0 }}
                onPress={() => setRememberMe(!rememberMe)} />

              <Text
                style={{
                  textDecorationColor: 'blue',
                  textDecorationStyle: 'solid',
                  textDecorationLine: 'underline',
                  color: 'blue',
                  paddingRight: 10
                }}>
                Quên mật khẩu
              </Text>
            </View>
            <Button
              title={'Đăng nhập'}
              size="lg"
              onPress={onPressLogin}
              containerStyle={{ marginTop: 20, borderRadius: 4 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0866ff',
    justifyContent: 'center' // Căn giữa theo trục dọc
  },
  formContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 32,
    flex: 1
  },
  inputContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%'
  },
  checkBoxContainer: {
    justifyContent: 'space-between'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputIcon: {
    color: '#aaa',
    fontSize: 18,
    flex: 1
  },
  textInput: {
    width: '100%',
    flex: 11
  },
  msgErr: {
    color: 'red',
    fontSize: 12,
    marginTop: 8
  }
});
