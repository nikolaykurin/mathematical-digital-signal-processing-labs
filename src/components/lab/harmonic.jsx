import React, { Component } from 'react';
import { Row, Col, FormGroup, Input, Label, Button } from 'reactstrap';

class Harmonic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      amplitude: this.props.amplitude,
      frequency: this.props.frequency,
      phase: this.props.phase
    };

    this.changeAmplitude = this.changeAmplitude.bind(this);
    this.changeFrequency = this.changeFrequency.bind(this);
    this.changePhase = this.changePhase.bind(this);
  }

  changeAmplitude(event) {
    this.setState({
      amplitude: event.target.value
    }, () => {
      this.props.onChange(this.props.index, { ...this.state });
    });
  }

  changeFrequency(event) {
    this.setState({
      frequency: event.target.value
    }, () => {
      this.props.onChange(this.props.index, { ...this.state });
    });
  }

  changePhase(event) {
    this.setState({
      phase: event.target.value
    }, () => {
      this.props.onChange(this.props.index, { ...this.state });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={11}>
            <h5>#&nbsp;{ this.props.index + 1 }</h5>
          </Col>
          <Col md={1}>
            <Button
              color="danger"
              onClick={() => this.props.onRemove(this.props.index)}
              disabled={this.props.index === 0}
            >
              -
            </Button>
          </Col>
        </Row>
        <div>
          <FormGroup>
            <Label for="amplitude">Амплитуда</Label>
            <Input
              type="number"
              name="amplitude"
              id="amplitude"
              value={this.state.amplitude}
              onChange={this.changeAmplitude}
            />
          </FormGroup>
          <FormGroup>
            <Label for="frequency">Частота</Label>
            <Input
              type="number"
              name="frequency"
              id="frequency"
              value={this.state.frequency}
              onChange={this.changeFrequency}
            />
          </FormGroup>
          <FormGroup>
            <Label for="phase">Фаза</Label>
            <Input
              type="number"
              name="phase"
              id="phase"
              value={this.state.phase}
              onChange={this.changePhase}
            />
          </FormGroup>
        </div>
      </div>
    );
  }

}

export default Harmonic;
