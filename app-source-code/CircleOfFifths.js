/** * Sample React Native App * https://github.com/facebook/react-native */
import React, { Component } from 'react';
import { ART, ppRegistry, Dimensions, StyleSheet, Text as NormText, TouchableWithoutFeedback, View, PanResponder } from 'react-native';
const { Group, Shape, Surface, Transform, Text } = ART;
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

const d3 = {
    scale,
    shape,
};

import {
    scaleBand,
    scaleLinear
} from 'd3-scale';

const Theme = {
    colors: [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
        "#8c564b", "#e377c2",
    ]
};

export default class CircleOfFifths extends Component {
    state = {
        paths: [],
        data: [
            { "number": 5, "name": 'B', quality: 'vii.' },
            { "number": 5, "name": 'E', quality: 'iii' },
            { "number": 5, "name": 'A', quality: 'vi' },
            { "number": 5, "name": 'D', quality: 'ii' },
            { "number": 5, "name": 'G', quality: 'V7' },
            { "number": 5, "name": 'C', quality: 'I' },
            { "number": 5, "name": 'F', quality: 'IV' },
            { "number": 5, "name": 'Bb', quality: '' },
            { "number": 5, "name": 'Eb', quality: '' },
            { "number": 5, "name": 'Ab', quality: '' },
            { "number": 5, "name": 'Db', quality: '' },
            { "number": 5, "name": 'Gb/F#', quality: '' },
        ],
        currentTouch: {},
        lastTouch: {},
        rotation: 0,
        centroids: [],
        angles: [],
    }

    _value(item) { return item.number; }

    _label(item) { return item.name; }

    _color(index) { return Theme.colors[index]; }

    _createChart(radius) {
        var arcs = d3.shape.pie()
            .value(this._value)
            (this.state.data);

        var lines = [];
        var centers = [];

        console.log(arcs[1].startAngle);
        this.setState({angles: arcs.map(a => a.startAngle)});

        for (var i = 0; i < arcs.length; i++) {
            var path = d3.shape.arc()
                .outerRadius(radius)  // Radius of the pie 
                .padAngle(.05)    // Angle between sections
                .innerRadius(30)  // Inner radius: to create a donut or pie
                (arcs[i]);

            
            var center = d3.shape.arc()
                .outerRadius(radius)  // Radius of the pie 
                .padAngle(.05)    // Angle between sections
                .innerRadius(30)  // Inner radius: to create a donut or pie
                .centroid(arcs[i]);

            lines.push(path);
            centers.push(center);
        }

        console.log(arcs[1]);
        this.setState({ paths: lines, centroids: centers });
    }

    _distanceBetweenTwoPoints(first, second) {
        var distance = Math.sqrt(Math.pow(second.X - first.X, 2) + Math.pow(second.Y - first.Y, 2));
        return distance;
    }

    _onPieItemSelected = (index) => {
        console.log('hallo');
        console.log(this.state.angles);
        var currentAngle = this.state.angles[index] * (180/Math.PI);
        console.log(currentAngle);
        this.setState({rotation: (360 - Math.abs(currentAngle))});
    }

