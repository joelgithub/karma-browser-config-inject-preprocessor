
var createBrowserConfigInjectPreprocessor = function (config, logger) {
    config = config || {};
    console.log("config: " + JSON.stringify(config));

    var log = logger.create('preprocessor.browserConfigInject');
    var defaultOptions = {
        bare: true,
        sourceMap: false
    };

    return function (content, file, done) {
        let replacements = config.pactPreProcessor.replacements;
        console.log("replacements: " + JSON.stringify(replacements));
        let content_ = content;
        for (i=0; i<replacements.length; i++) {
            let r = replacements[i];
            console.log("r is: " + JSON.stringify(r));
            let confValue = getConfValueFor(r.confValueKey, config);
            console.log("confValue is: " + confValue);
            if(confValue) {
                let regexp = new RegExp("([const|let|var]\\s" + r.mapToConst + ")(.*?)([;|,])(.*$)", "g");
                if(needQuotes(confValue)) {
                    console.log("NEED QUOTES");
                    content_ = content_.replace(regexp, "$1 = \"" + confValue + "\"$3$4");
                }
                else {
                    console.log("DON'T NEED QUOTES");
                    content_ = content_.replace(regexp, "$1 = " + confValue + "$3$4");
                }
            }
        }
        try {
            done(content_);
        } catch (e) {
            log.error('%s\n  at %s', e.message, file.originalPath);
        }
    }
};

function needQuotes(val) {
    return !(typeof variable === 'boolean' || !isNaN(val));
};

function getConfValueFor(confValueKey, config) {
    if(confValueKey.includes('.')) {
        let confValueKeyParts = confValueKey.split('.');
        return getConfValueFor(confValueKeyParts[1], config[confValueKeyParts[0]]);
    }
    else {
        return config[confValueKey];
    }
}

createBrowserConfigInjectPreprocessor.$inject = ['config', 'logger'];

module.exports = createBrowserConfigInjectPreprocessor;