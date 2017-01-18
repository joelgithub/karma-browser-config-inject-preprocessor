'use strict'

describe("karma-pact-preprocessor", function () {

    const performer = require('../performer.js');

    const logger = {
        create: (name)=> {return {error: (message) => {}}}
    };

    const file = {
        originalPath: "/fake/path"
    };

    it("should replace hostname and pactPort", function(done) {
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
        let content = "var host, port; const pactPort = 4000;";
        let replaceDone = function(updatedContent) {
            console.log("inside replaceDone: " + updatedContent);
            expect(updatedContent).toContain('var host = "myhost",');
            expect(updatedContent).toContain('const pactPort = 5500;');
            done();
        };
        let preprocessor = performer(config, logger);
        preprocessor(content, file, replaceDone);
    });

});