import { createContext } from 'react';
import { IChiNhanhBasicDto } from '../../services/chi_nhanh/ChiNhanhDto';
import { IUserLoginDto } from '../../services/login/LoginDto';

export const UserLoginContext = createContext<IUserLoginDto>({ userName: '', idChiNhanh: '' });
