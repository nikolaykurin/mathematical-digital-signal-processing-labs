import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Harmonic from './lab1/harmonic';
import { Line } from 'react-chartjs-2';
import { getDefaultHarmonic } from '../utils/harmonics';

import '../assets/css/styles.css';

// https://github.com/jerairrest/react-chartjs-2
class Lab1 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      harmonics: [
        // amplitude, frequency, phase
      ],
      noiseAmplitude: 0,
      signalLength: 1000,
      samplingPeriod: 0.1,

      data: []
    };

    this.addHarmonic = this.addHarmonic.bind(this);
    this.changeHarmonic = this.changeHarmonic.bind(this);
    this.changeNoiseAmplitude = this.changeHarmonic.bind(this);
    this.changeSignalLength = this.changeHarmonic.bind(this);
    this.calculateSamplingPeriod = this.changeHarmonic.bind(this);
    this.calculateData = this.changeHarmonic.bind(this);
  }

  componentWillMount() {
    this.addHarmonic();
  }

  addHarmonic() {
    let harmonics = this.state.harmonics;
    harmonics.push(getDefaultHarmonic());

    this.setState({
      harmonics
    });
  }

  changeHarmonic(index, harmonic) {
    let harmonics = this.state.harmonics;
    harmonics[index] = harmonic;

    this.setState({
      harmonics
    });
  }

  changeNoiseAmplitude(value) {
    this.setState({
      noiseAmplitude: value
    });
  }

  changeSignalLength(value) {
    this.setState({
      signalLength: value
    });
  }

  calculateSamplingPeriod() {
    let samplingPeriod = 0;

    // TODO:

    this.setState({
      samplingPeriod
    });
  }

  calculateData() {
    let data = [];

    // TODO:

    this.setState({
      data
    });
  }

  render() {
    return (
      <div>
        <Row className={ 'padding-20' }>
          <Col md={4}>
            <Form>
              <div>
                <h4 className={ 'text-center' }>Harmonics</h4>
                {
                  this.state.harmonics.map((harmonic, index) => (
                    <Harmonic
                      index={index}
                      {...harmonic}
                    />
                  ))
                }
                <Button
                  color="primary"
                  onClick={this.addHarmonic}
                  disabled={ this.state.harmonics.length >= 5 }
                >
                  +
                </Button>
              </div>
              <hr />
              <div>
                <FormGroup>
                  <Label for="noiseAmplitude">Noise Amplitude</Label>
                  <Input type="number" name="noiseAmplitude" id="noiseAmplitude" value={this.state.noiseAmplitude} />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <Label for="signalLength">Signal Length</Label>
                  <Input type="number" name="signalLength" id="signalLength" value={this.state.signalLength} />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <Label for="samplingPeriod">Sampling Period</Label>
                  <Input type="number" name="samplingPeriod" id="samplingPeriod" value={this.state.samplingPeriod} />
                </FormGroup>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <div>
              <Line data={this.state.data} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Lab1;
