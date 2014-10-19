$( document ).ready(function() {

  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(windowWidth(), windowHeight());
  var camera = new THREE.PerspectiveCamera(30, windowWidth() / windowHeight(), 2, 1000);
  camera.position.z = Math.min(1.5 * windowHeight(), 1000);

  var projector = new THREE.Projector();
  var objects = [];

  function cylinderElement() {
    return document.getElementById("cylinder");
  }

  function reRender() {
    renderer.render(scene, camera);
  }

  init();

  cylinderElement().addEventListener('mousemove', onMouseMove, false );
  window.addEventListener('resize', onWindowResize, false );

  currentTextObjects = []

  function unsetCurrentText() {
    currentTextObjects.forEach(function(object) {
      scene.remove(object);
    });
    reRender();
  }

  function createTextObject(text, lineNumber) {
    font = {
      size: 8,
      height: 0,
      weight: 'normal'
    }
    var textMaterial = new THREE.MeshBasicMaterial({color: "#000000"});
    var currentText = new THREE.TextGeometry(text, font);
    var currentMesh = new THREE.Mesh(currentText, textMaterial);
    currentMesh.position.set(100, 100 - (lineNumber * 10), 0.5 * cylinderWidth() + 5);
    currentTextObjects.push(currentMesh);
    scene.add(currentMesh);
    reRender();
  }

  function setCurrentText(metaData) {
    unsetCurrentText();
    createTextObject("It looks like " + metaData.person + " is a knowledge silo!", 1);
    createTextObject("No one else knows " + metaData.file_name + " like they do!", 2);
  }

  function onMouseMove(event) {
    event.preventDefault();
    var vector = new THREE.Vector3(
        ( (event.clientX - renderer.domElement.offsetLeft) / windowWidth() ) * 2 - 1,
      - ( (event.clientY - renderer.domElement.offsetTop + window.pageYOffset) / windowHeight() ) * 2 + 1,
        1
    );
    projector.unprojectVector( vector, camera );

    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = ray.intersectObjects( objects );

    if (intersects.length > 0) {
      var metaData = intersects[0].object.metaData;
      setCurrentText(metaData);

      var element = document.getElementById("person");
      element.innerText = metaData.person;
      var element = document.getElementById("file_name");
      element.innerText = metaData.file_name;
    } else {
      unsetCurrentText();
    }

  }

  function onWindowResize(){

      camera.aspect = windowWidth() / windowHeight();
      camera.updateProjectionMatrix();

      renderer.setSize(windowWidth(), windowHeight());

  }

  function stats() {
    var repoJSON = $("#repo_json").html();
    return $.parseJSON(repoJSON);
  }

  function createCap(siloHeight, x, material) {
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(capHeight(), 0.38 * cylinderWidth(), capHeight(), 30, 10, false), material);
    var capPosition = siloHeight + (0.5 * capHeight()) + yOffSet();
    cylinder.position.set(x, capPosition, 0);
    return cylinder
  }

  function createTop(siloHeight, x, material) {
    var topHeight = 0.125 * cylinderWidth();
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3, capHeight(), topHeight, 30, 10, false), material);
    var capPosition = siloHeight + capHeight() + 0.5 * topHeight + yOffSet();
    cylinder.position.set(x, capPosition, 0);
    return cylinder
  }

  function createCylinder(height, x, material) {
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.33 * cylinderWidth(), 0.33 * cylinderWidth(), height, 30, 10, false), material);
    var yPosition = (height / 2) + yOffSet();
    cylinder.position.set(x, yPosition, 0);
    return cylinder
  }

  function yOffSet() {
    return -0.33 * windowHeight()
  }

  function addToScene(object, metaData) {
    scene.add(object);
    object.metaData = metaData;
    objects.push(object);
  }

  function capHeight() {
    return 0.30 * cylinderWidth();
  }

  function cylinderWidth() {
    return windowWidth() / 7;
  }

  function addCylinders(scene, siloSiding, siloRoof) {
    var statData = stats();
    var maxLines = statData[0].lines_for_person;
    var scalar = (0.5 * windowHeight() )/maxLines;

    for (index = 0; index < 5; index++) {
      var metaData = statData[index];
      var siloHeight = scalar * metaData.lines_for_person;
      var xLocation = (index - 2) * cylinderWidth();
      addToScene(createCylinder(siloHeight, xLocation, siloSiding), metaData);
      addToScene(createCap(siloHeight, xLocation, siloRoof), metaData);
      addToScene(createTop(siloHeight, xLocation, siloRoof), metaData);
    }
  }

  function windowHeight() {
    return Math.min((0.75 * window.innerHeight), 499);
  }
  function windowWidth() {
    return Math.min((0.75 * window.innerWidth), 1624);
  }

  function siloSidingMaterial(scene, camera) {
    var texture = THREE.ImageUtils.loadTexture('images/silo.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 12, 3 );
    return new THREE.MeshLambertMaterial({
      map: texture
    });
  }

  function siloRoofMaterial(scene, camera) {
    return new THREE.MeshPhongMaterial();
  }

  function init() {

    cylinderElement().appendChild(renderer.domElement);

    var siloSiding = siloSidingMaterial(scene, camera);
    var siloRoof = siloRoofMaterial(scene, camera);
    addCylinders(scene, siloSiding, siloRoof);

    var backgroundTexture = THREE.ImageUtils.loadTexture( 'images/field.jpg', {}, function() {
      reRender();
    });
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth(), windowHeight(), 1, 1),
        new THREE.MeshLambertMaterial({
          map: backgroundTexture
        }));
    backgroundMesh.material.depthTest = true;
    backgroundMesh.material.depthWrite = true;
    backgroundMesh.position.z = -100;
    scene.add(backgroundMesh);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(500, 500, 800).normalize();
    scene.add(directionalLight);

    scene.add(directionalLight);
  }
});
