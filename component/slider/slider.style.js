import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  sliderWrapper: {
    alignSelf: 'stretch',
    position: 'relative',
  },
  sliderLine: {
    height: 10,
    backgroundColor: 'blue',
  },
  discreteDot: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    position: 'absolute',
  },
  sliderDot: {
    width: 10,
    height: 30,
    backgroundColor: 'black',
    position: 'absolute',
    top: -10,
    zIndex: 2,
  },
  sliderStepDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    position: 'absolute',
    zIndex: 1,
  },
});
