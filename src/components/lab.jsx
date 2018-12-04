import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Harmonic from './lab/harmonic';
import { Scatter } from 'react-chartjs-2';
import { getDefaultHarmonic } from '../utils/harmonics';

import classnames from 'classnames';
import '../assets/css/styles.css';

const SCALE = 500;

class Lab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',

      harmonics: [
        // amplitude, frequency, phase
      ],

      noiseAmplitude: 1,
      signalLength: 100,
      samplingPeriod: 0.2,

      signalData: [],
      powerData: [],
      amplitudeFrequencyData: [],
      phaseFrequencyData: [],
      signalDataHenningFilter: [],
      signalDataParabolicFilter: [],
      signalDataFirstOrderFilter: []
    };

    this.toggleTab = this.toggleTab.bind(this);

    this.addHarmonic = this.addHarmonic.bind(this);
    this.changeHarmonic = this.changeHarmonic.bind(this);
    this.removeHarmonic = this.removeHarmonic.bind(this);
    this.changeNoiseAmplitude = this.changeNoiseAmplitude.bind(this);
    this.changeSignalLength = this.changeSignalLength.bind(this);
    this.calculateSamplingPeriod = this.calculateSamplingPeriod.bind(this);
    this.calculateSignalData = this.calculateSignalData.bind(this);
    this.calculatePowerData = this.calculatePowerData.bind(this);
    this.calculateAmplitudeFrequencyData = this.calculateAmplitudeFrequencyData.bind(this);
    this.calculatePhaseFrequencyData = this.calculatePhaseFrequencyData.bind(this);
    this.calculateSignalDataHenningFilter = this.calculateSignalDataHenningFilter.bind(this);
    this.calculateSignalDataParabolicFilter = this.calculateSignalDataParabolicFilter.bind(this);
    this.calculateSignalDataFirstOrderFilter = this.calculateSignalDataFirstOrderFilter.bind(this);
  }

  async componentWillMount() {
    await this.addHarmonic();
    await this.recalculate();
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

    await this.recalculate();
  }

  async changeHarmonic(index, harmonic) {
    let harmonics = this.state.harmonics;
    harmonics[index] = harmonic;

    this.setState({
      harmonics
    });

    await this.recalculate();
  }

  async removeHarmonic(index) {
    let harmonics = this.state.harmonics;
    harmonics.splice(index, 1);

    this.setState({
      harmonics
    });

    await this.recalculate();
  }

  async changeNoiseAmplitude(event) {
    this.setState({
      noiseAmplitude: event.target.value
    });

    await this.recalculate();
  }

  async changeSignalLength(event) {
    this.setState({
      signalLength: event.target.value
    });

    await this.recalculate();
  }

  async recalculate() {
    await this.calculateSamplingPeriod();
    await this.calculateSignalData();
    await this.calculatePowerData();
    await this.calculatePowerData();
    await this.calculateAmplitudeFrequencyData();
    await this.calculatePhaseFrequencyData();
    await this.calculateSignalDataHenningFilter();
    await this.calculateSignalDataParabolicFilter();
    await this.calculateSignalDataFirstOrderFilter();
  }

  async calculateSamplingPeriod() {
    let samplingPeriod = 1 / (2 * Math.max.apply(Math, this.state.harmonics.map( item => item.frequency )));

    this.setState({
      samplingPeriod
    });
  }

  async calculateSignalData() {
    let signalData = [];

    const getY = (x) => {
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
    };

    for (let i = 0; i <= this.state.signalLength; i += this.state.samplingPeriod) {
      signalData.push({
        x: i,
        y: getY(i / SCALE)
      });
    }

    this.setState({
      signalData
    });
  }

  async calculatePowerData() {
    let powerData = [];

    const getY = (x) => {
      let value = 0;
      for (let i = 0; i < this.state.harmonics.length; i++) {
        if (this.state.noiseAmplitude !== 0) {
          value = value + this.state.harmonics[i].amplitude * Math.cos(Math.PI * 2 * this.state.harmonics[i].frequency * x + this.state.harmonics[i].phase) +
            Math.random() * (this.state.noiseAmplitude / 2 - (-this.state.noiseAmplitude / 2)) + (-this.state.noiseAmplitude / 2);
        } else {
          value = value + this.state.harmonics[i].amplitude * Math.cos(Math.PI * 2 * this.state.harmonics[i].frequency * x + this.state.harmonics[i].phase);
        }
      }

      return Math.pow(value, 2);
    };

    for (let i = 0; i <= this.state.signalLength; i += this.state.samplingPeriod) {
      powerData.push({
        x: i,
        y: getY(i / SCALE)
      });
    }

    this.setState({
      powerData
    });
  }

  async calculateAmplitudeFrequencyData() {
    const N = this.state.signalLength / this.state.samplingPeriod;

    let amplitudeFrequencyData = [];

    for (let x = 0; x <= N; x++) {
      let Re = 0;
      let Im = 0;
      for (let i = 0; i < N; i++) {
        Re = Re + this.state.signalData[i].y * Math.cos(Math.PI * 2 * i * x / N);
        Im = Im + this.state.signalData[i].y * Math.sin(Math.PI * 2 * i * x / N);
      }

      amplitudeFrequencyData.push({
        x: x,
        y: Math.sqrt(Re * Re + Im * Im) / (N / 2)
      });
    }

    this.setState({
      amplitudeFrequencyData
    });
  }

  async calculatePhaseFrequencyData() {
    const N = this.state.signalLength / this.state.samplingPeriod;

    let phaseFrequencyData = [];

    for (let x = 0; x <= N; x++) {
      let Re = 0;
      let Im = 0;
      for (let i = 0; i < N; i++) {
        Re = Re + this.state.signalData[i].y * Math.cos(Math.PI * 2 * i * x / N);
        Im = Im + this.state.signalData[i].y * Math.sin(Math.PI * 2 * i * x / N);
      }

      phaseFrequencyData.push({
        x: x,
        y: Re > 0.0001 ? (this.state.noiseAmplitude !== 0 ? Math.atan(Im / Re) / 1.4 : Math.atan(Im / Re) / 1.5 ) : 0
      });
    }

    this.setState({
      phaseFrequencyData
    });
  }

  async calculateSignalDataHenningFilter() {
    let signalDataHenningFilter = [];

    const N = this.state.signalLength / this.state.samplingPeriod;
    const k1 = 1 / 2;
    const k2 = 1 / 4;

    for (let x = 2; x < N; x++) {
      const value = k2 * this.state.signalData[x].y + k1 * this.state.signalData[x - 1].y + k2 * this.state.signalData[x - 2].y;
      signalDataHenningFilter.push({
        x: x,
        y: value
      });
    }

    this.setState({
      signalDataHenningFilter
    });
  }

  async calculateSignalDataParabolicFilter() {
    let signalDataParabolicFilter = [];

    const N = this.state.signalLength / this.state.samplingPeriod;
    const k1 = -3;
    const k2 = 12;
    const k3 = 17;

    for (let x = 2; x < N - 3; x++) {
      let value = k1 * this.state.signalData[x - 2].y + k2 * this.state.signalData[x - 1].y + k3 * this.state.signalData[x].y + k2 * this.state.signalData[x + 1].y + k1 * this.state.signalData[x + 2].y;
      signalDataParabolicFilter.push({
        x: x,
        y: value
      });
    }

    console.log(signalDataParabolicFilter);

    this.setState({
      signalDataParabolicFilter
    });
  }

  async calculateSignalDataFirstOrderFilter() {
    let signalDataFirstOrderFilter = [];

    const N = this.state.signalLength / this.state.samplingPeriod;
    const k1 = 1; // a
    const k2 = 2; // r

    for (let x = 2; x < N - 3; x++) {
      let value = k1 * this.state.signalData[x].y + k2 * this.state.signalData[x - 1].y;
      signalDataFirstOrderFilter.push({
        x: x,
        y: value
      });
    }

    this.setState({
      signalDataFirstOrderFilter
    });
  }

  render() {
    return (
      <div>
        <Row className={ 'padding-20' }>
          <Col md={4}>
            <Form>
              <div>
                <h4 className={ 'text-center' }>Гармоники</h4>
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
                  <Label for="noiseAmplitude">Амплитуда шума</Label>
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
                  <Label for="signalLength">Длина Сигнала (мс.)</Label>
                  <Input
                    type="number"
                    name="signalLength"
                    id="signalLength"
                    step={100}
                    value={this.state.signalLength}
                    onChange={this.changeSignalLength}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <Label for="samplingPeriod">Период Дискретизации (Т.Котельникова)</Label>
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
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggleTab('1'); }}
                  >
                    График
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggleTab('2'); }}
                  >
                    График Мощности
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggleTab('3'); }}
                  >
                    АЧХ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggleTab('4'); }}
                  >
                    ФЧХ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '5' })}
                    onClick={() => { this.toggleTab('5'); }}
                  >
                    Фильтр Хеннинга
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '6' })}
                    onClick={() => { this.toggleTab('6'); }}
                  >
                    Параболический Фильтр
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '7' })}
                    onClick={() => { this.toggleTab('7'); }}
                  >
                    Фильтр Первого Порядка
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'График', data: this.state.signalData }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'Мощность', data: this.state.powerData }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'АЧХ', data: this.state.amplitudeFrequencyData }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'ФЧХ', data: this.state.phaseFrequencyData }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'Фильтр Хеннинга', data: this.state.signalDataHenningFilter }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="6">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'Параболический Фильтр', data: this.state.signalDataParabolicFilter }] }} />
                  </Row>
                </TabPane>
                <TabPane tabId="7">
                  <Row>
                    <Scatter data={{ datasets: [{ label: 'Фильтр Первого Порядка', data: this.state.signalDataFirstOrderFilter }] }} />
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

export default Lab;
