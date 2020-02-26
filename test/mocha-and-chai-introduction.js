// This a small tutorial on how to write test with Mocha and Chai.
//
// Mocha is a Node.js test runner. You use it to define and run tests.
// In this tutorial, we use Mocha through Buidler, by running: npx buidler test
//
// Chai is an assertion library for JavaScript. It helps you write shorter
// asserts and has great error messages when those fail. Chai has different
// assertion styles and APIs, but we are going to use `expect` in this tutorial.
//
// You don't need learn much more about them now, but for more info go to:
//   - Mocha: https://mochajs.org/
//   - Chai: https://www.chaijs.com/api/bdd/

// You musn't import Mocha here. It will be loaded by Buidler, and all of
// Mocha's functions will be automatically available for you.
//
// We do have to import Chai here. Note that we are only using its `expect` API.
const { expect } = require("chai");

// `describe` is a Mocha function that lets you organize your tests. It's not
// actually needed, but having your tests organized makes debugging them easier.
//
// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback must not be
// an async function.
describe("Mocha and Chai introduction", function() {
  describe("You can nest describe calls to create subsections", function() {
    // `it` is another Mocha function, this is the one you use to define your
    // tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    //
    // If your callback throws or resolves to a failed promise, your test will
    // fail.
    it("Should do something", function() {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to compare their values.
      expect(1).to.be.equal(1);

      // Connector properties/words like `to` and `be` are optional.
      expect(1).to.equal(1);
      expect(1).equal(1);
    });

    // You can call it multiple times inside a describe
    it("Should do something else", async function() {
      // You can also negate assertions
      expect(2).not.to.be.equal(1);
    });

    it("Should work with async functions", async function() {
      // If you pass an async function to it, you can test async functions using
      // await
      expect(await asyncId(1)).to.be.equal(1);
    });
  });

  describe("Test runner's lifecycle hooks", function() {
    // Mocha has four functions that let you hook into the the test reunner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.
    //
    // They are very useful to setup the environment for tets, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.
    let setOnBefore;
    let setOnBeforeEach;

    // If you pass `before` a callback, it will be run before any of test in
    // this `describe` is run, including nested `describe`'s tests.
    before(async function() {
      // You can pass them async functions, and Mocha will `await` them before
      // continuing.
      setOnBefore = await asyncId(1);
    });

    // This function is similar to `before`, but gets re-run before each test.
    // This also includes nested `describe`'s tests.
    beforeEach(async function() {
      setOnBeforeEach = 2;
    });

    // As you probably guessed, `after` runs its callback after all the tests
    // in this describe have finished. It doesn't matter if those failed or not.
    //
    // `afterEach` does it after each test has finished. We aren't calling them
    // here, but you can do it yourself.

    it("Should have have set everything", function() {
      expect(setOnBefore).to.be.equal(1);
      expect(setOnBeforeEach).to.be.equal(2);

      // In general, you want to keep every test independent from each other,
      // and these functions help you with that. They let you reinitialize
      // everything that may have changed.
      //
      // Here we change the setOnBeforeEach.
      setOnBeforeEach = 123;
    });

    describe("Nested describes are also affected", function() {
      it("Should have resetted everything on the beforeEach", function() {
        // `setOnBeforeEach` is `2` here, as it was resetted in the `beforeEach`
        // callback.
        expect(setOnBeforeEach).to.be.equal(2);

        // This wasn't actually resetted, but we never modified it.
        expect(setOnBefore).to.be.equal(1);
      });
    });
  });

  describe("Empty describes are ignore", function() {
    // This a common gotcha
  });
});

// This is just an async function that returns a promise that will resolve to
// the same value that you pass to it.
async function asyncId(value) {
  return value;
}
