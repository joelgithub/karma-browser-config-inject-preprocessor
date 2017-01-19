'use strict'

describe("karma-pact-preprocessor", function () {

    const performer = require('../lib/performer.js');

    const logger = {
        create: (name) => {
            return {
                error: (message) => {
                    console.log(message);
                },
                debug: (message) => {
                    console.log(message);
                }
            }
        }
    };

    const file = {
        originalPath: "/fake/path"
    };

    const helper = {
        merge: function (a, b, c) {
            if (a) {
                for (var p in b) {
                    c[p] = a[p];
                }
            }
            return c;
        }
    };

    it("should replace hostname and pactPort", function (done) {
        let config = {
            hostname: "myhost",
            pact: {
                port: 5500
            },
            pactPreProcessor: {
                replacements: [
                    {
                        confValueKey: "hostname",
                        mapToConst: "host"
                    },
                    {
                        confValueKey: "pact.port",
                        mapToConst: "pactPort"
                    }
                ]
            }
        };
        let content = "/* global module, angular */" + '\n' +

        "angular.module('pactBootstrap', []);" + '\n' +
        "angular.module('pactBootstrap').factory('pactBootstrapService', function () {" + '\n' +
"   " +
       "     const host = 'localhost';" + '\n' +
       "     const pactPort = 5001;" + '\n';
        let content_ = "{ var host, port; const pactPort = 4000; }";
        let replaceDone = function (updatedContent) {
            console.log("inside replaceDone: " + updatedContent);
            expect(updatedContent).toContain('const host = "myhost";');
            expect(updatedContent).toContain('const pactPort = 5500;');
            done();
        };

        let preprocessor = performer({}, config, logger, helper);
        preprocessor(content, file, replaceDone);
    });

});