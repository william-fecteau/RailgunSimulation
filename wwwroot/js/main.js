const METER_FACTOR = 50;
const TIME_STEP = 0.2;
const FPS = 60;

let gameField = null; // Element containing the renderer
let isSimulationRunning = false; // This lets us control if the game loop is gonna call itself
let curSimData = null; // Simulation data calculated by the backend
let curStep = 0; // Current simulation step reached relative to the fixed time stamp
let frameCounter = 0;
let heightToGround = 0;
let xStep = 0;
let yStep = 0;


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
    camera = new THREE.OrthographicCamera(0, gameField.width(), gameField.height(), -10, -1, 1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameField.width(), gameField.height());
    gameField.append(renderer.domElement);
}

function startSimulation() {
    if (isSimulationRunning) return;
    if (curSimData == null || curSimData.length == 0) return;

    // Creating ground
    const geometryGround = new THREE.PlaneGeometry(100000, 100);
    const materialGround = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.set(0, -10, 0);
    scene.add(ground);

    // Creating projectile
    const geometry = new THREE.PlaneGeometry(1 * METER_FACTOR, 1 * METER_FACTOR);
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    projectile = new THREE.Mesh(geometry, material);

    //test d'un projectile créé avec une image
    // projectile = LoadTexture('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', 200, 200);
    //test d'un projectile créé avec une image

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
        heightToGround = gameField.height();
    }

    if(camera.position.y < heightToGround)
    {
        camera.position.set(projectile);
        camera.updateProjectionMatrix();
    }

    update();
    
    renderer.render(scene, camera);

    requestAnimationFrame(gameLoop);
};

function update() {
    // Every second, update position
    if (frameCounter % FPS == 0) {
        curStep++;

        // If no more data, stop the simulation
        if (curStep >= curSimData.length) {
            stopSimulation();
            return;
        }

        // Checking if there is a next step to plan some interpolation :)
        let stepData = curSimData[curStep];
        let nextStepData = null;
        if (curStep + 1 < curSimData.length) {
            nextStepData = curSimData[curStep + 1];
        }

        let x = stepData[0];
        let y = stepData[1];

        // Linear interpolation between points
        if (nextStepData != null) {
            xStep = ((nextStepData[0] - x) / FPS) * METER_FACTOR;
            yStep = ((nextStepData[1] - y) / FPS) * METER_FACTOR;
        }
        else {
            xStep = 0;
            yStep = 0;
        }

        // Setting exact position to avoid some float weirdness
        projectile.position.set(x * METER_FACTOR, y * METER_FACTOR, 0);
    }

    projectile.position.x += xStep;
    projectile.position.y += yStep;

    frameCounter++;
}

// Map a texture to a plane.
// texture_name : path of the texture
// width : width of the plane
// height : height of the plane
function LoadTexture(texture_name, width, height) {
    // Initialize the loader
    const loader = new THREE.TextureLoader();

    // Load the material
    const material = new THREE.MeshBasicMaterial({map: loader.load(texture_name)});

    // Map the texture
    const geometry = new THREE.PlaneGeometry(width, height);
    const plane = new THREE.Mesh(geometry, material);
    return plane;
}


/*
======================================
                EVENTS
======================================
 */
function monke (params) {
    if (isSimulationRunning) return;

    // Calculating simulation
    $.ajax({
        type: "POST",
        url: document.location.href  + "/ajaxRunSimulation",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(e) {
        curSimData = e["data"];
        if (curSimData == null || curSimData.length == 0) return; // Add something client side to show that it exploded
    
        startSimulation();
    }).fail(function(e) {
        console.log(e);
    });
};

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