var save_page_contents;
var question_layouts = [];
const body = document.getElementsByTagName('body')[0];
var current_quiz;


function start_quiz() {
    save_page_contents = document.getElementsByTagName('body')[0].innerHTML;
    current_quiz = new Quiz();
    setup_quiz(current_quiz);
}

//Kode som håndterer quizen, både visuelt, logisk og lagring på databasen.
function setup_quiz(quiz) {

    body.innerHTML = "<div id='quiz-dark-background'><section class='quiz-page'><img src='images/cross.png' id='quiz-exit-button'><section id='quiz-content'><h2 style='margin-top: 10%;'>Skriv inn navnet ditt!</h2><input type='text' id='quiz-namefield' placeholder='Navn' style='width: 250px; text-align: center; margin-top: 1%; margin-bottom: 5%; padding: 5px; font-weight: bold;'><input type='button' value='Start Quiz!' id='start-quiz-button' class='quiz-buttons'></section></section></div>";
    body.style = "background-color: rgba(0, 0, 0, 0.808); min-width: 500px; overflow-x: hidden";
    setup_question_layouts();
    document.getElementById('quiz-exit-button').onclick = function (e) {
        e.preventDefault();
        if (confirm("Er du sikker på du vil avslutte quizen? Poengene dine vil ikkje bli registrerte!")) {
            body.style = "min-width: 500px; overflow-x: hidden";
            body.innerHTML = save_page_contents;
            save_page_contents = null;
            update_scoreboard();
        }
    }
    document.getElementById('start-quiz-button').onclick = function (e) {
        e.preventDefault();
        if (document.getElementById('quiz-namefield').value !== "") {
            quiz.name = document.getElementById('quiz-namefield').value;
            document.getElementById('quiz-content').innerHTML = question_layouts[0];
        }
        else {
            alert('Vennligst skriv inn navnet ditt!');
        }
    }
}

function setup_question_layouts() {

    question_layouts.push(get_question_format(1, "voss_sentrum.png", "Voss - bygd av vossingar.", 120, 100));
    question_layouts.push(get_question_format(2, "voss_kommune.png", "Voss skiforbund", 130, 70));
    question_layouts.push(get_question_format(3, "voss_avstand_1.png", "Wikipedia", 120, 80));
    question_layouts.push(get_question_format(4, "voss_skjold.png", "Fotoarkivet", 90, 120));
    question_layouts.push(get_question_format(5, "voss_sentrum.png", "Voss - bygd av vossingar", 120, 100));
    question_layouts.push(get_question_format(6, "voss_kommune.png", "Voss skiforbund", 130, 70));
    question_layouts.push(get_question_format(7, "voss_skjold.png", "Fotoarkivet", 90, 120));
    question_layouts.push(get_question_format(8, "voss_avstand_1.png", "Wikipedia", 120, 80));
    question_layouts.push(get_question_format(9, "pancake.png", "Foodnetwork", 100, 80));
    question_layouts.push(get_question_format(10, "voss_avstand_1.png", "Wikipedia", 120, 80));
}

function get_question_format(question_num, image, image_name, image_width, image_height) {
    return "<h2>Spørsmål #" + question_num + "</h2>" +
        "<article class='quiz-image-info'><img src='images/" + image + "' width='" + image_width + "' height='" + image_height + "'><div><img src='images/camera_logo.png' height='15' width='15'> <a>" + image_name + "</a></div></article>" +
        "<h3>" + questions[question_num - 1].question + "</h3>" +
        "<section class='quiz-answers-section'>" +
        "<h5 class='quiz-answers' id='answer1' onclick='question_answered(1)'>" + questions[question_num - 1].answer1 + "</h5>" +
        "<h5 class='quiz-answers' id='answer2' onclick='question_answered(2)'>" + questions[question_num - 1].answer2 + "</h5>" +
        "<h5 class='quiz-answers' id='answer3' onclick='question_answered(3)'>" + questions[question_num - 1].answer3 + "</h5>" +
        "<h5 class='quiz-answers' id='answer4' onclick='question_answered(4)'>" + questions[question_num - 1].answer4 + "</h5>" +
        "</section>";
}

function question_answered(answer) {
    switch (answer) {
        case 1:
            if (questions[current_quiz.current_question - 1].answer1 === questions[current_quiz.current_question - 1].correct) {
                current_quiz.points += 1;
            }
            break;
        case 2:
            if (questions[current_quiz.current_question - 1].answer2 === questions[current_quiz.current_question - 1].correct) {
                current_quiz.points += 1;
            }
            break;
        case 3:
            if (questions[current_quiz.current_question - 1].answer3 === questions[current_quiz.current_question - 1].correct) {
                current_quiz.points += 1;
            }
            break;
        case 4:
            if (questions[current_quiz.current_question - 1].answer4 === questions[current_quiz.current_question - 1].correct) {
                current_quiz.points += 1;
            }
            break;
    }
    current_quiz.current_question += 1;
    if (current_quiz.current_question > 10) {
        document.getElementById('quiz-content').innerHTML = "<h2>Du har fullført quizen om Voss!</h2><h3>Du svarte " + current_quiz.points + " / 10 rette!</h3><img src='images/voss_skjold.png' width='80' height='110'> <input type='button' onclick='finish_quiz()' value='Avslutt' class='quiz-buttons'>";
        return;
    }
    document.getElementById('quiz-content').innerHTML = question_layouts[current_quiz.current_question - 1];
}

function finish_quiz() {
    var body = document.getElementsByTagName('body')[0];
    body.style = "min-width: 500px;";
    body.innerHTML = save_page_contents;
    save_page_contents = null;
    location.reload();
    databaseQuizMemberReference.child(databaseQuizMemberReference.push().key).set({ name: current_quiz.name, points: current_quiz.points });
}

//Data til kvar quiz. Resettes til basics kvar gong ein ny vert laga.
class Quiz {
    constructor() {
        this.questions_total = 10;
        this.current_question = 1;
        this.points = 0;
        this.name = "";
    }
}

//Lagrer spørsmål, svar og svaralternativer til bruk seinare.
class Questions {
    constructor(snapshot) {
        this.question = snapshot.val().question;
        this.correct = snapshot.val().correct;
        this.answer1 = snapshot.val().answer1;
        this.answer2 = snapshot.val().answer2;
        this.answer3 = snapshot.val().answer3;
        this.answer4 = snapshot.val().answer4;
    }
}

var questions = [];
database.ref('quiz-questions').on('child_added', function (snapshot) {
    questions.push(new Questions(snapshot));
});