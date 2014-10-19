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

  init();

  cylinderElement().addEventListener( 'mousedown', onDocumentMouseDown, false );
  window.addEventListener( 'resize', onWindowResize, false );

  function onDocumentMouseDown(event) {
    event.preventDefault();
    var twitterBootstrapNavBarMargin = 50;
    var vector = new THREE.Vector3(
        ( (event.clientX - renderer.domElement.offsetLeft) / windowWidth() ) * 2 - 1,
      - ( (event.clientY - renderer.domElement.offsetTop + twitterBootstrapNavBarMargin) / windowHeight() ) * 2 + 1,
        1
    );
    projector.unprojectVector( vector, camera );

    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = ray.intersectObjects( objects );

    if (intersects.length > 0) {
      console.log(intersects[0].object.metaData);
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

  function createCap(width, siloHeight, x, material) {
    var capHeight = 0.30 * width;
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.30 * width, 0.38 * width, capHeight, 30, 10, false), material);
    var capPosition = siloHeight + (0.5 * capHeight) + yOffSet();
    cylinder.position.set(x, capPosition, 0);
    return cylinder
  }

  function createTop(width, siloHeight, x, material) {
    var capHeight = 0.30 * width;
    var topHeight = 0.125 * width;
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3, 0.30 * width, topHeight, 30, 10, false), material);
    var capPosition = siloHeight + capHeight + 0.5 * topHeight + yOffSet();
    cylinder.position.set(x, capPosition, 0);
    return cylinder
  }

  function createCylinder(width, height, x, material) {
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.33 * width, 0.33 * width, height, 30, 10, false), material);
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

  function addCylinders(scene, siloSiding, siloRoof) {
    var statData = stats();
    var cylinderWidth = windowWidth() / 7;
    var maxLines = statData[0].lines_for_person;
    var scalar = (0.5 * windowHeight() )/maxLines;

    for (index = 0; index < 5; index++) {
      var siloHeight = scalar * statData[index].lines_for_person;
      var xLocation = (index - 2) * cylinderWidth;
      addToScene(createCylinder(cylinderWidth, siloHeight, xLocation, siloSiding), "cylinder_" + index);
      addToScene(createCap(cylinderWidth, siloHeight, xLocation, siloRoof), "cap_" + index);
      addToScene(createTop(cylinderWidth, siloHeight, xLocation, siloRoof), "top_" + index);
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
      renderer.render(scene, camera);
    });
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth(), windowHeight(), 0),
        new THREE.MeshLambertMaterial({
          map: backgroundTexture
        }));
    backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;
    scene.add(backgroundMesh);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(500, 500, 800).normalize();
    scene.add(directionalLight);

    scene.add(directionalLight);
  }
});
