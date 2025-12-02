import { http, HttpResponse } from 'msw';

export const handlers = [
    // Example handler
    http.get('/api/user', () => {
        return HttpResponse.json({ name: 'John Maverick' })
    }),
];
