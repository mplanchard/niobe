import { fromJS, Map } from 'immutable';
import { AnyFunction, MutableMap } from './generic_interface';

export default class State {

    public static of(state: MutableMap|Map<string, any>) {
        return new State(state);
    }

    public readonly state: Map<string, any>;

    constructor(state: MutableMap|Map<string, any>) {
        this.state = fromJS(state);
    }

    public equals(other: State) {
        return this.state.equals(other.state);
    }

    public get(key: string) {
        return this.state.get(key);
    }

    public getNested(key: string[]) {
        return this.state.getIn(key);
    }

    public map(func: AnyFunction) {
        return State.of(func(this.state));
    }

    public set(key: string, val: any) {
        return State.of(this.state.set(key, fromJS(val)));
    }

}
