import React, { Component } from "react";
import Tree from 'react-d3-tree';

import './App.css';
import './components/Modal.css';

import RightContext from "./components/RightContext";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json_data: {},
      flow_data: {},
    };
  }

  fetchAPI() {
    fetch("http://localhost:9000/readJson")
      .then(res => res.text())
      .then(res => this.setState({ json_data: JSON.parse(res) }));
  }

  componentDidMount() {
    this.fetchAPI();
  }

  setFlowData(data) {
    this.state.flow_data = data;
  }

  render() {
    return (
      <>
        <div id='searchPanel'>
          <input name='search' id='search' placeholder='Search...' autoFocus/>
        </div>
        <RightContext
          json_data={this.state.json_data}
          fetch={()=>this.fetchAPI()}
          setFlowData={() => this.setFlowData()}
          />
        { this.state.flow_data.children && 
          <div id="flow-chart">
            <h3>Flow Chart</h3>
            <Tree
              data={this.state.flow_data}
              orientation={ 'horizontal' }
              collapsible={ false }
              zoomable={ false }
              pathFunc={ 'straight' }
              />
          </div>
        }
      </>
    );
  }
}

export default App;
