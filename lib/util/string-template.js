/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const { _protected } = requireLib('util/scope')();

class StringTemplate extends BaseObject
{
    constructor(template, callback = (value) => value)
    {
        super();

        const internalTemplate = template.replace(
            /\$\{(\s*[^;\s{]+\s*)\}/g,
            (_, match) => `\${callback(map.${match.trim()})}`
        );

        const self = _protected(this);

        self.callback = callback;
        self.runner = Function('map, callback', `return \`${internalTemplate}\``);
    }

    run(values = {}, callback = _protected(this).callback)
    {
        const self = _protected(this);
        return self.runner(values, callback);
    }
}

module.exports = StringTemplate;
