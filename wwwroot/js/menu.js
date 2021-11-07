let PARAMS = {
    mass      : [1, 100],
    volume    : [1, 100], 
    length    : [1, 100],
    voltage   : [1, 10000],
    interspace: [0.001, 10],
    angle     : [0,90],
    metals : {
        copper: "0",
        iron: "0",
        gold: "0",
        diamond: "0",
        gorilla: "0",
    }
}


function updateTextInput(id , val) {
    document.getElementById(id).value=val; 
  }

function handleSubmit()
{
    monke({ "nbPoints": 6 });
}

function initializeMenu() {
    for (const prop in PARAMS) {
        if(prop == "metals") break;
        let div = $('<div>', {id: prop, class:"div-form"});
        div.append( // slider
            $(`<label>${prop} :</label>`, {
                for: `${prop}-slider`
            })
        );
        div.append( // slider
            $('<input>', {
                class : "range",
                type: "range",
                id: `${prop}-slider`,
                name: `${prop}`,
                step: PARAMS[prop][0],
                "min": PARAMS[prop][0],
                "max": PARAMS[prop][1]
            }).on("input", (event) => (updateTextInput(`${prop}-counter`, event.target.value)))
        );
        div.append( // counter
            $('<input>', {
                class : "number-input",
                type: "number",
                id: `${prop}-counter`
            })
        );
        $('#send-form').prepend(div);
    }
};

/*
======================================
                EVENTS
======================================
*/



function menu() {
    initializeMenu()
}

$(function() {
    menu();
});