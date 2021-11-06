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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
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
    requestAnimationFrame(gameLoop);

    renderer.render(scene, camera);
};


function setupGamefield() {
    gameField = $("#gamefield");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    isSimulationRunning = true;
    gameLoop(); // Start it (Its gonna call itself internally)
});

$("#stop-sim").click(function() {
    cleanGameScene();
    gameLoop(); // Make sure its rendering a black scene
    isSimulationRunning = false; // Stop it
});