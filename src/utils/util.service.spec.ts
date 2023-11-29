import { UtilsService } from './util.service';

describe('Utils', () => {
    let service: UtilsService;

    beforeEach(() => {
        service = new UtilsService();
    });

    it('should generate a valid operationId object', () => {
        const operationId = service.generateOperationId();
        expect(operationId).toHaveProperty('index');
        expect(operationId).toHaveProperty('bankCode');
        expect(operationId).toHaveProperty('date');
        expect(operationId.bankCode).toBe('37');
        expect(typeof operationId.toString()).toBe('string');
    });

    it('should format operationId correctly', () => {
        const operationId = service.generateOperationId();
        const formattedOperationId = operationId.toString();
        expect(formattedOperationId).toMatch(/^\d{5}37\d{8}$/);
    });

    it('should format operationId correctly', () => {
        let operationId = service.generateOperationId();
        expect(operationId.toString()).toEqual("000013720231129");

        operationId = service.generateOperationId();
        expect(operationId.toString()).toEqual("000023720231129");

        operationId = service.generateOperationId();
        expect(operationId.toString()).toEqual("000033720231129");
    });
});
