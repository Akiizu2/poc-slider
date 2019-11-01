/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Slider} from './component/slider';

const App: () => React$Node = () => {
  const [currentValue, setCurrentValue] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={{paddingBottom: 64}}>Current Value: {currentValue}</Text>
      <Slider
        value={currentValue}
        onChange={({value}) => setCurrentValue(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});

export default App;
