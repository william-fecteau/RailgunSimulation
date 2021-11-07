let PARAMS = {
    mass      : [1, 100],
    volume    : [1, 100], 
    length    : [1, 100],
    voltage   : [1, 10000],
    interspace: [0.001, 10],
    angle     : [0,90],
    metals : {
        copper: (1.6 * (10** -8)),
        iron: (9.7 * (10** -8)),
        lead: (22 * (10** -8)),
        silver: (1.59 * (10** -8)),
        gorilla: 0,
    },
    planet : {
        earth: -9.8,
        mercury: -3.8,
        moon: -1.7,
        jupiter: -25.93,
        sun: -274.1,
        titan: -1.3455
    },
    fluid : {
        air: (1.8 * (10** -5)),
        water: (1 * (10** -3)),
        gazoline: (2.92 * (10** -4)),
        meg: (2.14 * (10** -2))
    }
}


function updateTextInput(id , val) {
    document.getElementById(id).value=val; 
  }

function handleSubmit()
{

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
        $('#send-form').append(div);
    }
    $('#send-form').append( // counter
        $('<input>', {
            class : "btn btn-outline-warning",
            type: "submit",
            value: "Simulate",
            id: `submit-btn`
        })
    );
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