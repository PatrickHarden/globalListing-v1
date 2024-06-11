import redirect from '../301redirect';
import sinon from 'sinon';
import $ from 'jQuery'

describe('301redirect', function () {
    let route;

    const router = {
            push: (obj) => {
                route = obj;
            }
        },
        path = '/path/to/thing',
        query = { param: 'param' };

    describe('When requesting a redirect', function () {

        describe('If the request comes from pre-render', function () {
            it('should add prerender 301 meta tags to the page', function() {
                sinon.stub(redirect, 'isPrerender', () => true);
                redirect(router, path, query);
                const $status = $('meta[name="prerender-status-code"]');
                expect($status.length).toBe(1);
                expect($status.attr('content')).toBe('301');
                const $header = $('meta[name="prerender-header"]');
                expect($header.length).toBe(1);
                expect($header.attr('content')).toBe('Location: /path/to/thing?param=param');
            });

            it('should resolve false', function(done) {
                redirect(router, path, query)
                    .then((res) => {
                        expect(res).toBe(false);
                        done();
                    });
            });
        });

        describe('If the request comes from an end user', function () {
            it('should utilise the passed in router', function() {
                redirect.isPrerender.restore();
                redirect(router, path, query);
                expect(route).toEqual({ pathname: '/path/to/thing', query: { param: 'param' } });
            });

            it('should resolve true', function(done) {
                redirect(router, path, query)
                    .then((res) => {
                        expect(res).toBe(true);
                        done();
                    });
            });
        });

    });
});
