import { checkForName } from "../src/client/js/nameChecker"

describe('check value input', () => {
    test('test input is A value A and return also value A', () => {
        expect(checkForName('text')).toBe('text');
    });
});

