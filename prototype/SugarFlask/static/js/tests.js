/**
 * Created by Anurag on 12/9/2015.
 * This file contains all the unit-tests for the website.
 * To Do: Make functions independent of each other for better unit-testing.
 */
QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

QUnit.test("loadNextQuestion() test", function (assert) {
    var questionNumber = loadNextQuestion();
    assert.equal(questionNumber, 1);
});

QUnit.test("getHint() test", function (assert) {
    var questionNumber = currentQuestion;
    currentQuestion = 1;
    assert.equal(getHint(), "This code creates an integer, or “int”, initializes it to a value, and then modifies it. What does it modify it to?");
    // restore currentQuestion
    currentQuestion = questionNumber;
});


QUnit.test("evaluateAnswer() test", function (assert) {
    //select wrong answer
    $('#option4').click()
    //check if evaluateAnswer returned 0 (wrong)
    assert.equal(evaluateAnswer(), 0);

});