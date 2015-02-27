/* global window, document, Detector,THREE, requestAnimationFrame, THREEx, Stats*/
/** threejs basics **/
var renderer,
	camera,
	scene,
	light,
	loader,
	controls,
	stats,
	rendererStats;

function eventHandlersRegister(){
	window.addEventListener("resize", function(e){
		console.log("window resize e:");
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;

		try{
			renderer.setSize(newWidth, newHeight);
			camera.aspect = (newWidth / newHeight);
			camera.updateProjectionMatrix();
		}catch(e){
			console.log("window resize error");
			console.log(e);
		}
	});

	/*
	window.addEventListener("click", function(e){
		console.log("window click e:");
		console.log(e);
	});
	*/
}

function init (){

	eventHandlersRegister();

	/** Renderer, create, set params, add to dom**/
	var rendererClearColor = 0x333F47,
		rendererAlpha = 1;

	try{
		renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias:true}) :new THREE.CanvasRenderer();
		renderer.setClearColor(rendererClearColor, rendererAlpha);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}catch(e){
		console.log('cannot create renderer. Error: ');
		console.log(e);
	}



	/** Scene **/
	scene = new THREE.Scene();


	/** Camera settings **/
	var cameraFOV = 45,
		cameraAspect = window.innerWidth/window.innerHeight,
		cameraNear = 0.1,
		cameraFar = 2000;

	camera = new THREE.PerspectiveCamera( cameraFOV, cameraAspect , cameraNear, cameraFar );
	camera.position.set(0,0,6);
	scene.add(camera);


	/* Light */
	var lightColor = 0xffffff,
		lightIntensity = 1,
		lightDistance = 100;

	light = new THREE.PointLight( lightColor, lightIntensity, lightDistance );
	light.position.set(0,0,0);
	scene.add(light);


	/** Get model **/
	var modelUrl = 'http://codepen.io/nickpettit/pen/nqyaK.js';
	loader = new THREE.JSONLoader();

	loader.load(modelUrl, function(geometry){
		var material = new THREE.MeshLambertMaterial({color: 0x55B663});
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	});

	/* Add controls */
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	/** Monitoring **/
	stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	// align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );

	//ThreeX Render stats
	rendererStats = new THREEx.RendererStats();
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.left = '0px';
	rendererStats.domElement.style.bottom   = '0px';
	document.body.appendChild( rendererStats.domElement );

}

function animate(){

	stats.begin();
	/** Black Magic **/
	requestAnimationFrame(animate);

	/** Render the scene **/
	renderer.render(scene, camera);
	controls.update();

	rendererStats.update(renderer);
	stats.end();
}

init();
animate();