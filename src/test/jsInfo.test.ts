import { name, getName, getSum } from '../jsInfo';

describe('jsInfo test', () => {
    it('name test', () => {
        expect(name).toBe('CIT');
    });

    it('getName test', () => {
        expect(getName()).toBe('제 이름은 CIT입니다.');
    });

    it('getName test', () => {
        expect(getSum(5)).toBe(12);
    });
})