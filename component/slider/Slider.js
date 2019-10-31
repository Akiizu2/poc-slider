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

  const getPositionRatio = useCallback(
    ({nativeEvent}) => {
      const {locationX} = nativeEvent;
      const positionRatio = Math.ceil((locationX / sliderWidth) * 100);
      return positionRatio;
    },
    [sliderWidth],
  );

  const getCalculatedValue = useCallback(
    ratioValue => {
      const sliderPositionValue = (ratioValue / 100) * sliderWidth;
      const calculatedByRatioValue = (ratioValue / 100) * max;
      return [sliderPositionValue, calculatedByRatioValue];
    },
    [max, sliderWidth],
  );

  const processPanResponseRatio = useCallback(
    positionRatio => {
      if (positionRatio >= 0 && positionRatio <= 100) {
        const [
          sliderPositionValue,
          calculatedByRatioValue,
        ] = getCalculatedValue(positionRatio);
        dispatch({
          type: actionType.SET_CURRENT_X_POSITION,
          currentXPosition: sliderPositionValue,
          value: calculatedByRatioValue === 0 ? min : calculatedByRatioValue,
        });
      }
    },
    [getCalculatedValue, min],
  );

  const onPanResponderMove = useCallback(
    (event, gesture) => {
      const positionRatio = getPositionRatio(event);
      if (animateDuration !== 50) {
        setAnimateDuration(50);
      }
      processPanResponseRatio(positionRatio);
    },
    [animateDuration, getPositionRatio, processPanResponseRatio],
  );

  const onPanResponderRelease = useCallback(
    (event, gesture) => {
      const positionRatio = getPositionRatio(event);
      if (animateDuration !== 140) {
        setAnimateDuration(140);
      }
      const destinationRatio =
        Math.round(positionRatio / stepRatio) * stepRatio;
      processPanResponseRatio(destinationRatio);
    },
    [animateDuration, getPositionRatio, processPanResponseRatio, stepRatio],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove,
        onPanResponderRelease,
      }),
    [onPanResponderMove, onPanResponderRelease],
  );

  const stepDots = useMemo(() => {
    const numOfStep = 100 / stepRatio;
    let components = [];
    for (let index = 0; index <= numOfStep; index++) {
      const percent = (stepRatio * index) / 100;
      components = [...components, sliderWidth * percent];
    }
    return components;
  }, [sliderWidth, stepRatio]);

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
      {stepDots.map((position, index) => {
        return (
          <View
            pointerEvents="none"
            key={index}
            style={[styles.sliderStepDot, {left: position}]}
          />
        );
      })}
    </View>
  );
}

Slider.defaultProps = {
  min: 0,
  value: 100000,
  max: 250000,
};

export default memo(Slider);
