import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Harmonic from './lab1/harmonic';
import { Scatter } from 'react-chartjs-2';
import { getDefaultHarmonic } from '../utils/harmonics';

import classnames from 'classnames';
import '../assets/css/styles.css';

const SCALE = 500;

// https://github.com/jerairrest/react-chartjs-2
class Lab1 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',

      harmonics: [
        // amplitude, frequency, phase
      ],
      noiseAmplitude: 0,
      signalLength: 400,
      samplingPeriod: 0.2,

      data: []
    };

    this.toggleTab = this.toggleTab.bind(this);

    this.addHarmonic = this.addHarmonic.bind(this);
    this.changeHarmonic = this.changeHarmonic.bind(this);
    this.removeHarmonic = this.removeHarmonic.bind(this);
    this.changeNoiseAmplitude = this.changeNoiseAmplitude.bind(this);
    this.changeSignalLength = this.changeSignalLength.bind(this);
    this.calculateSamplingPeriod = this.calculateSamplingPeriod.bind(this);
    this.calculateData = this.calculateData.bind(this);
  }

  async componentWillMount() {
    await this.addHarmonic();
    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  async addHarmonic() {
    let harmonics = this.state.harmonics;
    harmonics.push(getDefaultHarmonic());

    this.setState({
      harmonics
    });

    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  async changeHarmonic(index, harmonic) {
    let harmonics = this.state.harmonics;
    harmonics[index] = harmonic;

    this.setState({
      harmonics
    });

    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  async removeHarmonic(index) {
    let harmonics = this.state.harmonics;
    harmonics.splice(index, 1);

    this.setState({
      harmonics
    });

    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  async changeNoiseAmplitude(event) {
    this.setState({
      noiseAmplitude: event.target.value
    });

    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  async changeSignalLength(event) {
    this.setState({
      signalLength: event.target.value
    });

    await this.calculateSamplingPeriod();
    await this.calculateData();
  }

  async calculateSamplingPeriod() {
    let samplingPeriod = 1 / (2 * Math.max.apply(Math, this.state.harmonics.map( item => item.frequency )));

    this.setState({
      samplingPeriod
    });
  }

  async calculateData() {
    let data = [];

    for (let i = 0; i <= this.state.signalLength; i += this.state.samplingPeriod) {
      data.push({
        x: i,
        y: this.getX(i / SCALE)
      });
    }

    this.setState({
      data
    });
  }

  getX(x) {
    let value = 0;
    for (let i = 0; i < this.state.harmonics.length; i++) {
      if (this.state.noiseAmplitude !== 0) {
        value = value + this.state.harmonics[i].amplitude * Math.cos(Math.PI * 2 * this.state.harmonics[i].frequency * x + this.state.harmonics[i].phase) +
          Math.random() * (this.state.noiseAmplitude / 2 - (-this.state.noiseAmplitude / 2)) + (-this.state.noiseAmplitude / 2);
      } else {
        value = value + this.state.harmonics[i].amplitude * Math.cos(Math.PI * 2 * this.state.harmonics[i].frequency * x + this.state.harmonics[i].phase);
      }
    }

    return value;
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
                      onChange={this.changeHarmonic}
                      onRemove={this.removeHarmonic}
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
                  <Input
                    type="number"
                    name="noiseAmplitude"
                    id="noiseAmplitude"
                    value={this.state.noiseAmplitude}
                    onChange={this.changeNoiseAmplitude}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <Label for="signalLength">Signal Length</Label>
                  <Input
                    type="number"
                    name="signalLength"
                    id="signalLength"
                    value={this.state.signalLength}
                    onChange={this.changeSignalLength}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <Label for="samplingPeriod">Sampling Period (Kotelnikov)</Label>
                  <Input
                    type="number"
                    name="samplingPeriod"
                    id="samplingPeriod"
                    value={this.state.samplingPeriod}
                  />
                </FormGroup>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <div>
              {/*<Scatter data={{ datasets: [{ label: 'Signal', data: this.state.data }] }} />*/}

              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggleTab('1'); }}
                  >
                    Graphic
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggleTab('2'); }}
                  >
                    АЧХ
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'Signal', data: this.state.data }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    АЧХ
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Lab1;
