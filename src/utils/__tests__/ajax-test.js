var Ajax = require('../ajax');

describe('Making Ajax calls', function () {
    var successCB = function(){
            success = true;
        },
        failCB = function(){
            fail = true;
        },
        success = false,
        fail = false,
        attempts;

    beforeEach(function (done) {
        attempts = 0;
        spyOn($, 'ajax').and.callFake(function(opts){
            attempts ++;
            if(/.*success.*/.test(opts.url)) {
                opts.success({});
                done();
            } else {
                if(attempts === opts.retryLimit){
                    opts.error({ status: 404 });
                    done();
                } else {
                    opts.error({});
                }
            }
        });
        Ajax.call('success.url', successCB, failCB);
    });

    describe('When making an ajax call', function () {

        it('should call jQuerys ajax method with the supplied url', function () {
            expect($.ajax.calls.mostRecent().args[0]['url']).toEqual('success.url');
        });

        it('should fire the success callback when call succeeds', function () {
            expect(success).toBeTruthy();
        });

        describe('When the ajax call fails', function () {
            beforeEach(function () {
                Ajax.call('fail.url', successCB, failCB);
            });

            it('should make 2 attempts', function () {
                expect(attempts).toBe(2);
            });

            it('should fire the error callback', function () {
                expect(fail).toBeTruthy();
            });

        });

    });
});
