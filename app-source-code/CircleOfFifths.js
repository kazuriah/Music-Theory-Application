/** * Sample React Native App * https://github.com/facebook/react-native */
import React, { Component } from 'react';
import { ART, ppRegistry, StyleSheet, Text, TouchableWithoutFeedback, View, PanResponder } from 'react-native';
const { Group, Shape, Surface, Transform } = ART;
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
            { "number": 5, "name": 'B' },
            { "number": 5, "name": 'E' },
            { "number": 5, "name": 'A' },
            { "number": 5, "name": 'D' },
            { "number": 5, "name": 'G' },
            { "number": 5, "name": 'C' },
            { "number": 5, "name": 'F' },
            { "number": 5, "name": 'Bb' },
            { "number": 5, "name": 'Eb' },
            { "number": 5, "name": 'Ab' },
            { "number": 5, "name": 'Db' },
            { "number": 5, "name": 'Gb/F#' },
        ],
        currentTouch: {},
        lastTouch: {},
        rotation: 0,
    }

    _value(item) { return item.number; }

    _label(item) { return item.name; }

    _color(index) { return Theme.colors[index]; }

    _createChart() {
        var arcs = d3.shape.pie()
            .value(this._value)
            (this.state.data);

        var lines = [];

        for (var i = 0; i < arcs.length; i++) {
            var path = d3.shape.arc()
                .outerRadius(150 / 2)  // Radius of the pie 
                .padAngle(.05)    // Angle between sections
                .innerRadius(30)  // Inner radius: to create a donut or pie
                (arcs[i]);

            lines.push(path);
        }

        console.log(lines.length);
        this.setState({ paths: lines });
    }

    _distanceBetweenTwoPoints(first, second) {
        var distance = Math.sqrt(Math.pow(second.X - first.X, 2) + Math.pow(second.Y - first.Y, 2));
        return distance;
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

                console.log(gestureState.moveX, gestureState.moveY);

                if (this.state.lastTouch === {}) {
                    this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });
                    this.setState({ lastTouch: { X: 0, Y: 0 } });
                } else {
                    this.setState({ lastTouch: this.state.currentTouch })
                    this.setState({ currentTouch: { X: gestureState.moveX, Y: gestureState.moveY } });

                    triangle = {
                        // magic numbers
                        radiusPoint: { X: 190, Y: 185, },
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
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.Y > triangle.radiusPoint.Y 
                        && triangle.currentPoint.X < triangle.lastPoint.X
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation + triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.Y < triangle.radiusPoint.Y 
                        && triangle.currentPoint.X > triangle.lastPoint.X
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation + triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.Y < triangle.radiusPoint.Y 
                        && triangle.currentPoint.X < triangle.lastPoint.X
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) < Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation - triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    
                    else if(triangle.currentPoint.X < triangle.radiusPoint.X 
                        && triangle.currentPoint.Y < triangle.lastPoint.Y
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation + triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.X < triangle.radiusPoint.X 
                        && triangle.currentPoint.Y > triangle.lastPoint.Y
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation - triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.X > triangle.radiusPoint.X 
                        && triangle.currentPoint.Y < triangle.lastPoint.Y
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation - triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
                    }
                    else if(triangle.currentPoint.X > triangle.radiusPoint.X 
                        && triangle.currentPoint.Y > triangle.lastPoint.Y
                        && Math.abs(triangle.currentPoint.Y - triangle.lastPoint.Y) > Math.abs(triangle.currentPoint.X - triangle.lastPoint.X)
                    )
                    {
                        this.setState({rotation: this.state.rotation + triangle.theta});
                        this.rotate = new Transform().translate(100.000000, 100.000000).rotate(this.state.rotation);
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
        this.rotate = new Transform().translate(100.000000, 100.000000);

        this._createChart();

        this._setUpGestureHandler();
    }

    render() {
        const margin = styles.container.margin;
        const x = 150 / 2 + margin;
        const y = 150 / 2 + margin;

        return (
            <View {...this._panResponder.panHandlers}>
                <View style={styles.container}>
                    <Surface width={200} height={200}>
                        <Group x={x} y={y}>
                            {
                                this.state.paths.map((item, index) =>
                                    (<Shape
                                        transform={this.rotate}
                                        key={'pie_shape_' + index}
                                        fill={this._color(index)}
                                        stroke={this._color(index)}
                                        d={item}
                                    />))
                            }
                        </Group>
                    </Surface>

                </View>
                <View style={{ position: 'absolute', top: 60, left: 2 * margin + this.props.pieWidth }}>
                    {
                        this.state.data.map((item, index) => {
                            var fontWeight = this.state.highlightedIndex == index ? 'bold' : 'normal';
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => this._onPieItemSelected(index)}>
                                    <View>
                                        <Text style={[styles.label, { color: this._color(index), fontWeight: fontWeight }]}>{this._label(item)}</Text>
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
    });

