import { default as React, Component } from 'react';
import { Platform, Text, View, } from 'react-native';

const e = React.createElement;
const component = React.createClass;

const eText = function(text, props) {
  props = props || {};
  return e(Text, props, text);
};

const eReferences =
  e(View, {},
    eText('Intervals'),
    eText('Intervals are measured in half-steps'),
    eText('Chords'),
    eText('Chords are combinations of two or more intervals.'));

export const ReferencesContainer = function () { 
  return e(View, {}, eReferences);
}
