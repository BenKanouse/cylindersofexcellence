$( document ).ready(function() {

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(windowWidth(), windowHeight());
  camera = new THREE.PerspectiveCamera(30, windowWidth() / windowHeight(), 2, 1000);
  camera.position.z = Math.min(1.5 * windowHeight(), 1000);

  init();

  var projector = new THREE.Projector();

  window.addEventListener( 'resize', onWindowResize, false );

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

  function addCylinders(scene, siloSiding, siloRoof) {
    var statData = stats();
    var cylinderWidth = windowWidth() / 7;
    var maxLines = statData[0].lines_for_person;
    var scalar = (0.5 * windowHeight() )/maxLines;

    var cylinder1 = createCylinder(cylinderWidth, scalar * statData[0].lines_for_person, -2 * cylinderWidth, siloSiding);
    var cap1 = createCap(cylinderWidth, scalar * statData[0].lines_for_person, -2 * cylinderWidth, siloRoof);
    var top1 = createTop(cylinderWidth, scalar * statData[0].lines_for_person, -2 * cylinderWidth, siloRoof);

    var cylinder2 = createCylinder(cylinderWidth, scalar * statData[1].lines_for_person, -1 * cylinderWidth, siloSiding);
    var cap2 = createCap(cylinderWidth, scalar * statData[1].lines_for_person, -1 * cylinderWidth, siloRoof);
    var top2 = createTop(cylinderWidth, scalar * statData[1].lines_for_person, -1 * cylinderWidth, siloRoof);

    var cylinder3 = createCylinder(cylinderWidth, scalar * statData[2].lines_for_person, 0, siloSiding);
    var cap3 = createCap(cylinderWidth, scalar * statData[2].lines_for_person, 0, siloRoof);
    var top3 = createTop(cylinderWidth, scalar * statData[2].lines_for_person, 0, siloRoof);

    var cylinder4 = createCylinder(cylinderWidth, scalar * statData[3].lines_for_person, 1 * cylinderWidth, siloSiding);
    var cap4 = createCap(cylinderWidth, scalar * statData[3].lines_for_person, 1 * cylinderWidth, siloRoof);
    var top4 = createTop(cylinderWidth, scalar * statData[3].lines_for_person, 1 * cylinderWidth, siloRoof);

    var cylinder5 = createCylinder(cylinderWidth, scalar * statData[4].lines_for_person, 2 * cylinderWidth, siloSiding);
    var cap5 = createCap(cylinderWidth, scalar * statData[4].lines_for_person, 2 * cylinderWidth, siloRoof);
    var top5 = createTop(cylinderWidth, scalar * statData[4].lines_for_person, 2 * cylinderWidth, siloRoof);

    cylinder.overdraw = false;

    scene.add(cylinder1);
    scene.add(cap1);
    scene.add(top1);
    scene.add(cylinder2);
    scene.add(cap2);
    scene.add(top2);
    scene.add(cylinder3);
    scene.add(cap3);
    scene.add(top3);
    scene.add(cylinder4);
    scene.add(cap4);
    scene.add(top4);
    scene.add(cylinder5);
    scene.add(cap5);
    scene.add(top5);
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

    document.getElementById("cylinder").appendChild(renderer.domElement);

    var scene = new THREE.Scene();
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
