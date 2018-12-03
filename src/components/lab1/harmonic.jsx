import React, { Component } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

class Harmonic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      amplitude: this.props.amplitude,
      frequency: this.props.frequency,
      phase: this.props.phase
    };
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Label for="amplitude">Amplitude</Label>
          <Input type="number" name="amplitude" id="amplitude" value={this.state.amplitude} />
        </FormGroup>
        <FormGroup>
          <Label for="frequency">Frequency</Label>
          <Input type="number" name="frequency" id="frequency" value={this.state.frequency} />
        </FormGroup>
        <FormGroup>
          <Label for="phase">Phase</Label>
          <Input type="number" name="phase" id="phase" value={this.state.phase} />
        </FormGroup>
      </div>
    );
  }

}

export default Harmonic;
