import React, { Component } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button
} from 'reactstrap';
import Harmonic from './lab/harmonic';
import { Scatter } from 'react-chartjs-2';
import { getDefaultHarmonic, getRandomHarmonic } from '../utils/harmonics';
import classnames from 'classnames';
import '../assets/css/styles.css';
import { getIntInRange } from '../utils/utils';

const SCALE = 500;

class Lab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      isChanged: false,

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
      signalDataFirstOrderFilter: [],

      segmentationData: []
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
    this.calculateAmplitudeFrequencyData = this.calculateAmplitudeFrequencyData.bind(
      this
    );
    this.calculatePhaseFrequencyData = this.calculatePhaseFrequencyData.bind(
      this
    );
    this.calculateSignalDataHenningFilter = this.calculateSignalDataHenningFilter.bind(
      this
    );
    this.calculateSignalDataParabolicFilter = this.calculateSignalDataParabolicFilter.bind(
      this
    );
    this.calculateSignalDataFirstOrderFilter = this.calculateSignalDataFirstOrderFilter.bind(
      this
    );
    this.makeChanges = this.makeChanges.bind(this);
    this.makeSegmentation = this.makeSegmentation.bind(this);
  }

  async componentWillMount() {
    this.addHarmonic();
    this.makeChanges();
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  addHarmonic() {
    let harmonics = this.state.harmonics;
    harmonics.push(getDefaultHarmonic());
    this.setState({
      harmonics,
      isChanged: true
    });
  }

  changeHarmonic(index, harmonic) {
    let harmonics = this.state.harmonics;
    harmonics[index] = harmonic;

    this.setState({
      harmonics,
      isChanged: true
    });
  }

  makeChanges() {
    this.setState({
      isChanged: false
    });
    this.recalculate();
  }

  removeHarmonic(index) {
    let harmonics = this.state.harmonics;
    harmonics.splice(index, 1);

    this.setState({
      harmonics,
      isChanged: true
    });
  }

  changeNoiseAmplitude(event) {
    this.setState({
      noiseAmplitude: event.target.value,
      isChanged: true
    });
  }

  changeSignalLength(event) {
    this.setState({
      signalLength: event.target.value,
      isChanged: true
    });
  }

  recalculate() {
    const samplingPeriod = this.calculateSamplingPeriod();

    const signalData = this.calculateSignalData(samplingPeriod);
    const powerData = this.calculatePowerData(samplingPeriod);
    const amplitudeFrequencyData = this.calculateAmplitudeFrequencyData(
      samplingPeriod,
      signalData
    );
    const phaseFrequencyData = this.calculatePhaseFrequencyData(
      samplingPeriod,
      signalData
    );
    const signalDataHenningFilter = this.calculateSignalDataHenningFilter(
      samplingPeriod,
      signalData
    );
    const signalDataParabolicFilter = this.calculateSignalDataParabolicFilter(
      samplingPeriod,
      signalData
    );
    const signalDataFirstOrderFilter = this.calculateSignalDataFirstOrderFilter(
      samplingPeriod,
      signalData
    );
    this.setState({
      samplingPeriod,
      signalData,
      powerData,
      amplitudeFrequencyData,
      phaseFrequencyData,
      signalDataHenningFilter,
      signalDataParabolicFilter,
      signalDataFirstOrderFilter
    });
  }

  calculateSamplingPeriod() {
    let samplingPeriod =
      1 /
      (2 *
        Math.max.apply(Math, this.state.harmonics.map(item => item.frequency)));

    return samplingPeriod;
  }

  calculateSignalData(samplingPeriod) {
    let signalData = [];

    const getY = x => {
      let value = 0;
      for (let i = 0; i < this.state.harmonics.length; i++) {
        if (this.state.noiseAmplitude !== 0) {
          value =
            value +
            this.state.harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * this.state.harmonics[i].frequency * x +
                  this.state.harmonics[i].phase
              ) +
            Math.random() *
              (this.state.noiseAmplitude / 2 - -this.state.noiseAmplitude / 2) +
            -this.state.noiseAmplitude / 2;
        } else {
          value =
            value +
            this.state.harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * this.state.harmonics[i].frequency * x +
                  this.state.harmonics[i].phase
              );
        }
      }

      return value;
    };

    for (let i = 0; i <= this.state.signalLength; i += samplingPeriod) {
      signalData.push({
        x: i,
        y: getY(i / SCALE)
      });
    }

    return signalData;
  }

  calculatePowerData(samplingPeriod) {
    let powerData = [];

    const getY = x => {
      let value = 0;
      for (let i = 0; i < this.state.harmonics.length; i++) {
        if (this.state.noiseAmplitude !== 0) {
          value =
            value +
            this.state.harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * this.state.harmonics[i].frequency * x +
                  this.state.harmonics[i].phase
              ) +
            Math.random() *
              (this.state.noiseAmplitude / 2 - -this.state.noiseAmplitude / 2) +
            -this.state.noiseAmplitude / 2;
        } else {
          value =
            value +
            this.state.harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * this.state.harmonics[i].frequency * x +
                  this.state.harmonics[i].phase
              );
        }
      }

      return Math.pow(value, 2);
    };

    for (let i = 0; i <= this.state.signalLength; i += samplingPeriod) {
      powerData.push({
        x: i,
        y: getY(i / SCALE)
      });
    }

    return powerData;
  }

  calculateAmplitudeFrequencyData(samplingPeriod, signalData) {
    const N = this.state.signalLength / samplingPeriod;
    let amplitudeFrequencyData = [];

    for (let x = 0; x <= N; x++) {
      let Re = 0;
      let Im = 0;
      for (let i = 0; i < N; i++) {
        Re = Re + signalData[i].y * Math.cos((Math.PI * 2 * i * x) / N);
        Im = Im + signalData[i].y * Math.sin((Math.PI * 2 * i * x) / N);
      }

      amplitudeFrequencyData.push({
        x: x,
        y: Math.sqrt(Re * Re + Im * Im) / (N / 2)
      });
    }

    return amplitudeFrequencyData;
  }

  calculatePhaseFrequencyData(samplingPeriod, signalData) {
    const N = this.state.signalLength / samplingPeriod;

    let phaseFrequencyData = [];

    for (let x = 0; x <= N; x++) {
      let Re = 0;
      let Im = 0;
      for (let i = 0; i < N; i++) {
        Re = Re + signalData[i].y * Math.cos((Math.PI * 2 * i * x) / N);
        Im = Im + signalData[i].y * Math.sin((Math.PI * 2 * i * x) / N);
      }

      phaseFrequencyData.push({
        x: x,
        y:
          Re > 0.0001
            ? this.state.noiseAmplitude !== 0
              ? Math.atan(Im / Re) / 1.4
              : Math.atan(Im / Re) / 1.5
            : 0
      });
    }

    return phaseFrequencyData;
  }

  calculateSignalDataHenningFilter(samplingPeriod, signalData) {
    let signalDataHenningFilter = [];

    const N = this.state.signalLength / samplingPeriod;
    const k1 = 1 / 2;
    const k2 = 1 / 4;

    for (let x = 2; x < N; x++) {
      const value =
        k2 * signalData[x].y +
        k1 * signalData[x - 1].y +
        k2 * signalData[x - 2].y;
      signalDataHenningFilter.push({
        x: x,
        y: value
      });
    }

    return signalDataHenningFilter;
  }

  calculateSignalDataParabolicFilter(samplingPeriod, signalData) {
    let signalDataParabolicFilter = [];

    const N = this.state.signalLength / samplingPeriod;
    const k1 = -3;
    const k2 = 12;
    const k3 = 17;

    for (let x = 2; x < N - 3; x++) {
      let value =
        k1 * signalData[x - 2].y +
        k2 * signalData[x - 1].y +
        k3 * signalData[x].y +
        k2 * signalData[x + 1].y +
        k1 * signalData[x + 2].y;
      signalDataParabolicFilter.push({
        x: x,
        y: value
      });
    }

    return signalDataParabolicFilter;
  }

  calculateSignalDataFirstOrderFilter(samplingPeriod, signalData) {
    let signalDataFirstOrderFilter = [];

    const N = this.state.signalLength / samplingPeriod;
    const k1 = 1; // a
    const k2 = 2; // r

    for (let x = 2; x < N - 3; x++) {
      let value = k1 * signalData[x].y + k2 * signalData[x - 1].y;
      signalDataFirstOrderFilter.push({
        x: x,
        y: value
      });
    }

    return signalDataFirstOrderFilter;
  }

  makeSegmentation() {
    let totalSignalLength = 0;
    let segmentationData = [];

    const calculateSamplingPeriod = (harmonics) => {
      let samplingPeriod =
        1 /
        (2 *
          Math.max.apply(Math, harmonics.map(item => item.frequency)));

      return samplingPeriod;
    };

    const calculateSignalData = (harmonics, samplingPeriod, noiseAmplitude, signalLength) => {
      let signalData = [];

      const getY = x => {
        let value = 0;
        for (let i = 0; i < harmonics.length; i++) {
          if (noiseAmplitude !== 0) {
            value =
              value +
              harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * harmonics[i].frequency * x +
                harmonics[i].phase
              ) +
              Math.random() *
              (noiseAmplitude / 2 - -noiseAmplitude / 2) +
              -noiseAmplitude / 2;
          } else {
            value =
              value +
              harmonics[i].amplitude *
              Math.cos(
                Math.PI * 2 * harmonics[i].frequency * x +
                harmonics[i].phase
              );
          }
        }

        return value;
      };

      for (let i = totalSignalLength; i <= signalLength; i += samplingPeriod) {
        signalData.push({
          x: i,
          y: getY(i / SCALE)
        });
      }

      return signalData;
    };

    const segmentsCount = getIntInRange(2, 5);

    for (let segmentIterator = 0; segmentIterator < segmentsCount; segmentIterator++) {
      const harmonicsCount = getIntInRange(1, 5);
      const noiseAmplitude = getIntInRange(1, 5);
      const signalLength = getIntInRange(100, 1000);
      const fullSignalLength = totalSignalLength + signalLength;
      let samplingPeriod = 0;

      let harmonics = [];
      for (let harmonicIterator = 0; harmonicIterator < harmonicsCount; harmonicIterator++) {
        harmonics.push(getRandomHarmonic());
      }

      samplingPeriod = calculateSamplingPeriod(harmonics);

      const signalData = calculateSignalData(harmonics, samplingPeriod, noiseAmplitude, fullSignalLength);

      segmentationData.push({
        harmonics,
        noiseAmplitude,
        signalLength,
        samplingPeriod,
        signalData
      });

      totalSignalLength += signalLength;
    }

    console.log(segmentationData);

    this.setState({
      segmentationData
    });
  }

  getSegments(segmentationData) {
    let x_coordinates = [];
    let amplitudes = [];
    let prev_x_coordinate = 0;
    segmentationData.forEach(datum => {
      // const dispersion = Math.floor(datum.signalLength / 100);
      const dispersion = 5;
      const x_coordinate = datum.signalLength + getIntInRange(-dispersion, dispersion) + prev_x_coordinate;

      x_coordinates.push(x_coordinate);
      amplitudes.push(...datum.harmonics.map( harmonic => harmonic.amplitude ));

      prev_x_coordinate = x_coordinate;
    });

    x_coordinates.pop();
    const max_amplitude = Math.max(...amplitudes) * 5;

    let data = [];
    x_coordinates.forEach(x => {
      for (let y = -max_amplitude; y < max_amplitude; y++) {
        data.push({
          x,
          y
        });
      }
    });

    return data;
  }

  render() {
    return (
      <div>
        <Row className={'padding-20'}>
          <Col md={4}>
            <Form>
              <div>
                <h4 className={'text-center'}>Гармоники</h4>
                {this.state.harmonics.map((harmonic, index) => (
                  <Harmonic
                    index={index}
                    onChange={this.changeHarmonic}
                    onRemove={this.removeHarmonic}
                    {...harmonic}
                  />
                ))}
                <Button
                  color="primary"
                  onClick={this.addHarmonic}
                  disabled={this.state.harmonics.length >= 5}
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
                  <Label for="samplingPeriod">
                    Период Дискретизации (Т.Котельникова)
                  </Label>
                  <Input
                    type="number"
                    name="samplingPeriod"
                    id="samplingPeriod"
                    value={this.state.samplingPeriod}
                  />
                </FormGroup>
              </div>
              <div>
                <Button
                  color="primary"
                  disabled={!this.state.isChanged}
                  onClick={this.makeChanges}
                >
                  Применить изменения
                </Button>
                <Button
                  color="primary"
                  onClick={this.makeSegmentation}
                >
                  Построить график сегментации
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '1'
                    })}
                    onClick={() => {
                      this.toggleTab('1');
                    }}
                  >
                    График
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '2'
                    })}
                    onClick={() => {
                      this.toggleTab('2');
                    }}
                  >
                    График Мощности
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '3'
                    })}
                    onClick={() => {
                      this.toggleTab('3');
                    }}
                  >
                    АЧХ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '4'
                    })}
                    onClick={() => {
                      this.toggleTab('4');
                    }}
                  >
                    ФЧХ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '5'
                    })}
                    onClick={() => {
                      this.toggleTab('5');
                    }}
                  >
                    Фильтр Хеннинга
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '6'
                    })}
                    onClick={() => {
                      this.toggleTab('6');
                    }}
                  >
                    Параболический Фильтр
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '7'
                    })}
                    onClick={() => {
                      this.toggleTab('7');
                    }}
                  >
                    Фильтр Первого Порядка
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '8'
                    })}
                    onClick={() => {
                      this.toggleTab('8');
                    }}
                  >
                    Сегментация
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          { label: 'График', data: this.state.signalData }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          { label: 'Мощность', data: this.state.powerData }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          {
                            label: 'АЧХ',
                            data: this.state.amplitudeFrequencyData
                          }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          { label: 'ФЧХ', data: this.state.phaseFrequencyData }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          {
                            label: 'Фильтр Хеннинга',
                            data: this.state.signalDataHenningFilter
                          }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="6">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          {
                            label: 'Параболический Фильтр',
                            data: this.state.signalDataParabolicFilter
                          }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="7">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          {
                            label: 'Фильтр Первого Порядка',
                            data: this.state.signalDataFirstOrderFilter
                          }
                        ]
                      }}
                    />
                  </Row>
                </TabPane>
                <TabPane tabId="8">
                  <Row>
                    <Scatter
                      data={{
                        datasets: [
                          {
                            type: 'scatter',
                            label: 'График',
                            data: [].concat.apply([], this.state.segmentationData.map( item => item.signalData ))
                          },
                          {
                            type: 'line',
                            label: 'Сегменты',
                            data: this.getSegments(this.state.segmentationData),
                            borderColor: '#FF0000',
                            backgroundColor: '#FF0000',
                            pointBorderColor: '#FF0000',
                            pointBackgroundColor: '#FF0000',
                            pointHoverBackgroundColor: '#FF0000',
                            pointHoverBorderColor: '#FF0000',
                          }
                        ]
                      }}
                    />
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
