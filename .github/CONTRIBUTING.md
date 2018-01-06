## How to Contribute to Regent

Thank you for your interest in contributing to Regent! Please read the
following before committing new code to the project.


### Did you find a bug?

- **Ensure the bug has not already been reported** by searching the
    [Issues] page.

- **If the problem hasn't already been reported, report it.** Please include as
    much relevant information as possible in the report.


### Did you write a patch that fixes a bug?

- **Open a new GitHub [Pull Request]** with the patch.

- **Clearly describe the problem and fix.** Please include any affected
    [issues] in the request.


### Did you write an update that adds a new feature?

- **Open a new GitHub [Pull Request]** with the update.

- **Clearly describe the feature.** Please include an why you think this
    feature should be included in Regent.


## Coding Standards

Many of Regent's coding standards are checked and identified through the linter
settings. Since this is an open-source project, a human will eventually need to
read your code. Please be mindful of this as you write your code, avoiding
practices and anti-patterns like:

- **One-letter variable names.** With the exception of widely known and
    accepted patterns, please make sure your variable names are explanatory
    and descriptive.

- **Bad Hungarian Notation.** Variable names like ```stringUserName``` are
    longer than they need to be and not very useful since JavaScript is a
    loosely typed language.

Please supplement your code with JSDoc style comments. Your comments should
explain *what* your code does and *why*; not *how* your code does it.


## Testing

Ideally, you should write your tests before writing your code. This helps to
ensure that the way your code behaves and interfaces with the rest of the
code-base is deliberate and thoughtful. The hierarchy makes it easier to read
the test reports, and the granularity makes it easier to identify what specific
behavior failed. There is certain to be some redundancy in your tests, but this
will help deduce the source of bugs that are not explicitly tested for.

```javascript
// The class or feature being tested
describe('The FeatureClass', () => {
    // The function/method being tested
    describe('superFun method', () => {
        // The signature being tested
        describe('(<variableName>) signature', () => {
            // Individual behaviors
            it('should schedule a party', () => { /* test */ });
            it('should invite my friends', () => { /* test */ });
            it('should order a pizza', () => { /* test */ });
        });
    });
});
```


[Issues]: https://github.com/stevethedev/regent/issues
[Pull Request]: https://github.com/stevethedev/regent/pulls
