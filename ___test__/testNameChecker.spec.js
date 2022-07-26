import { checkEmptyField } from "../src/client/js/nameChecker"

describe('check value input', () => {
    test('test value input user press', () => {
        expect(checkEmptyField('text')).toBe('text');
    });
});

