import { default as React, Component } from 'react';
import { Platform, StyleSheet, Text, View, } from 'react-native';

// For Left<-->Right page swiping
import { default as Swiper } from 'react-native-swiper';
import { default as Markdown } from 'react-native-simple-markdown';

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
const swipeStyles = StyleSheet.create({
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
});

// f(style, text) => component
const eSwipeView = function(style, text) {
  return e(View, {style: style}, [
             e(Text, {style:swipeStyles.text}, text),
          ]);
}

// component
const cReferences = component({
  render: function() {
    return e(Swiper, {style: swipeStyles.wrapper, showButtons: true}, [
              eMarkdown,
              eSwipeView(swipeStyles.slide1, 'Hello Swiper'),
              eSwipeView(swipeStyles.slide2, 'Beautiful'),
              eSwipeView(swipeStyles.slide3, 'And simple'),
            ]);
  }
})

// text
const markdownText =
'#Markdown in react-native is so cool!\n\n' +
'- You can **emphasize** what you want, or just _suggest it_.\n' +
'- You can [link websites](https://twitter.com/Charles_Mangwa)\n' +
'- You can add a Gif: \n\n' +
'![Some GIF](https://media.giphy.com/media/dkGhBWE3SyzXW/giphy.gif)\n';

// element
const eMarkdown = e(Markdown, {}, [markdownText]);

// component
// accessed by the Main Menu sidebar
export const ReferencesContainer = function () { 
  //return e(View, {}, eReferences);
  return e(cReferences);
}
