import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor:'whitesmoke',
    marginTop: 21,
    alignItems: 'center',
  },
});


class References extends Component {
  render() {
    return (
      <View>
        <Text>Intervals</Text>
        <Text>Intervals are measured in half-steps.</Text>
        <Text>Chords</Text>
        <Text>Chords are usually combinations of 2 or more intervals.</Text>
      </View>
    );
  }
}

const art = Platform.select({
  ios: <References />,
  android: <References />,
});

const ReferencesContainer = () => (
  <View style={styles.container}>
    {art}
  </View>
);

export default ReferencesContainer;

