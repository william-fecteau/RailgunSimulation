let _gameField = null;
let _two = null;


function main() {
    monke();
    setupGamefield();
    eventInitialisator();
}

function eventInitialisator()
{
    $(window).on('resize', () => {
        console.log("RESIZE");
        var scale = elem.offsetWidth / vuem.two.width;
        vuem.two.scene.scale = scale;
        vuem.two.renderer.setSize(elem.offsetWidth, elem.offsetHeight)
        _two.renderer.trigger( Two.Events.resize, $('#gamefield').width(), $('#gamefield').height());
    })
}

$(function() {
    main();
});


function setupGamefield() {
    _gameField = $("#gamefield");


    // Make an instance of two and place it on the page.
    let elem = document.getElementById('gamefield');
    let params = { width: _gameField.width(), height: _gameField.height() };
    _two = new Two(params).appendTo(elem);

    // two has convenience methods to create shapes.
    let circle = _two.makeCircle(72, 100, 50);
    let rect = _two.makeRectangle(213, 100, 100, 100);

    // The object returned has many stylable properties:
    circle.fill = '#FF8000';
    circle.stroke = 'orangered'; // Accepts all valid css color
    circle.linewidth = 5;

    rect.fill = 'rgb(0, 200, 255)';
    rect.opacity = 0.75;
    rect.noStroke();

    // Don't forget to tell two to render everything
    // to the screen
    _two.update();
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
