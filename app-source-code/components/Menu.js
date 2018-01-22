import { DrawerNavigator } from 'react-navigation';
import CofContainer from '../CofContainer';

const RootDrawer = DrawerNavigator({
  Home: {
    screen: CofContainer,
  },
});

export default RootDrawer;
