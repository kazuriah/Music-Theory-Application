import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import CircleOfFifths from './CircleOfFifths';

const art = Platform.select({
  ios: <CircleOfFifths />,
  android: <CircleOfFifths />,
});

const styles = StyleSheet.create({
  container: {
    backgroundColor:'whitesmoke',
    marginTop: 21,
    alignItems: 'center',
  },
});

// NOTE(chebert): why is the CofContainer in a separate module from
// CircleOfFifths?
const CofContainer = () => (
  <View style={styles.container}>
    {art}
  </View>
);

export default CofContainer;
