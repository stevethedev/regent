module.exports = {
    defineTags(dictionary)
    {
        dictionary.defineTag('chainable', {
            // mustNotHaveValue: true,
            // mustNotHaveDescription: true,
            onTagged(doclet) {
                doclet.scope = 'instance';
            }
        });
    },
};
