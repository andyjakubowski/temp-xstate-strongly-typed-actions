import React from 'react';
import logo from './logo.svg';
import './App.css';

import { assign, createMachine, setup } from 'xstate';

interface MachineTypes {
  events: {
    type: 'UPDATE_PROFILE';
    age: number;
  };
  actions: {
    type: 'setAge';
    params: {
      age: number;
    };
  };
}

const testMachine = createMachine({
  types: {} as MachineTypes,
  id: 'foo',
  on: {
    // Type error thrown as expected
    // Type 'string' is not assignable to type '{ age: number; }'.
    UPDATE_PROFILE: {
      actions: [
        { type: 'setAge', params: ({ event }) => 'some incorrect value' },
      ],
    },
  },
});

testMachine.provide({
  actions: {
    // Correct params type
    // params: {
    //   age: number;
    // }
    setAge: (_, params) => undefined,
  },
});

//
const testMachineWithSetup = setup({
  types: {} as MachineTypes,
}).createMachine({
  id: 'foo',
  on: {
    // Type error is not thrown
    UPDATE_PROFILE: {
      actions: [
        { type: 'setAge', params: ({ event }) => 'some incorrect value' },
      ],
    },
  },
});

testMachineWithSetup.provide({
  actions: {
    // Undesired params type
    // params: NonReducibleUnknown
    setAge: (_, params) => undefined,
  },
});

const testMachineThree = setup({
  types: {} as {
    events: { type: 'UPDATE_PROFILE'; age: number };
  },
  actions: {
    setAge: (_, params: { age: number }) => undefined,
  },
}).createMachine({
  id: 'foo',
  initial: 'incomplete',
  states: {
    incomplete: {
      on: {
        // Type error thrown as expected
        // Type 'string' is not assignable to type '{ age: number; }'.
        UPDATE_PROFILE: {
          actions: [
            {
              type: 'setAge',
              params: ({ event }) => 'some incorrect value',
            },
          ],
        },
      },
    },
  },
});

testMachineThree.provide({
  actions: {
    setAge: assign({
      // Correct params type
      // params: {
      //   age: number;
      // }
      age: (_, params) => params.age,
    }),
  },
});

const testMachineFour = setup({
  types: {} as MachineTypes,
  actions: {
    setAge: (_, params) => undefined,
  },
}).createMachine({
  id: 'foo',
  initial: 'incomplete',
  states: {
    incomplete: {
      on: {
        // Type error is not thrown
        UPDATE_PROFILE: {
          actions: [
            {
              type: 'setAge',
              params: ({ event }) => 'some incorrect value',
            },
          ],
        },
      },
    },
  },
});

testMachineFour.provide({
  actions: {
    setAge: assign({
      // Undesired params type
      // params: NonReducibleUnknown
      age: (_, params) => undefined,
    }),
  },
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