    _setUpGestureHandler() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
                this.setState({lastTouch: {}, currentTouch: {}})
            },
            onPanResponderMove: (evt, gestureState) => {
                // The most recent move distance is gestureState.move{X,Y}
                if (gestureState.numberActiveTouches == 1)
                {
                    console.log(gestureState.moveX, gestureState.moveY);

                    if (this.state.lastTouch === {}) {
                        this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });
                        this.setState({ lastTouch: { X: 0, Y: 0 } });
                    } else {
                        this.setState({ lastTouch: this.state.currentTouch })
                        this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });

                        triangle = {
                            // magic numbers
                            radiusPoint: { X: 190, Y: 415, },
                            lastPoint: this.state.lastTouch,
                            currentPoint: this.state.currentTouch,

                            a: {},
                            b: {},
                            c: {},

                            theta: {},
                        };

                        // find angle
                        triangle.a = this._distanceBetweenTwoPoints(triangle.lastPoint, triangle.currentPoint);
                        triangle.b = this._distanceBetweenTwoPoints(triangle.radiusPoint, triangle.lastPoint);
                        triangle.c = this._distanceBetweenTwoPoints(triangle.radiusPoint, triangle.currentPoint);

                        triangle.theta = Math.acos((-Math.pow(triangle.a, 2) + Math.pow(triangle.b, 2) + Math.pow(triangle.c, 2)) / (2 * triangle.b * triangle.c))*(180/Math.PI);

                        //gross if statements for actual rotation
                        if(triangle.currentPoint.Y > triangle.radiusPoint.Y 
                            && triangle.currentPoint.X > triangle.lastPoint.X
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation - triangle.theta});
                        }
                        else if(triangle.currentPoint.Y > triangle.radiusPoint.Y 
                            && triangle.currentPoint.X < triangle.lastPoint.X
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation + triangle.theta});
                        }
                        else if(triangle.currentPoint.Y < triangle.radiusPoint.Y 
                            && triangle.currentPoint.X > triangle.lastPoint.X
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation + triangle.theta});
                        }
                        else if(triangle.currentPoint.Y < triangle.radiusPoint.Y 
                            && triangle.currentPoint.X < triangle.lastPoint.X
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation - triangle.theta});
                        }
                        
                        else if(triangle.currentPoint.X < triangle.radiusPoint.X 
                            && triangle.currentPoint.Y < triangle.lastPoint.Y
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation + triangle.theta});
                        }
                        else if(triangle.currentPoint.X < triangle.radiusPoint.X 
                            && triangle.currentPoint.Y > triangle.lastPoint.Y
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation - triangle.theta});
                        }
                        else if(triangle.currentPoint.X > triangle.radiusPoint.X 
                            && triangle.currentPoint.Y < triangle.lastPoint.Y
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation - triangle.theta});
                        }
                        else if(triangle.currentPoint.X > triangle.radiusPoint.X 
                            && triangle.currentPoint.Y > triangle.lastPoint.Y
                            && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                        )
                        {
                            this.setState({rotation: this.state.rotation + triangle.theta});
                        }
                    }
                }

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }

    componentWillMount() {

        this._createChart(130);

        this._setUpGestureHandler();
    }

    render() {
        const margin = styles.container.margin;
        const x = Dimensions.get('window').width/2 + 20;
        const y = Dimensions.get('window').height/2;

        return (
            <View >
                <View {...this._panResponder.panHandlers}>
                    <Surface width={Dimensions.get('window').width} height={Dimensions.get('window').height}>
                        <Group x={x} y={y} transform={new Transform().rotate(this.state.rotation)}>
                            {
                                this.state.paths.map((item, index) =>
                                    (
                                        <Shape
                                            key={'pie_shape_' + index}
                                            fill={this._color(index)}
                                            stroke={this._color(index)}
                                            d={item}
                                        />
                                    ))
                            }
                            {
                                this.state.data.map((item, index) => (
                                    <Text 
                                        key={'note_' + index} 
                                        x={this.state.centroids[index][0]*2 } 
                                        y={this.state.centroids[index][1]*2 } 
                                        alignment="middle" 
                                        fill={this._color(index)} 
                                        font='bold 8px "Arial"'
                                        transform={new Transform().rotate(-this.state.rotation)}
                                    >{item.quality}</Text>
                                ))
                            }
                            {
                                this.state.data.map((item, index) => (
                                    <Text 
                                        key={'note_' + index} 
                                        x={this.state.centroids[index][0]*1.9 } 
                                        y={this.state.centroids[index][1]*1.9 } 
                                        alignment="middle" 
                                        fill={this._color(index)} 
                                        font='bold 8px "Arial"'
                                        transform={new Transform().rotate(-this.state.rotation)}
                                    >{item.name}</Text>
                                ))
                            }
                        </Group>
                    </Surface>

                </View>
                <View style={{ position: 'absolute', top: Dimensions.get('window').height/4, left: 10 }}>
                    {
                        this.state.data.map((item, index) => {
                            var fontWeight = this.state.highlightedIndex == index ? 'bold' : 'normal';
                            return (
                                <TouchableWithoutFeedback key={index} index={index} onPress={() => this._onPieItemSelected(index)}>
                                    <View style={{ paddingBottom: 15 }}>
                                        <NormText style={[styles.label, { color: this._color(index), fontWeight: fontWeight }]}>{this._label(item)}</NormText>
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

var styles = StyleSheet.create(
    {
        container: {
            margin: 60,
        },
    }
);

