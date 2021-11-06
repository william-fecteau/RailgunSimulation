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
 
    var circle = two.makeCircle(-70, 0, 50);
    var rect = two.makeRectangle(70, 0, 100, 100);
    circle.fill = '#FF8000';
    rect.fill = 'rgba(0, 200, 255, 0.75)';

    var rrectA = two.makeRoundedRectangle(400, 100, 200, 100, 10);
    rrectA.stroke = 'blue';
    rrectA.lineWidth = 45;
    
    var group = two.makeGroup(circle, rect);
    group.translation.set(two.width / 2, two.height / 2);
    group.scale = 0;
    group.noStroke();

    two.bind('update', function(frameCount) {
        // This code is called everytime two.update() is called.
        // Effectively 60 times per second.
        if (group.scale > 0.9999) {
          group.scale = group.rotation = 0;
        }
        var t = (1 - group.scale) * 0.125;
        group.scale += t;
        group.rotation += t * 4 * Math.PI;
      }).play();  // Finally, start the animation loop
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