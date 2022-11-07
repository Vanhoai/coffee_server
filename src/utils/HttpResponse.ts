export class HttpResponse {
    static result = (message: string, code: number, data = {}) => {
        return {
            message: message || code === 200 ? 'OK' : 'ERROR',
            code,
            data,
        };
    };
}
