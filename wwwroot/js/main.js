let gameField = null; // Element containing the renderer
let isSimulationRunning = false; // This lets us control if the game loop is gonna call itself

// Three.js objects
let scene = null; 
let camera = null; 
let renderer = null; 

// Dummy cube
let cube = null; 

function main() {
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
function update() {
    cube.position.x += 1;
}


function gameLoop() {
    if (!isSimulationRunning) return;

    // Scaling camera in case the window size changes
    if (renderer.width !== innerWidth || renderer.height !== innerHeight) {
        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth/innerHeight;
        camera.updateProjectionMatrix();
    }

    update();
    
    renderer.render(scene, camera);

    requestAnimationFrame(gameLoop);
};


function setupGamefield() {
    gameField = $("#gamefield");

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1, 1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    gameField.append(renderer.domElement);
}

function cleanGameScene() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}



/*
======================================
                AJAX
======================================
 */
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






/*
======================================
                EVENTS
======================================
 */
$("#start-sim").click(function() {
    // Creating dummy cube
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(100, 100, 0);
    scene.add(cube);

    isSimulationRunning = true;
    gameLoop(); // Start it (Its gonna call itself internally)
});

$("#stop-sim").click(function() {
    cleanGameScene();
    gameLoop(); // Make sure its rendering a black scene
    isSimulationRunning = false; // Stop it
});

$("#test").click(function() {
    camera.translateX(10);
});