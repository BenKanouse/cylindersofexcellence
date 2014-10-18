$( document ).ready(function() {

  init();

  function stats() {
    var repoJSON = $("#repo_json").html();
    return $.parseJSON(repoJSON);
  }

  function material() {
  }
  function createCylinder(width, height, x, material) {
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(width/3, width/3, height, 30, 10, false), material);
    cylinder.position.set(x, ( height / 2) - 175, 0);
    return cylinder
  }

  function addCylinders(scene, material) {
    var statData = stats();
    var cylinderWidth = windowWidth() / 10;
    console.log("Window width: " + windowWidth());
    console.log("Cylinder width: " + cylinderWidth);
    var maxLines = statData[0].lines_for_person;
    var scalar = 300/maxLines;
    var cylinder1 = createCylinder(cylinderWidth, scalar * statData[0].lines_for_person, -2 * cylinderWidth, material);
    console.log(statData[0].file_name);
    console.log(statData[0].person);
    var cylinder2 = createCylinder(cylinderWidth, scalar * statData[1].lines_for_person, -cylinderWidth, material);
    console.log(statData[1].file_name);
    console.log(statData[0].person);
    var cylinder3 = createCylinder(cylinderWidth, scalar * statData[2].lines_for_person, 0, material);
    var cylinder4 = createCylinder(cylinderWidth, scalar * statData[3].lines_for_person, cylinderWidth, material);
    var cylinder5 = createCylinder(cylinderWidth, scalar * statData[4].lines_for_person, 2 * cylinderWidth, material);

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
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(windowWidth(), window.innerHeight);

    document.getElementById("cylinder").appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(30, windowWidth() / window.innerHeight, 2, 1000);
    camera.position.z = 900;

    var scene = new THREE.Scene();
    var texture = THREE.ImageUtils.loadTexture('images/silo.jpg', {}, function() {
      renderer.render(scene, camera);
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 5, 1 );
    //texture.wrapAround = true;
    //texture.offset(0.5);
    var material = new THREE.MeshLambertMaterial({
      map: texture
    });
    addCylinders(scene, material);

  var backgroundTexture = THREE.ImageUtils.loadTexture( 'images/field.jpg', {}, function() {
    renderer.render(scene, camera);
  });
  var backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 0),
      new THREE.MeshLambertMaterial({
          map: backgroundTexture
      }));
  backgroundMesh.position.y = 100;
  backgroundMesh.material.depthTest = false;
  backgroundMesh.material.depthWrite = false;
  scene.add(backgroundMesh);

    // // add subtle ambient lighting
    // var ambientLight = new THREE.AmbientLight(0x222222);
    // scene.add(ambientLight);
    //
    // // directional lighting
    // var directionalLight = new THREE.DirectionalLight(0xffffff);
    // directionalLight.position.set(1, 1, 1).normalize();

      // add subtle ambient lighting
      var ambientLight = new THREE.AmbientLight(0xbbbbbb);
      scene.add(ambientLight);

      // directional lighting
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);


    scene.add(directionalLight);
  }
});
