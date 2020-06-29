//Kode for å håndtere å lage eit nytt medlem i scoreboard-tabellen.
class ScoreboardMember {
    constructor(name, points) {
        this.name = name;
        try {
            this.points = parseInt(points);
        }
        catch
        {
            this.points = 0;
        }
        this.ranking = 0;
        this.background_color = COLOR_CONSTANT_WHITESMOKE;
    }

    //Returnerer eit nytt table-row element som skal settes inn i scoreboard
    get_format_element() {
        if (this.points >= 10) {
            return "<tr class='' style='background-color: " + this.background_color + ";'> <td>" + this.ranking + "</td> <td class='scoreboard-member-name'> <a href='images/gold_medal.png'><img src='images/gold_medal.png' width='20' height='15'></a>" + this.name + "</td> <td>" + this.points + "</td> </tr>";
        }
        else {
            return "<tr class='' style='background-color: " + this.background_color + ";'> <td>" + this.ranking + "</td> <td class='scoreboard-member-name'>" + this.name + "</td> <td>" + this.points + "</td> </tr>";
        }
    }
}

//Statiske variabler brukt for å håndtere scoreboard.
var scoreboard_table = document.getElementById('scoreboard-table');
var scoreboard_members = [];
const COLOR_CONSTANT_WHITESMOKE = 'whitesmoke';
const COLOR_CONSTANT_LIGHTGRAY = 'lightgray';

function new_scoreboard_member(name, points) {
    scoreboard_members.push(new ScoreboardMember(name, points));
    determine_rankings();
    update_scoreboard();
}

function determine_ranking_for_member(points) {
    var return_var = 1;
    try {
        for (member of scoreboard_members) {
            if (points > member.points) {
                if (return_var > member.ranking) {
                    return_var = member.ranking;
                }
                member.ranking += 1;
            }
            else if (points === member.points) {
                return_var = member.ranking;
            }
            else {
                return_var = member.ranking + 1;
            }
        }
        return return_var;
    }
    catch (e) {
        return return_var;
    }
}

function determine_rankings() {
    var temp_list = [];
    var scoreboard_background = COLOR_CONSTANT_WHITESMOKE;
    while (scoreboard_members.length > 0) {
        get_member_with_highest_points().background_color = scoreboard_background;
        temp_list.push(get_member_with_highest_points());
        scoreboard_members.splice(scoreboard_members.indexOf(get_member_with_highest_points()), 1);
        // Sjekker kva bakgrunnsfarge som har vert no og endrer den, slik at me får annenkvar farge.
        if (scoreboard_background === COLOR_CONSTANT_LIGHTGRAY) {
            scoreboard_background = COLOR_CONSTANT_WHITESMOKE;
        }
        else {
            scoreboard_background = COLOR_CONSTANT_LIGHTGRAY;
        }
    }
    scoreboard_members = temp_list;
    assign_rank();
}

function get_member_with_highest_points() {
    var return_var = scoreboard_members[0];
    for (member of scoreboard_members) {
        if (member.points > return_var.points) {
            return_var = member;
        }
    }
    return return_var;
}

function assign_rank() {
    scoreboard_members[0].ranking = 1;
    for (member of scoreboard_members) {
        try {
            if (member.points === scoreboard_members[scoreboard_members.indexOf(member) - 1].points) {
                member.ranking = scoreboard_members[scoreboard_members.indexOf(member) - 1].ranking
            }
            else {
                member.ranking = scoreboard_members[scoreboard_members.indexOf(member) - 1].ranking + 1;
            }
        }
        catch
        { }
    }
}

//Oppdaterer scoreboard.
function update_scoreboard() {
    scoreboard_table.innerHTML = "<tr style='color: white; font-weight: bold; font-size: 18px; background-color: gray;'> <td>#</td> <td>Navn</td> <td>Poeng</td> </tr>";
    for (member of scoreboard_members) {
        scoreboard_table.innerHTML += member.get_format_element();
    }
}

//Firebase database
var firebaseConfig = {
    apiKey: "AIzaSyDP7Rf6kDQvFrV6FYSRO9WJwmFeZmuNya0",
    authDomain: "eksamen-4fdc5.firebaseapp.com",
    databaseURL: "https://eksamen-4fdc5.firebaseio.com",
    projectId: "eksamen-4fdc5",
    storageBucket: "eksamen-4fdc5.appspot.com",
    messagingSenderId: "683210586847",
    appId: "1:683210586847:web:cede85d78aba8188d7076a"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const databaseQuizMemberReference = database.ref('quiz-members');
//Blir køyrt kvar gong det er ein endring i denne "mappa" i firebase. Legger til nye deltakarar i scoreboard.
databaseQuizMemberReference.on('child_added', function (snapshot) {
    new_scoreboard_member(snapshot.val().name, snapshot.val().points);
})