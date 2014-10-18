$( document ).ready(function() {

  init();

  function createCylinder(width, height, x) {
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(width/3, width/3, height, 30, 1, false), new THREE.MeshPhongMaterial({
      // light
      specular: '#a9fcff',
      // intermediate
      color: '#00abb1',
      // dark
      emissive: '#006063',
      shininess: 100
    }));
    cylinder.position.set(x, ( height / 2) - 150, 0);
    return cylinder
  }

  function addCylinders(scene) {
    var cylinderWidth = windowWidth() / 10;
    console.log("Window width: " + windowWidth());
    console.log("Cylinder width: " + cylinderWidth);
    var cylinder1 = createCylinder(cylinderWidth, 20, -2 * cylinderWidth);
    var cylinder2 = createCylinder(cylinderWidth, 100, -cylinderWidth);
    var cylinder3 = createCylinder(cylinderWidth, 75, 0);
    var cylinder4 = createCylinder(cylinderWidth, 250, cylinderWidth);
    var cylinder5 = createCylinder(cylinderWidth, 160, 2 * cylinderWidth);

    cylinder.overdraw = false;
    scene.add(cylinder1);
    scene.add(cylinder2);
    scene.add(cylinder3);
    scene.add(cylinder4);
    scene.add(cylinder5);
  }

  function windowWidth() {
    return window.innerWidth - (window.innerWidth / 10);
  }

  function init() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth(), window.innerHeight);

    document.getElementById("cylinder").appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(30, windowWidth() / window.innerHeight, 2, 1000);
    camera.position.z = 700;

    var scene = new THREE.Scene();
    addCylinders(scene);


    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();

    scene.add(directionalLight);
    renderer.render(scene, camera);
  }
});
