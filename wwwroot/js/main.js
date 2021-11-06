var gameField = null;


function main() {
    monke();
    setupGamefield();
}

$(function() {
    main();
});


function setupGamefield() {
    gameField = $("#gamefield");


    // Make an instance of two and place it on the page.
    var elem = document.getElementById('gamefield');
    var params = { width: gameField.width(), height: gameField.height() };
    var two = new Two(params).appendTo(elem);

    // two has convenience methods to create shapes.
    var circle = two.makeCircle(72, 100, 50);
    var rect = two.makeRectangle(213, 100, 100, 100);

    // The object returned has many stylable properties:
    circle.fill = '#FF8000';
    circle.stroke = 'orangered'; // Accepts all valid css color
    circle.linewidth = 5;

    rect.fill = 'rgb(0, 200, 255)';
    rect.opacity = 0.75;
    rect.noStroke();

    // Don't forget to tell two to render everything
    // to the screen
    two.update();
}

function monke() {
    $.ajax({
        type: "POST",
        url: document.location.href  + "/ajaxRunSimulation",
        data: JSON.stringify({ "nbPoints": 6 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(e) {
        console.log(e);
    }).fail(function(e) {
        console.log(e);
    });
}
