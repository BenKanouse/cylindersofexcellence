$( document ).ready(function() {

  init();

  function stats() {
    var repoJSON = $("#repo_json").html();
    return $.parseJSON(repoJSON);
  }

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
    var statData = stats();
    var cylinderWidth = windowWidth() / 10;
    console.log("Window width: " + windowWidth());
    console.log("Cylinder width: " + cylinderWidth);
    var maxLines = statData[0].lines_for_person;
    var scalar = 300/maxLines;
    var cylinder1 = createCylinder(cylinderWidth, scalar * statData[0].lines_for_person, -2 * cylinderWidth);
    console.log(statData[0].file_name);
    console.log(statData[0].person);
    var cylinder2 = createCylinder(cylinderWidth, scalar * statData[1].lines_for_person, -cylinderWidth);
    console.log(statData[1].file_name);
    console.log(statData[0].person);
    var cylinder3 = createCylinder(cylinderWidth, scalar * statData[2].lines_for_person, 0);
    var cylinder4 = createCylinder(cylinderWidth, scalar * statData[3].lines_for_person, cylinderWidth);
    var cylinder5 = createCylinder(cylinderWidth, scalar * statData[4].lines_for_person, 2 * cylinderWidth);

    cylinder.overdraw = false;
    scene.add(cylinder1);
    scene.add(cylinder2);
    scene.add(cylinder3);
    scene.add(cylinder4);
    scene.add(cylinder5);
  }

  function windowWidth() {
    return(window.innerWidth - (window.innerWidth / 8));
  }

  function init() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth(), window.innerHeight);

    document.getElementById("cylinder").appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(30, windowWidth() / window.innerHeight, 2, 1000);
    camera.position.z = 900;

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
