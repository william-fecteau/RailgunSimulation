/*global THREE, $ */
/*jshint sub:true*/
/*jshint unused:false*/
const METER_FACTOR = 2;
const FPS = 10;
const cameraOffset = new THREE.Vector3(-100, 0, 0);

let gameField = null; // Element containing the renderer
let isSimulationRunning = false; // This lets us control if the game loop is gonna call itself
let frameCounter = 0;
let waitingForBgLoad = false;

// Simulation data
let curSimData = null; // Simulation data calculated by the backend
let curStep = 0; // Current simulation step reached relative to the fixed time stamp
let xStep = 0;
let yStep = 0;
let timeStep = 0;
let cannonLength = 0;
let cannonAngle = 0;
let score = 0;

// Three.js objects
let scene = null; 
let camera = null; 
let renderer = null; 
let projectile = null;  // Projectile object
let cannon = null;
let background = null;
let ground = null;

/*
======================================
            THREE.JS STUFF
======================================
 */
function setupGamefield() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-10, gameField.width(), gameField.height(), -10, -1, 1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameField.width(), gameField.height());
    gameField.append(renderer.domElement); 

    initScene();
}

function initScene() {    
    // Creating ground
    const geometryGround = new THREE.PlaneGeometry(1000000000, 5 * METER_FACTOR);
    const materialGround = new THREE.MeshBasicMaterial( { color: "#FFD966" } );
    ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.set(0, -10, 0);
    scene.add(ground);   

    // Creating cannon with default values
    const geometryCannon = new THREE.PlaneGeometry(50 * METER_FACTOR, 10);
    const materialCannon = new THREE.MeshBasicMaterial( { color: 0x808080 } );
    cannon = new THREE.Mesh(geometryCannon, materialCannon);
    rotateCannon(45);
    scene.add(cannon);

    // set bg + render once
    setBg('/Images/foreground-mercury.png', '/Images/skybox-mercury.png',
            () => {renderer.render(scene, camera);}
        );
}

function setBg (urlBgTexture, urlSkybox, callback)
{
    if (isSimulationRunning) return;
    new THREE.TextureLoader().load(urlBgTexture, function (bgTexture) {
        new THREE.TextureLoader().load(urlSkybox, function (skybox) {
            let geoBg = new THREE.PlaneGeometry(bgTexture.image.width*100, bgTexture.image.height);
            bgTexture.magFilter = THREE.LinearFilter;
            bgTexture.wrapS = THREE.RepeatWrapping;
            bgTexture.repeat.set(100,1);
            const matBg = new THREE.MeshBasicMaterial( { map: bgTexture, transparent: true} );
            scene.remove(background);
            background = new THREE.Mesh(geoBg, matBg);
            background.position.set(-50, bgTexture.image.height /2, 0);
            scene.add(background);
            scene.background = skybox;
            
            // Draw only one frame to get the cannon and the ground
            renderer.render(scene, camera);
            waitingForBgLoad = false;

            if(callback){
                callback();
            }
        });
    });

    // Draw only one frame to get the cannon and the ground
    renderer.render(scene, camera);
}

function startSimulation() {
    if (isSimulationRunning) return;
    if(waitingForBgLoad){
        changePlanet();
    }
    if (curSimData === null || curSimData.length === 0) return;

    camera.position.set(0, 0, 0);

    //test d'un projectile créé avec une image
    // projectile = LoadTexture('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', 200, 200);
    //test d'un projectile créé avec une image

    // Creating projectile
    const geometry = new THREE.PlaneGeometry(20 * METER_FACTOR, 20 * METER_FACTOR);
    new THREE.TextureLoader().load("/Images/monke.png", (monke) => {
        const material = new THREE.MeshBasicMaterial( { map: monke, transparent: true} );
        projectile = new THREE.Mesh(geometry, material);
        projectile.position.set(0, 0, 0);
        scene.add(projectile);
        curStep = 0;
        frameCounter = 0;
        isSimulationRunning = true;
        gameLoop(); // Start it (Its gonna call itself internally)
    });

}

