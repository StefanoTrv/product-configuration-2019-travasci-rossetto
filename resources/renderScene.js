var scene, renderer, camera, stats;

//Metal texture (material #1)
// ANISOTROPIC FILTERS LACKING
var diffuseMapMetal = new THREE.TextureLoader().load('./texture/Metal_Bare_se2abbvc_4K_surface_ms/se2abbvc_4K_Diffuse.jpg');
var roughnessMapMetal = new THREE.TextureLoader().load('./texture/Metal_Bare_se2abbvc_4K_surface_ms/se2abbvc_4K_Roughness.jpg');
var specularMapMetal = new THREE.TextureLoader().load('./texture/Metal_Bare_se2abbvc_4K_surface_ms/se2abbvc_4K_Specular.jpg');
var normalMapMetal = new THREE.TextureLoader().load('./texture/Metal_Bare_se2abbvc_4K_surface_ms/se2abbvc_4K_Normal.jpg');
var displacementMapMetal = new THREE.TextureLoader().load('./texture/Metal_Bare_se2abbvc_4K_surface_ms/se2abbvc_4K_Displacement.jpg');

//Wood texture (material #2)
// ANISOTROPIC FILTERS LACKING
var diffuseMapWood = new THREE.TextureLoader().load('./texture/[4K]Wood16/Wood16_col.jpg');
var roughnessMapWood = new THREE.TextureLoader().load('./texture/[4K]Wood16/Wood16_rgh.jpg');
var specularMapWood = new THREE.TextureLoader().load('./texture/[4K]Wood16/Wood16_Specular.jpg');
var normalMapWood = new THREE.TextureLoader().load('./texture/[4K]Wood16/Wood16_nrm.jpg');
var displacementMapWood = new THREE.TextureLoader().load('./texture/[4K]Wood16/Wood16_disp.jpg');

//Plastic texture (material #3)
// ANISOTROPIC FILTERS LACKING
var diffuseMapPlastic = new THREE.TextureLoader().load('./texture/_schbehmp_4K_surface_ms/schbehmp_4K_Diffuse.jpg');
var roughnessMapPlastic = new THREE.TextureLoader().load('./texture/_schbehmp_4K_surface_ms/schbehmp_4K_Roughness.jpg');
var specularMapPlastic = new THREE.TextureLoader().load('./texture/_schbehmp_4K_surface_ms/schbehmp_4K_Specular.jpg');
var normalMapPlastic = new THREE.TextureLoader().load('./texture/_schbehmp_4K_surface_ms/schbehmp_4K_Normal.jpg');
var displacementMapPlastic = new THREE.TextureLoader().load('./texture/_schbehmp_4K_surface_ms/schbehmp_4K_Displacement.jpg');

var uniforms_metal = {
	pointLightPosition:	{ type: "v3", value: new THREE.Vector3() },
	clight:	{ type: "v3", value: new THREE.Vector3( 1.0, 1.0, 1.0 ) },
	roughnessMap: { type: "t", value: roughnessMapMetal },
	diffuseMap: { type: "t", value: diffuseMapMetal },
	specularMap: { type: "t", value: specularMapMetal },
	displacementMap: { type: "t", value: displacementMapMetal },
	normalMap: { type: "t", value: normalMapMetal },
};

var uniforms_wood = {
	pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
	clight:	{ type: "v3", value: new THREE.Vector3( 1.0, 1.0, 1.0 ) },
	roughnessMap: { type: "t", value: roughnessMapWood },
	diffuseMap: { type: "t", value: diffuseMapWood },
	specularMap: { type: "t", value: specularMapWood },
	displacementMap: { type: "t", value: displacementMapWood },
	normalMap: { type: "t", value: normalMapWood },
};

var uniforms_plastic = {
	pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
	clight:	{ type: "v3", value: new THREE.Vector3( 1.0, 1.0, 1.0 ) },
	roughnessMap: { type: "t", value: roughnessMapPlastic },
	diffuseMap: { type: "t", value: diffuseMapPlastic },
	specularMap: { type: "t", value: specularMapPlastic },
	displacementMap: { type: "t", value: displacementMapPlastic },
	normalMap: { type: "t", value: normalMapPlastic },
};

var glassBody=[];

function Start() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, 915 / 500, 0.1, 1000 );
	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true} );
	var controls = new THREE.OrbitControls( camera, document.getElementById("canvas") );

	renderer.setSize( 915, 500 );
	renderer.setClearColor( 0xf0f0f0 );
	camera.position.set( 0, 2, 18 );
				
	var loader = new THREE.CubeTextureLoader();
	loader.setPath( 'images/Standard-Cube-Map/' );

	var textureCube = loader.load( [
		'px.png', 'nx.png',
		'py.png', 'ny.png',
		'pz.png', 'nz.png'
	] );

	scene.background = textureCube;

	vs = document.getElementById("vertex").textContent;
	fs = document.getElementById("fragment").textContent;

	loadObj();
	var lightMesh = new THREE.Mesh( new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
	lightMesh.position.set( -30.0, 31.0, 5 );
	
	uniforms_metal.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
		lightMesh.position.y,
		lightMesh.position.z);
		
	uniforms_wood.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
		lightMesh.position.y,
		lightMesh.position.z);
		
	uniforms_plastic.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,
		lightMesh.position.y,
		lightMesh.position.z);

	scene.add(lightMesh);

				/*stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				document.body.appendChild( stats.domElement );*/

	}

	function loadObj() {
		var loader = new THREE.OBJLoader();
		loader.useIndices = true;
		loader.load(
			"../models/glasses.obj",

			function( object ) {

				glasses = new THREE.Object3D();
				object.traverse( function(child) {
					if( child instanceof THREE.Mesh ) {
						geometry = child.geometry;
						if( geometry == object.children[2].geometry ) {
							// The glasses
							// --- NOTICE: The material isn't final yet ---
							var glassMaterial = new THREE.ShaderMaterial({ uniforms: uniforms_plastic, vertexShader: vs, fragmentShader: fs });
							glassMaterial.vertexTangents = true;
							glassMaterial.needsUpdate = true;
							//console.log(glassMaterial);
							mesh = new THREE.Mesh( geometry, glassMaterial );
							glasses.add(mesh);
						} else if( geometry != object.children[0].geometry ){
							var frameMaterial = new THREE.ShaderMaterial({ uniforms: uniforms_metal, vertexShader: vs, fragmentShader: fs });
							frameMaterial.vertexTangents = true;
							frameMaterial.needsUpdate = true;
							//console.log(frameMaterial);
							mesh = new THREE.Mesh( geometry, frameMaterial );
							glasses.add(mesh)
							glassBody.push(mesh);
						}
					}
				});

				glasses.scale.multiplyScalar( 2 );
				glasses.rotation.y -= 125 * Math.PI/180;
				glasses.position.z=1;
				scene.add( glasses );
			}
		);
	}

function Update() {
	requestAnimationFrame(Update);
	//stats.update();
	renderer.render(scene, camera);
}

function changeGlassesMaterial(n){
	var uniform;
	if(n==1){
		uniform=uniforms_metal;
	}else if(n==2){
		uniform=uniforms_wood;
	}else{
		uniform=uniforms_plastic;
	}
	for(i=0;i<glassBody.length;i++){
		glassBody[i].material=new THREE.ShaderMaterial({ uniforms: uniform, vertexShader: vs, fragmentShader: fs });
	}
}