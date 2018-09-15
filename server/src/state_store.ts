import { List, Map } from 'immutable';
import State from './state';


export interface Action {
    [key: string]: any;
    type: string;
}

export type ReducerFunction = (previousState: State, action: Action) => State;

export type DispatchFunction = (action: Action) => null;

export type StateFunction = (
    getState: () => State,
    dispatch: DispatchFunction,
) => any;

export type DecoratedStateFunction = () => any;

type RegistryItem = DecoratedStateFunction;

type Registry = List<RegistryItem>;

interface StateProps {
    index?: number;
    reducer: ReducerFunction;
    registry?: Registry;
    states?: List<State>;
}

export default class StateStore {

    public static createStore(reducer: ReducerFunction) {
        return StateStore.of({reducer});
    }

    private static of(props: StateProps) {
        return new StateStore(props);
    }

    private states: List<State>;
    private registry: Registry;
    private index: number;
    private readonly reducer: ReducerFunction;

    constructor(props: StateProps) {
        this.index = (props.index === undefined) ? 0 : props.index;
        this.reducer = props.reducer;
        this.registry = (props.registry === undefined) ? List() : props.registry;
        this.states = (props.states === undefined)
            ? List([State.of({})])
            : props.states;
    }

    public get currentState() {
        return this.states.get(this.index);
    }

    public connect(func: StateFunction) {
        const getState = this.getState.bind(this);
        const dispatch = this.dispatch.bind(this);
        return () => func(getState, dispatch);
    }

    public dispatch(action: Action) {
        this.reduce(action);
    }

    public subscribe(func: StateFunction) {
        this.registry = this.registry.push(
            () => func(this.getState.bind(this), this.dispatch.bind(this)),
        );
        return this.registry.get(-1);
    }

    public getState() {
        return this.currentState;
    }

    public fastForward() {
        this.index = (this.index === this.registry.count() - 1)
            ? this.index
            : this.index + 1;
    }

    public rewind() {
        this.index = (this.index === 0) ? this.index : this.index - 1;
    }

    private pushState(state: State) {
        this.states = this.states.slice(0, this.index + 1).toList().push(state);
        this.index = this.index + 1;
    }

    private reduce(action: Action) {
        const newState = this.reducer(this.currentState, action);
        if (! this.currentState.equals(newState)) {
            this.pushState(newState);
            this.callSubscribers();
        }
    }

    private async callSubscribers() {
        // @ts-ignore
        this.registry.map((func) => func());
    }

}
