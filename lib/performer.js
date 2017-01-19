
var createBrowserConfigInjectPreprocessor = function (args, config, logger) {
    config = config || {};

    const log = logger.create('preprocessor.browserConfigInject');
    log.debug("config: " + JSON.stringify(config));

    return function (content, file, done) {
        let replacements = config.pactPreProcessor.replacements;
        log.debug("replacements: " + JSON.stringify(replacements));
        var content_ = content;
        for (i=0; i<replacements.length; i++) {
            let r = replacements[i];
            log.debug("r is: " + JSON.stringify(r));
            let confValue = getConfValueFor(r.confValueKey, config);
            log.debug("confValue is: " + confValue);
            if(confValue) {
                let regexp = new RegExp("((?:const|let|var)\\s*" + r.mapToConst + ")(.*?)([;|,])([\s\S]*)", "g");
                if(needQuotes(confValue)) {
                    log.debug("NEED QUOTES");
                    content_ = content_.replace(regexp, "$1 = \"" + confValue + "\"$3$4");
                }
                else {
                    log.debug("DON'T NEED QUOTES");
                    content_ = content_.replace(regexp, "$1 = " + confValue + "$3$4");
                }
            }
        }
        try {
            log.debug('substituted content: ' + content_);
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

createBrowserConfigInjectPreprocessor.$inject = ['args', 'config', 'logger'];

module.exports = createBrowserConfigInjectPreprocessor;