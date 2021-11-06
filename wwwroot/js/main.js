const METER_FACTOR = 50;

let gameField = null; // Element containing the renderer
let isSimulationRunning = false; // This lets us control if the game loop is gonna call itself
let curSimData = null; // Simulation data calculated by the backend
let curStep = 0; // Current simulation step reached relative to the fixed time stamp
let frameCounter = 0;


// Three.js objects
let scene = null; 
let camera = null; 
let renderer = null; 
let projectile = null;  // Projectile object



function main() {
    gameField = $("#gamefield");
    setupGamefield();
}

$(function() {
    main();
});


/*
======================================
            THREE.JS STUFF
======================================
 */
function setupGamefield() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(0, gameField.width(), gameField.height(), 0, -1, 1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameField.width(), gameField.height());
    gameField.append(renderer.domElement);
}

function startSimulation() {
    if (isSimulationRunning) return;
    if (curSimData == null || curSimData.length == 0) return;

    // Creating projectile
    const geometry = new THREE.PlaneGeometry(1 * METER_FACTOR, 1 * METER_FACTOR);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    projectile = new THREE.Mesh(geometry, material);
    projectile.position.set(1 * METER_FACTOR, 1 * METER_FACTOR, 0);
    scene.add(projectile);
    
    curStep = 0;
    frameCounter = 0;
    isSimulationRunning = true;
    gameLoop(); // Start it (Its gonna call itself internally)
}

function stopSimulation() {
    if (!isSimulationRunning) return;

    while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }

    isSimulationRunning = false; // Stop it, get some help
}

function gameLoop() {
    if (!isSimulationRunning) return;

    // Scaling camera in case the window size changes
    if (renderer.width !== gameField.width() || renderer.height !== gameField.height()) {
        renderer.setSize(gameField.width(), gameField.height());
        camera.aspect = gameField.width()/gameField.height();
        camera.updateProjectionMatrix();
    }

    update();
    
    renderer.render(scene, camera);

    requestAnimationFrame(gameLoop);
};

function update() {
    // Every second, update position
    if (frameCounter % 60 == 0) {
        curStep++;

        // If no more data, stop the simulation
        if (curStep >= curSimData.length) {
            stopSimulation();
            return;
        }

        let stepData = curSimData[curStep];
        let x = stepData[0];
        let y = stepData[1];

        projectile.position.set(x * METER_FACTOR, y * METER_FACTOR, 0);
    }

    frameCounter++;
}


/*
======================================
                EVENTS
======================================
 */
$("#start-sim").click(function() {
    if (isSimulationRunning) return;

    // Calculating simulation
    $.ajax({
        type: "POST",
        url: document.location.href  + "/ajaxRunSimulation",
        data: JSON.stringify({ "nbPoints": 6 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(e) {
        curSimData = e["data"];
        if (curSimData == null || curSimData.length == 0) return; // Add something client side to show that it exploded
    
        startSimulation();
    }).fail(function(e) {
        console.log(e);
    });
});

$("#stop-sim").click(function() {
    stopSimulation();

    // Make one iteration just to get a black screen
    isSimulationRunning = true;
    gameLoop();
    isSimulationRunning = false;
});

$("#test").click(function() {
    camera.translateX(1 * METER_FACTOR);
});