let PARAMS = {
    //          min,    max,    step    default 
    mass      : [1,     100,    1,      20],
    volume    : [1,     100,    1,      50], 
    length    : [1,     100,    1,      50],
    voltage   : [1,     5,     0.01,   2.5],
    interspace: [0.001, 10,     0.001,  5],
    angle     : [0,     90,     1,      45],
    radius    : [1,   50,      1,      5],
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
    stopSimulation();

    let params = {};
    const formData = new FormData(document.querySelector('form'))
    for (var pair of formData.entries()) {
        params[pair[0]] = pair[1];
    }
    monke(params);
}

function initializeMenu() {
    for (const prop in PARAMS) {
        let div = $('<div>', {id: prop, class:"div-form"});
        div.append( // label
            $(`<label>${prop} :</label>`, {
                for: `${prop}-controler`
            })
        );
        if(PARAMS[prop].constructor == Object) { 
            let select = $('<select>', {
                    class : "range",
                    id: `${prop}-controler`,
                    name: `${prop}`,
                });
            Object.entries(PARAMS[prop]).forEach(obj => {
                select.append(
                    '<option value=' + obj[1] + '>' + obj[0] + '</option>'
                    );
            });
            div.append(select);
        }
        else {
            let range =  // slider
                $('<input>', {
                    class : "range",
                    type: "range",
                    id: `${prop}-controler`,
                    name: `${prop}`,
                    min: PARAMS[prop][0],
                    max: PARAMS[prop][1],
                    step: PARAMS[prop][2],
                    value: PARAMS[prop][3]
                }).on("input", (event) => {
                    updateTextInput(`${prop}-counter`, event.target.value)

                    if (prop == 'angle') rotateCannon(parseFloat($("#angle-counter").val()));
                    if (prop == 'length') updateCannonLength(parseFloat($("#length-counter").val()));
                });
            div.append(range);
            div.append( // counter
                $('<input>', {
                    class : "number-input",
                    type: "text",
                    id: `${prop}-counter`,
                    value: PARAMS[prop][3]
                }).on("input", (event) => {
                    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
                    $(`#${prop}-controler`).val(event.target.value);
                })
            );
        }
        $('#controlers').append(div);
    }
};


function menu() {
    initializeMenu();
}

$(function() {
    menu();
});