import request from 'supertest';
import { app } from '../../src/server.js';

describe('Health Check API', () => {
    it('should return 200 and success message', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'api is up and running');
    });
});