function changePlanet() {
    if (isSimulationRunning) {
        waitingForBgLoad = true;
    }
    let planet = {
        earth: ["Images/foreground-earth.png", "Images/skybox-earth.png"],
        mercury: ["Images/foreground-mercury.png", "Images/skybox-mercury.png"],
        moon: ["Images/foreground-moon.png", "Images/skybox-moon.png"],
        jupiter: ["Images/foreground-jupiter.png", "Images/skybox-jupiter.png"],
        sun: ["Images/foreground-sun.png", "Images/skybox-sun.png"],
        titan: ["Images/foreground-titan.png", "Images/skybox-titan.png"]
    };
    setBg(
        planet[$("#planet option:selected").text()][0], 
        planet[$("#planet option:selected").text()][1]
        );
}


function stopSimulation() {
    if (projectile !== null) scene.remove(projectile);
    projectile = null;
    isSimulationRunning = false; // Stop it, get some help

    updateCannonLength(cannonLength);
    rotateCannon(cannonAngle);

    // Draw only one frame to get the cannon and the ground
    renderer.render(scene, camera);
    if(waitingForBgLoad){
        changePlanet();
    }
}

function gameLoop() {
    if (!isSimulationRunning) return;

    // Scaling camera in case the window size changes
    if (renderer.width !== gameField.width() || renderer.height !== gameField.height()) {
        renderer.setSize(gameField.width(), gameField.height());
    }

    update();
    
    renderer.render(scene, camera);

    requestAnimationFrame(gameLoop);
}

function update() {
    if (projectile === null) return;

    // Every second, update position
    if (frameCounter % FPS === 0) {
        curStep++;

        // If no more data, stop the simulation
        if (curStep >= curSimData.length) {
            isSimulationRunning = false;
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
        if (nextStepData !== null) {
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

    if (projectile.position.y > (gameField.height() / 2)) {
        camera.translateY(yStep);
        if (camera.position.y < -10) camera.position.y = -10;
    }
    if (projectile.position.x >= (gameField.width() / 2)) {
        camera.translateX(xStep);
    }

    $("#cur-pos").text("Current position : (" + Math.round(projectile.position.x, 2) + "," + Math.round(projectile.position.y, 2) + ")");

    projectile.position.x += xStep;
    projectile.position.y += yStep;
    projectile.rotation.z = projectile.rotation.z + 0.1;

    frameCounter++;
}

function MoveCamera(x, y) {
    camera.position.set(x, y, camera.position.z);
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

function rotateCannon(angle) {
    cannonAngle = angle;
    
    if (!isSimulationRunning) {
        // Draw only one frame to get the cannon and the ground
        cannon.rotation.set(0, 0, 2*Math.PI*angle/360);
        renderer.render(scene, camera);
    }
}

function updateCannonLength(length) {
    if (length !== 0) {
        scene.remove(cannon);
        cannon = null;

        cannonLength = length;
        // Re-creating cannon with good lenght
        const geometryCannon = new THREE.PlaneGeometry(length * METER_FACTOR, 10);
        const materialCannon = new THREE.MeshBasicMaterial( { color: 0x808080 } );
        cannon = new THREE.Mesh(geometryCannon, materialCannon);
        rotateCannon(cannonAngle);
        scene.add(cannon);

        renderer.render(scene, camera);
    }
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
        url: document.location.href  + "ajaxRunSimulation",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(e) {
        curSimData = e["data"];
        if (curSimData === null || curSimData.length === 0) return; // Add something client side to show that it exploded
    
        let lastPoint = curSimData[curSimData.length - 1];
        score = lastPoint[0];
        $("#sim-score").text("This simulation score : " + score + " m");

        cannonLength = parseFloat(params["length"]);
        cannonAngle = parseFloat(params["angle"]);
        startSimulation();
    }).fail(function(e) {
        console.log(e);
    });
}

$("#stop-sim").click(function() {
    stopSimulation();
});

/*
$(document).keydown(function(event) {
    var key = (event.keyCode ? event.keyCode : event.which);
    const factor = 5;


    if (key == 87) {
        //UP
        camera.translateY(factor * METER_FACTOR);
    }
    if (key == 65) {
        //LEFT
        camera.translateX(-factor * METER_FACTOR);
    }
    if (key == 83) {
        //DOWN
        camera.translateY(-factor * METER_FACTOR);
    }
    if (key == 68) {
        //RIGHT
        camera.translateX(factor * METER_FACTOR);
    }
});
*/

function main() {
    gameField = $("#gamefield");
    setupGamefield();
}

$(function() {
    main();
});