/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const { $protected } = requireLib('util/scope')();

class StringTemplate extends BaseObject {
    constructor(template, callback = (value) => value) {
        super();

        const internalTemplate = template.replace(
            /\$\{(\s*[^;\s{]+\s*)\}/g,
            (skip, match) => `\${callback(map.${match.trim()})}`
        );

        const self = $protected(this);

        self.callback = callback;
        self.runner = Function(
            'map, callback',
            `return \`${internalTemplate}\``
        );
    }

    run(values = {}, callback = $protected(this).callback) {
        const self = $protected(this);
        return self.runner(values, callback);
    }
}

module.exports = StringTemplate;