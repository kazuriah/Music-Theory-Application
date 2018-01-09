/** * Sample React Native App * https://github.com/facebook/react-native */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ART, ppRegistry, Dimensions, StyleSheet, Text as NormText, TouchableWithoutFeedback, View, PanResponder } from 'react-native';
const { Group, Shape, Surface, Transform, Text } = ART;
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';
import { changeKey } from './actions/keys';

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

class CircleOfFifths extends Component {
    state = {
        paths: [],
        data: [
            { "number": 5, "name": 'B', quality: 'vii.', mQuality: ''  },
            { "number": 5, "name": 'E', quality: 'iii', mQuality: '' },
            { "number": 5, "name": 'A', quality: 'vi', mQuality: '' },
            { "number": 5, "name": 'D', quality: 'ii', mQuality: 'ii.' },
            { "number": 5, "name": 'G', quality: 'V7', mQuality: 'V7' },
            { "number": 5, "name": 'C', quality: 'I', mQuality: 'i' },
            { "number": 5, "name": 'F', quality: 'IV', mQuality: 'iv' },
            { "number": 5, "name": 'Bb', quality: '', mQuality: 'bVII' },
            { "number": 5, "name": 'Eb', quality: '', mQuality: 'bIII' },
            { "number": 5, "name": 'Ab', quality: '', mQuality: 'bVI' },
            { "number": 5, "name": 'Db', quality: '', mQuality: '' },
            { "number": 5, "name": 'Gb/F#', quality: '', mQuality: '' },
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
        this.setState({angles: arcs.map(a => {
                return {startAngle: a.startAngle, endAngle: a.endAngle}
        })});

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

        this.setState({ paths: lines, centroids: centers });

        //put C to top
        let cIndex = 5;
        let currentStartAngle = arcs[cIndex].startAngle * (180/Math.PI);
        let currentEndAngle = arcs[cIndex].endAngle * (180/Math.PI);
        //rotate this note to the top
        this.setState({rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle-currentStartAngle)/2)});
        
    }

    _distanceBetweenTwoPoints(first, second) {
        var distance = Math.sqrt(Math.pow(second.X - first.X, 2) + Math.pow(second.Y - first.Y, 2));
        return distance;
    }

    _lockWheel() {
        let min = 10;
        let index;
        this.state.angles.forEach( (item, i) => {
            if(Math.abs(item.startAngle + this.state.rotation) % 2*Math.PI < min)
            {
                min = Math.abs(item.startAngle);
                index = i;
            }
        });
        let currentStartAngle = Math.abs(this.state.rotation + this.state.angles[index].startAngle) * (180/Math.PI);
        let currentEndAngle = Math.abs(this.state.rotation + this.state.angles[index].endAngle) * (180/Math.PI);
        //rotate this note to the top
        this.setState({rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle-currentStartAngle)/2)});
    }

    _onPieItemSelected = (index) => {
        this.props.changeKey(index);
        console.log(this.props.currentKey);
        var currentStartAngle = this.state.angles[index].startAngle * (180/Math.PI);
        var currentEndAngle = this.state.angles[index].endAngle * (180/Math.PI);
        //rotate this note to the top
        this.setState({rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle-currentStartAngle)/2)});
        //change chord qualities
        this._changeMajorQualities(index);
    }

    _changeMajorQualities = (index) => {
        const majorQualities = ['vii.', 'iii', 'vi', 'ii', 'V7', 'I', 'IV'];
        const minorQualities = ['ii.', 'V7', 'i', 'iv', 'bVII', 'bIII', 'bVI'];
        let newQualities = ['','','','','','','','','','','',''];
        
        let j=0;
        let start = (index+7)%12;
        for(let i= start; i < start+7; i++)
        {
            newQualities[i%12] = majorQualities[j++];
        }

        this.setState({data: this.state.data.map( (a,index) => {
                a.quality = newQualities[index];
                //a.mQuality = minorQualities[index];
                return a;
            })
        });
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

                        // find angle with law of cosines
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
                //this._lockWheel();
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

        this._createChart(100);
        this._setUpGestureHandler();
        //put C to top
        // var currentStartAngle = this.state.angles[6].startAngle * (180/Math.PI);
        // var currentEndAngle = this.state.angles[6].endAngle * (180/Math.PI);
        // //rotate this note to the top
        // this.setState({rotation: (360 - Math.abs(currentStartAngle) - Math.abs(currentEndAngle-currentStartAngle)/2)});
        
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
                                        font='bold 10px "Arial"'
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
                                        font='bold 12px "Arial"'
                                        transform={new Transform().rotate(-this.state.rotation)}
                                    >{item.name}</Text>
                                ))
                            }
                            {
                                this.state.data.map((item, index) => (
                                    <Text 
                                        key={'note_' + index} 
                                        x={this.state.centroids[index][0] } 
                                        y={this.state.centroids[index][1] } 
                                        alignment="middle" 
                                        fill='#000' 
                                        font='bold 10px "Arial"'
                                        transform={new Transform().rotate(-this.state.rotation)}
                                    >{item.mQuality}</Text>
                                ))
                            }
                            {
                                this.state.data.map((item, index) => (
                                    <Text 
                                        key={'note_' + index} 
                                        x={this.state.centroids[index][0]*2.5 } 
                                        y={this.state.centroids[index][1]*2.5 } 
                                        alignment="middle" 
                                        fill='#000' 
                                        font='bold 10px "Arial"'
                                        transform={new Transform().rotate(-this.state.rotation)}
                                    >{item.mQuality}</Text>
                                ))
                            }
                        </Group>
                    </Surface>

                </View>
                <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    {
                        this.state.data.map((item, index) => {
                            var fontWeight = this.state.highlightedIndex == index ? 'bold' : 'normal';
                            return (
                                <TouchableWithoutFeedback key={index} index={index} onPress={() => this._onPieItemSelected(index)}>
                                    <View style={{ padding: 15 }}>
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

mapStateToProps = (state) => ({
    currentKey: state.keys.currentKey,
});

mapDispatchToProps = (dispatch) => ({
    changeKey: (newKey) => dispatch(changeKey(newKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CircleOfFifths);

var styles = StyleSheet.create(
    {
        container: {
            margin: 60,
        },
    }
);

