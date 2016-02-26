/**
 * Created by Anurag on 12/9/2015.
 * This js file serves for all kinds of interactions on the questions page.
 * Currently using mock data, it will eventually get data from backend endpoints.
 */

var questions = [];

// initializing all mock questions
questions[0] = {
    question: "int x = 4 <br> x = x + 10 <br> What is the value of x?",
    options: ['1', '14', '15', '13'],
    hint: "This code creates an integer, or “int”, initializes it to a value, and then modifies it. What does it modify it to?",
    correctAnswer: "14",
    questionExplanation: "This code creates an integer, or “int”, initializes it to 4, and then adds 10, so the correct answer is 14.",
    imageURL: "https://wiki.cites.illinois.edu/wiki/download/attachments/565347446/Cookie%203%20Strokes%20Gone.png?version=1&modificationDate=1449448398000&api=v2"
};
questions[1] = {
    question: 'What is the difference between \"0\" and 0?',
    options: ['\"0\" is a string/character', '\"0\" is an integer', '\"0\" and 0 are the same', '0 is a string/character'],
    hint: "A \"string\" is an ordered set of characters, or \"chars\", meant to be interpreted as text. A string could be \"hello\", \"gsf4cnd37\", or even \"12334\". An integer, or \"int\", is a number, rather than text. An int could be 24, 16, or even -12334. Which do you think is a number, and which do you think is text?",
    correctAnswer: "\"0\" is a string/character",
    questionExplanation: "A \"string\" is an ordered set of characters, or \"chars\", meant to be interpreted as text. A string could be \"hello\", \"gsf4cnd37\", or even \"12334\". An integer, or \"int\", is a number, rather than text. An int could be 24, 16, or even -12334. Here, \"0\" refers to a character, and 0 refers to the number 0.",
    imageURL: "https://wiki.cites.illinois.edu/wiki/download/attachments/565347446/Cookie%202%20Strokes%20Gone.png?version=2&modificationDate=1449660899902&api=v2"
};
questions[2] = {
    question: "int[] arr = [ 64, 18, 32, 23 ] <br> print(arr[1])<br>What does this code output?",
    options: ['64', '18', '32', '23'],
    hint: "This code creates and initializes an int array, or an ordered set of integers. Then, it prints out the value at a specific index of the array. Remember, in most programming languages, arrays are indexed starting at 0.",
    correctAnswer: '18',
    questionExplanation: "This code creates and initializes an int array, or an ordered set of integers. Then, it prints out the value at a specific index of the array. Remember, in most programming languages, arrays are indexed starting at 0. Therefore, the value of the array at index 1 is 18.",
    imageURL: "https://wiki.cites.illinois.edu/wiki/download/attachments/565347446/Cookie%201%20Stroke%20Gone.png?version=1&modificationDate=1449448386000&api=v2"
};

var totalNumberOfQuestions = 3;
var currentQuestion = 0;
var fullCookieImage = "https://wiki.cites.illinois.edu/wiki/download/attachments/565347446/Cookie%20Full%20Letters.png?version=1&modificationDate=1449448401000&api=v2";

/**
 * function to check if an answer is correct or wrong and call function to update question accordingly.
 */
function evaluateAnswer() {
    // find the id of the option of the radio button the user has selected
    var rightOptionId = $('#question-options input:radio:checked').attr('id');
    var optionIdTextId = rightOptionId + '-text';
    var attemptedAnswer = $('#' + optionIdTextId).html();
    var correctAnswer = questions[currentQuestion - 1].correctAnswer;

    if (correctAnswer == attemptedAnswer) {
        // correct answer

        // update progress value
        progress = (currentQuestion / totalNumberOfQuestions) * 100;
        var newValue = progress;
        $('#progress-bar-question').css('width', newValue + '%').attr('aria-valuenow', newValue);
        $('#progress-bar-question').html(parseInt(progress) + "%");

        loadNextQuestion();
        // for testing purpose
        return 1;
    }
    else{
        // wrong answer
        swal("Wrong!", "Try a hint?", "error");
        return 0;
    }




}
/**
 * Function to display success alert message and then
 * update all elements of the question including the text, number, options, image
 */
function loadNextQuestion() {

    //check if last question over
    if (currentQuestion == totalNumberOfQuestions) {
        document.getElementById("cookie-image").setAttribute('src',fullCookieImage);
        lastQuestionCorrect();
        return;
    }
    // else update everything
    if (currentQuestion != 0)
        swal("Good job!", "You got it right!", "success")
    document.getElementById("cookie-image").setAttribute('src',questions[currentQuestion].imageURL);
    document.getElementById("questionNumber").innerHTML = currentQuestion + 1;
    document.getElementById("questionText").innerHTML = questions[currentQuestion].question;
    document.getElementById("option1-text").innerHTML = questions[currentQuestion].options[0];
    document.getElementById("option2-text").innerHTML = questions[currentQuestion].options[1];
    document.getElementById("option3-text").innerHTML = questions[currentQuestion].options[2];
    document.getElementById("option4-text").innerHTML = questions[currentQuestion].options[3];
    currentQuestion++;
    return currentQuestion;
}

/**
 * Function to display a hint in the form of an alert box
 */
function getHint() {
    var hintText = questions[currentQuestion - 1].hint;
    swal("Here's a hint!", hintText, "info");
    return hintText;
}

/**
 * This function is called when the last question is answered correctly.
 */
function lastQuestionCorrect() {
    swal({
            title: "Sweet!",
            text: "You got that right too! You're now on your way to your cookie!",
            imageUrl: "http://barkpost-assets.s3.amazonaws.com/wp-content/uploads/2013/11/3dDoge.gif",
            confirmButtonColor: "green",
            confirmButtonText: "Yes, give it to me!"
        },
        function () {
            // redirection to future-steps page.
            window.location = 'future'
        });


}