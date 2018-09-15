import { Map } from 'immutable';
import State from "../state";

describe('the state object', () => {
    it('should compare equal for equivalent state maps', () => {
        expect(State.of({})).toEqual(State.of({}));
        expect(State.of(Map())).toEqual(State.of(Map()));
        expect(State.of({a: 1})).toEqual(State.of({a: 1}))
        expect(State.of(Map({a: 1}))).toEqual(State.of(Map({a: 1})))
    })

    it('should have differing identity for equivalen state maps', () => {
        expect(State.of({})).not.toBe(State.of({}))
    })

    it('should compare unequal for different state maps', () => {
        expect(State.of({})).not.toEqual(State.of({a: 1}));
        expect(State.of(Map())).not.toEqual(State.of(Map({a: 1})));
        expect(State.of({a: 1})).not.toEqual(State.of({a: 2}))
        expect(State.of(Map({a: 1}))).not.toEqual(State.of(Map({a: 2})))
    })
})