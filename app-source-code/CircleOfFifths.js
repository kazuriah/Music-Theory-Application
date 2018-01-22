/** * Sample React Native App * https://github.com/facebook/react-native */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ART, Dimensions, StyleSheet, Text as NormText, TouchableWithoutFeedback, View, PanResponder } from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import PropTypes from 'prop-types';
import { changeKey } from './actions/keys';

const {
  Group, Shape, Surface, Transform, Text,
} = ART;

const d3 = {
  scale,
  shape,
};

const Theme = {
  colors: [
    '#ff0000', '#FF4500', '#FFA500', '#f8d568',
    '#ffff00', '#9ACD32', '#008000', '#0d98ba',
    '#0000ff', '#8a2be2', '#ee82ee', '#c71585',
  ],
};

const styles = StyleSheet.create({
  container: {
    margin: 60,
  },
});

class CircleOfFifths extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paths: [],
      data: [
        {
          number: 5, name: 'B', quality: 'vii.', mQuality: '',
        },
        {
          number: 5, name: 'E', quality: 'iii', mQuality: '',
        },
        {
          number: 5, name: 'A', quality: 'vi', mQuality: '',
        },
        {
          number: 5, name: 'D', quality: 'ii', mQuality: 'ii.',
        },
        {
          number: 5, name: 'G', quality: 'V7', mQuality: 'V7',
        },
        {
          number: 5, name: 'C', quality: 'I', mQuality: 'i',
        },
        {
          number: 5, name: 'F', quality: 'IV', mQuality: 'iv',
        },
        {
          number: 5, name: 'Bb', quality: '', mQuality: 'bVII',
        },
        {
          number: 5, name: 'Eb', quality: '', mQuality: 'bIII',
        },
        {
          number: 5, name: 'Ab', quality: '', mQuality: 'bVI',
        },
        {
          number: 5, name: 'Db', quality: '', mQuality: '',
        },
        {
          number: 5, name: 'Gb/F#', quality: '', mQuality: '',
        },
      ],
      currentTouch: {},
      lastTouch: {},
      rotation: 0,
      centroids: [],
      angles: [],
    };
  }

  componentWillMount() {
    this._createChart(100);
    this._setUpGestureHandler();
  }

    _value = item => item.number

    _label = item => item.name

    _color = index => Theme.colors[index]

    _createChart(radius) {
      const arcs = d3.shape.pie()
        .value(this._value)(this.state.data);

      const lines = [];
      const centers = [];

      console.log(arcs[1].startAngle);
      this.setState({
        angles: arcs.map(a => ({ startAngle: a.startAngle, endAngle: a.endAngle })),
      });

      for (let i = 0; i < arcs.length; i++) {
        const path = d3.shape.arc()
          .outerRadius(radius) // Radius of the pie
          .padAngle(0.05) // Angle between sections
          .innerRadius(30)(arcs[i]);


        const center = d3.shape.arc()
          .outerRadius(radius) // Radius of the pie
          .padAngle(0.05) // Angle between sections
          .innerRadius(30) // Inner radius: to create a donut or pie
          .centroid(arcs[i]);

        lines.push(path);
        centers.push(center);
      }

      this.setState({ paths: lines, centroids: centers });

      // put C to top
      const cIndex = 5;
      const currentStartAngle = arcs[cIndex].startAngle * (180 / Math.PI);
      const currentEndAngle = arcs[cIndex].endAngle * (180 / Math.PI);
      // rotate this note to the top
      this.setState({
        rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle - currentStartAngle) / 2),
      });
    }

    _distanceBetweenTwoPoints = (first, second) => {
      const distance = Math.sqrt(((second.X - first.X) ** 2) + ((second.Y - first.Y) ** 2));
      return distance;
    }

    _lockWheel() {
      let min = 10;
      let index;
      this.state.angles.forEach((item, i) => {
        if (Math.abs(item.startAngle + this.state.rotation) % 2 * Math.PI < min) {
          min = Math.abs(item.startAngle);
          index = i;
        }
      });
      const currentStartAngle = Math.abs(this.state.rotation + this.state.angles[index].startAngle)
        * (180 / Math.PI);
      const currentEndAngle = Math.abs(this.state.rotation + this.state.angles[index].endAngle)
        * (180 / Math.PI);
      // rotate this note to the top
      this.setState({
        rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle - currentStartAngle) / 2),
      });
    }

    _onPieItemSelected = (index) => {
      this.props.changeKey(index);
      console.log(this.props.currentKey);
      const currentStartAngle = this.state.angles[index].startAngle * (180 / Math.PI);
      const currentEndAngle = this.state.angles[index].endAngle * (180 / Math.PI);
      // rotate this note to the top
      this.setState({
        rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle - currentStartAngle) / 2),
      });
      // change chord qualities
      this._changeMajorQualities(index);
    }

    _changeMajorQualities = (index) => {
      const majorQualities = ['vii.', 'iii', 'vi', 'ii', 'V7', 'I', 'IV'];
      // const minorQualities = ['ii.', 'V7', 'i', 'iv', 'bVII', 'bIII', 'bVI'];
      const newQualities = ['', '', '', '', '', '', '', '', '', '', '', ''];

      let j = 0;
      const start = (index + 7) % 12;
      for (let i = start; i < start + 7; i++) {
        newQualities[i % 12] = majorQualities[j++];
      }

      this.setState({
        data: this.state.data.map((a, i) => {
          const newA = a;
          newA.quality = newQualities[i];
          // a.mQuality = minorQualities[index];
          return newA;
        }),
      });
    }

    _setUpGestureHandler() {
      this._panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        onPanResponderGrant: () => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!
          // gestureState.d{x,y} will be set to zero now
          this.setState({ lastTouch: {}, currentTouch: {} });
        },
        onPanResponderMove: (evt, gestureState) => {
          // The most recent move distance is gestureState.move{X,Y}
          if (gestureState.numberActiveTouches === 1) {
            console.log(gestureState.moveX, gestureState.moveY);

            if (this.state.lastTouch === {}) {
              this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });
              this.setState({ lastTouch: { X: 0, Y: 0 } });
            } else {
              this.setState({ lastTouch: this.state.currentTouch });
              this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });

              const triangle = {
                // magic numbers
                radiusPoint: { X: 190, Y: 415 },
                lastPoint: this.state.lastTouch,
                currentPoint: this.state.currentTouch,

                a: {},
                b: {},
                c: {},

                theta: {},
              };

              // find angle with law of cosines
              triangle.a =
                this._distanceBetweenTwoPoints(triangle.lastPoint, triangle.currentPoint);
              triangle.b =
                this._distanceBetweenTwoPoints(triangle.radiusPoint, triangle.lastPoint);
              triangle.c =
                this._distanceBetweenTwoPoints(triangle.radiusPoint, triangle.currentPoint);

              triangle.theta =
                Math.acos((-(triangle.a ** 2) + (triangle.b ** 2) + (triangle.c ** 2)) / (2 * triangle.b * triangle.c)) * (180 / Math.PI);

              // gross if statements for actual rotation
              if (triangle.currentPoint.Y > triangle.radiusPoint.Y
                && triangle.currentPoint.X > triangle.lastPoint.X
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation - triangle.theta });
              } else if (triangle.currentPoint.Y > triangle.radiusPoint.Y
                && triangle.currentPoint.X < triangle.lastPoint.X
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation + triangle.theta });
              } else if (triangle.currentPoint.Y < triangle.radiusPoint.Y
                && triangle.currentPoint.X > triangle.lastPoint.X
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation + triangle.theta });
              } else if (triangle.currentPoint.Y < triangle.radiusPoint.Y
                && triangle.currentPoint.X < triangle.lastPoint.X
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation - triangle.theta });
              } else if (triangle.currentPoint.X < triangle.radiusPoint.X
                && triangle.currentPoint.Y < triangle.lastPoint.Y
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation + triangle.theta });
              } else if (triangle.currentPoint.X < triangle.radiusPoint.X
                && triangle.currentPoint.Y > triangle.lastPoint.Y
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation - triangle.theta });
              } else if (triangle.currentPoint.X > triangle.radiusPoint.X
                && triangle.currentPoint.Y < triangle.lastPoint.Y
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation - triangle.theta });
              } else if (triangle.currentPoint.X > triangle.radiusPoint.X
                && triangle.currentPoint.Y > triangle.lastPoint.Y
                && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
              ) {
                this.setState({ rotation: this.state.rotation + triangle.theta });
              }
            }
          }
        },
      });
    }

    render() {
      const x = Dimensions.get('window').width / 2 + 20;
      const y = Dimensions.get('window').height / 2;

      return (
        <View >
          <View {...this._panResponder.panHandlers}>
            <Surface width={Dimensions.get('window').width} height={Dimensions.get('window').height}>
              <Group x={x} y={y} transform={new Transform().rotate(this.state.rotation)}>
                {
                  this.state.paths.map((item, index) =>
                      (
                        <Shape
                          key={item}
                          fill={this._color(index)}
                          stroke={this._color(index)}
                          d={item}
                        />
                      ))
                }
                {
                    this.state.data.map((item, index) => (
                      <Text
                        key={item.name}
                        x={this.state.centroids[index][0] * 2}
                        y={this.state.centroids[index][1] * 2}
                        alignment="middle"
                        fill={this._color(index)}
                        font='bold 10px "Arial"'
                        transform={new Transform().rotate(-this.state.rotation)}
                      >{item.quality}
                      </Text>
                    ))
                }
                {
                  this.state.data.map((item, index) => (
                    <Text
                      key={item.name}
                      x={this.state.centroids[index][0] * 1.9}
                      y={this.state.centroids[index][1] * 1.9}
                      alignment="middle"
                      fill={this._color(index)}
                      font='bold 12px "Arial"'
                      transform={new Transform().rotate(-this.state.rotation)}
                    >{item.name}
                    </Text>
                  ))
                }
                {
                    this.state.data.map((item, index) => (
                      <Text
                        key={item.name}
                        x={this.state.centroids[index][0]}
                        y={this.state.centroids[index][1]}
                        alignment="middle"
                        fill="#000"
                        font='bold 10px "Arial"'
                        transform={new Transform().rotate(-this.state.rotation)}
                      >{item.mQuality}
                      </Text>
                    ))
                }
                {
                  this.state.data.map((item, index) => (
                    <Text
                      key={item.name}
                      x={this.state.centroids[index][0] * 2.5}
                      y={this.state.centroids[index][1] * 2.5}
                      alignment="middle"
                      fill="#000"
                      font='bold 10px "Arial"'
                      transform={new Transform().rotate(-this.state.rotation)}
                    >{item.mQuality}
                    </Text>
                  ))
                }
              </Group>
            </Surface>

          </View>
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            {
              this.state.data.map((item, index) => {
                  const fontWeight = this.state.highlightedIndex === index ? 'bold' : 'normal';
                  return (
                    <TouchableWithoutFeedback
                      key={item.name}
                      index={index}
                      onPress={() => this._onPieItemSelected(index)}
                    >
                      <View style={{ padding: 15 }}>
                        <NormText style={[styles.label, { color: this._color(index), fontWeight }]}>
                          {this._label(item)}
                        </NormText>
                      </View>
                    </TouchableWithoutFeedback>
                  );
              })
            }
          </View>
        </View>
      );
    }
}

CircleOfFifths.propTypes = {
  currentKey: PropTypes.string.isRequired,
  changeKey: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentKey: state.keys.currentKey,
});

const mapDispatchToProps = dispatch => ({
  changeKey: newKey => dispatch(changeKey(newKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CircleOfFifths);
