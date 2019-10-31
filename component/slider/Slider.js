import React, {
  useRef,
  useEffect,
  memo,
  useReducer,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {View, Text, PanResponder, Animated} from 'react-native';

import styles from './slider.style';

const initialState = {
  sliderWidth: 0,
  currentXPosition: 0,
  value: 0,
  stepRatio: 20,
};

const actionType = {
  SET_SLIDER_WIDTH: 'set-slider-width',
  SET_CURRENT_X_POSITION: 'set-current-x-position',
  SET_STEP_RATIO: 'set-step-ratio',
};

const sliderReducer = (state, action) => {
  switch (action.type) {
    case actionType.SET_SLIDER_WIDTH:
      return {
        ...state,
        sliderWidth: action.sliderWidth,
      };
    case actionType.SET_CURRENT_X_POSITION:
      return {
        ...state,
        currentXPosition: action.currentXPosition,
        value: action.value,
      };
    case actionType.SET_STEP_RATIO:
      return {
        ...state,
        stepRatio: action.stepRatio,
      };
    default:
      return state;
  }
};

function Slider(props) {
  const {min, max, value} = props;
  const [sliderState, dispatch] = useReducer(sliderReducer, initialState);
  const [animateDuration, setAnimateDuration] = useState(240);

  const sliderDotAnimator = useRef(new Animated.Value(0)).current;
  const {sliderWidth, currentXPosition, stepRatio} = sliderState;

  const onPanResponderMove = useCallback(
    (event, gesture) => {
      const {nativeEvent} = event;
      const {locationX} = nativeEvent;
      const positionRatio = Math.ceil((locationX / sliderWidth) * 100);
      setAnimateDuration(50);
      if (locationX >= 0 && positionRatio <= 100) {
        const sliderPositionValue = (positionRatio / 100) * sliderWidth;
        dispatch({
          type: actionType.SET_CURRENT_X_POSITION,
          currentXPosition: sliderPositionValue,
          value: (positionRatio / 100) * max,
        });
      }
    },
    [max, sliderWidth],
  );
  const onPanResponderLogical = useCallback(
    (event, gesture) => {
      const {nativeEvent} = event;
      const {locationX} = nativeEvent;
      const positionRatio = Math.ceil((locationX / sliderWidth) * 100);
      setAnimateDuration(240);
      if (locationX >= 0 && positionRatio <= 100) {
        const destinationRatio =
          Math.round(positionRatio / stepRatio) * stepRatio;
        const sliderPositionValue = (destinationRatio / 100) * sliderWidth;
        dispatch({
          type: actionType.SET_CURRENT_X_POSITION,
          currentXPosition: sliderPositionValue,
          value: (destinationRatio / 100) * max,
        });
      }
    },
    [max, sliderWidth, stepRatio],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove,
        onPanResponderGrant: onPanResponderLogical,
        onPanResponderRelease: onPanResponderLogical,
      }),
    [onPanResponderLogical, onPanResponderMove],
  );

  useEffect(() => {
    dispatch({
      type: actionType.SET_CURRENT_X_POSITION,
      currentXPosition: (value / max) * sliderWidth,
      value,
    });
  }, [max, sliderWidth, value]);

  useEffect(() => {
    Animated.timing(sliderDotAnimator, {
      toValue: currentXPosition,
      duration: animateDuration,
    }).start();
  }, [sliderDotAnimator, currentXPosition, animateDuration]);

  return (
    <View style={styles.sliderWrapper} {...panResponder.panHandlers}>
      <View
        hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}
        style={styles.sliderLine}
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          dispatch({
            type: actionType.SET_SLIDER_WIDTH,
            sliderWidth: width,
          });
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.sliderDot, {left: sliderDotAnimator}]}
      />
    </View>
  );
}

Slider.defaultProps = {
  min: 0,
  value: 100000,
  max: 250000,
};

export default memo(Slider);
