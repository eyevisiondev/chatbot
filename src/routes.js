import { createAppContainer, DrawerNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Password from "./pages/Password";

const Routes = createAppContainer(
  createStackNavigator({
    Login,
    Home,
    Chat,

    Password
  })
);

export default Routes;
