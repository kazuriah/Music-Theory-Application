import { DrawerNavigator } from 'react-navigation';
import CofContainer from '../CofContainer';
import { ReferencesContainer } from '../References';

const RootDrawer = DrawerNavigator({
  Home: {
    screen: CofContainer,
  },
  References: {
    screen: ReferencesContainer
  },
});

export default RootDrawer;
