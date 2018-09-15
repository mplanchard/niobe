import { Map } from 'immutable';
import { MutableMap } from '../generic_interface';
import State from '../state';
import StateStore, { Action } from '../state_store';


const simpleReducer = (previousState: State, action: Action) => {
    switch (action.type) {
        case 'INCREMENT_A':
            return previousState.set(
                'a',
                (previousState.get('a') === undefined)
                    ? 1
                    : previousState.get('a') + 1,
            );
        default:
            return previousState;
    }
};

const storeWithSimpleReducer = () => StateStore.createStore(simpleReducer);

const createAction = (type: string, payload?: MutableMap): Action => (
    {type, payload}
);


describe('the state store', () => {
    it('should start with an empty state', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
    });

    it('should update the current state after dispatch', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 2}));
    });

    it('should be able to rewind to the previous state', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.rewind();
        expect(store.currentState).toEqual(State.of({}));
    });

    it('should be able to fast-forward to the next state', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.rewind();
        expect(store.currentState).toEqual(State.of({}));
        store.fastForward();
        expect(store.currentState).toEqual(State.of({a: 1}));
    });

    it('should stay at the earliest state if rewinding from there', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.rewind();
        expect(store.currentState).toEqual(State.of({}));
        store.rewind();
        expect(store.currentState).toEqual(State.of({}));
    });

    it('should stay at the latest state if fast-forwarding from there', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(State.of({}));
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.rewind();
        expect(store.currentState).toEqual(State.of({}));
        store.fastForward();
        expect(store.currentState).toEqual(State.of({a: 1}));
        store.fastForward();
        expect(store.currentState).toEqual(State.of({a: 1}));
    });

    it('should return the same thing for getState() and currentState', () => {
        const store = storeWithSimpleReducer();
        expect(store.currentState).toEqual(store.getState());
        store.dispatch(createAction('INCREMENT_A'));
        expect(store.currentState).toEqual(store.getState());
    });
});
