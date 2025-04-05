import { createContext, useContext, useEffect, useState } from 'react';
import { mmkvStorage } from '../mmkvStore';
import LoginService from '../../services/login/LoginService';
import { ILoginModel } from '../../services/login/LoginDto';
import { IChiNhanhBasicDto } from '../../services/chi_nhanh/ChiNhanhDto';
import ChiNhanhService from '../../services/chi_nhanh/ChiNhanhService';

type AuthContextType = {
  isLogin: boolean;
  login: (user: ILoginModel) => Promise<void>;
  logout: () => void;
  chiNhanhCurrent: IChiNhanhBasicDto | null;
};
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [chiNhanhCurrent, setChiNhanhCurrent] = useState<IChiNhanhBasicDto | null>(null);

  const checkLogin = async () => {
    const dataUser: ILoginModel | null = LoginService.checkUser_fromCache();
    if (dataUser !== null) {
      await getTokenfromDB(dataUser);
    } else {
      setIsLogin(false);
    }
  };

  const getTokenfromDB = async (user: ILoginModel) => {
    const token = await LoginService.checkUserLogin(user, user?.tenantId ?? 0);
    if (token != null) {
      setIsLogin(true);
      mmkvStorage.set('accessToken', token.accessToken);

      const chiNhanhOfUser = await ChiNhanhService.GetChiNhanhByUser();
      if (chiNhanhOfUser?.length > 0) {
        setChiNhanhCurrent({
          ...chiNhanhCurrent,
          id: chiNhanhOfUser[0].id,
          tenChiNhanh: chiNhanhOfUser[0].tenChiNhanh
        });
      } else {
        setChiNhanhCurrent(null);
      }
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = async (user: ILoginModel) => {
    mmkvStorage.set('user', JSON.stringify(user));
    await getTokenfromDB(user);
  };

  const logout = () => {
    mmkvStorage.delete('user');
    setIsLogin(false);
  };
  return (
    <AuthContext.Provider
      value={{
        isLogin: isLogin ?? false,
        chiNhanhCurrent: chiNhanhCurrent,
        login,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthApp = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
