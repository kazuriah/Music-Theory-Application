import { default as React, Component } from 'react';
import { Platform, StyleSheet, Text, View, } from 'react-native';

import { default as Swiper } from 'react-native-swiper';

// f(component, props, childElements) => element
const e = function(component, props, children) {
  props = props || {};
  children = children || [];
  return React.createElement(component, props, ...children);
};
// f(methods) => component
const component = React.createClass;

// f(text, props) => element
const eText = function(text, props) {
  props = props || {};
  return e(Text, props, text);
};

// element
const eReferences =
  e(View, {}, [
      eText('Intervals'),
      eText('Intervals are measured in half-steps'),
      eText('Chords'),
      eText('Chords are combinations of two or more intervals.')
   ]);

// StyleSheet
const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

// f(style, text) => component
const eSwipeView = function(style, text) {
  return e(View, {style: style}, [
             e(Text, {style:styles.text}, text)
          ]);
}

// component
const cReferences = component({
  render: function() {
    return e(Swiper, {style: styles.wrapper, showButtons: true}, [
              eSwipeView(styles.slide1, 'Hello Swiper'),
              eSwipeView(styles.slide2, 'Beautiful'),
              eSwipeView(styles.slide3, 'And simple'),
            ]);
  }
})

// component
// accessed by the Main Menu sidebar
export const ReferencesContainer = function () { 
  //return e(View, {}, eReferences);
  return e(cReferences);
}
