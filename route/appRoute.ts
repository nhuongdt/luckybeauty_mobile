import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import Dashboard from "../page/dashboard/dashboard";
export type AppRoute = {
  name: string;
  component: Screen;
  children: AppRoute[];
};

// const lstRoute: AppRoute[] = [
//   {
//     name: "home",
//     component: Dashboard,
//   },
// ];

const Stack = createNativeStackNavigator();
