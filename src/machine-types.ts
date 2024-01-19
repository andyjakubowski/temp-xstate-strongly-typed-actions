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

// ✅ Expected typing behavior

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

// 🚨 Unexpected typing behavior
const testMachineTwo = setup({
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

testMachineTwo.provide({
  actions: {
    // Undesired params type
    // params: NonReducibleUnknown
    setAge: (_, params) => undefined,
  },
});

// ✅ Expected typing behavior
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

// 🚨 Unexpected typing behavior
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
