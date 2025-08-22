
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        
        // Change the menu icon to close icon when menu is open
        if (mobileNav.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light</span>';
        mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
    }
    
    // Desktop theme toggle
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Mobile theme toggle
    mobileThemeToggle.addEventListener('click', () => {
        toggleTheme();
        mobileNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
    
    function toggleTheme() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark</span>';
            mobileThemeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light</span>';
            mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
            localStorage.setItem('theme', 'dark');
        }
        
        // Update Three.js scene background based on theme
        if (scene) {
            const isDark = body.getAttribute('data-theme') === 'dark';
            scene.background = new THREE.Color(isDark ? 0x121212 : 0xf5f5f5);
        }
    }
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target page
            const targetPage = link.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            link.classList.add('active');
            
            // Update mobile nav active state
            const mobileNavLink = mobileNav.querySelector(`[data-page="${targetPage}"]`);
            if (mobileNavLink) {
                mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                mobileNavLink.classList.add('active');
            }
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`${targetPage}-page`).classList.add('active');
            
            // Load configurations if navigating to configs page
            if (targetPage === 'configs') {
                loadConfigurations();
            }
            
            // Load community posts if navigating to community page
            if (targetPage === 'community') {
                loadCommunityPosts();
            }
            
            // Show notification
            const pageNames = {
                'home': 'Home',
                'models': 'Models',
                'configs': 'My Configurations',
                'community': 'Community',
                'dealers': 'Dealers'
            };
            showNotification(`Navigated to ${pageNames[targetPage]}`);
        });
    });
    
    // Customize buttons functionality
    const customizeButtons = document.querySelectorAll('.customize-btn');
    customizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modelType = button.getAttribute('data-model');
            
            // Update active nav link to Home
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector('.nav-link[data-page="home"]').classList.add('active');
            
            // Update mobile nav active state
            mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            mobileNav.querySelector('a[data-page="home"]').classList.add('active');
            
            // Show Home page
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('home-page').classList.add('active');
            
            // Update car model based on selection
            updateCarModel(modelType);
            
            // Show notification
            showNotification(`Customizing ${modelType.charAt(0).toUpperCase() + modelType.slice(1)} model`);
        });
    });
    
    // Initialize Three.js scene
    let scene, camera, renderer, car, controls;
    let carBody, carRoof, carWindows, carHood, carTrunk, wheels = [];
    let headlights = [], taillights = [];
    let currentColor = '#e53935';
    let currentFinish = 'glossy';
    let currentWheel = 'sport';
    let interiorColor = '#212121';
    let interiorMaterial = 'leather';
    let trimMaterial = 'wood';
    let wireframeMode = false;
    let ledHeadlights = true;
    let ledTaillights = true;
    let ambientLighting = false;
    let spoiler = false;
    let roofRack = false;
    let sideSkirts = false;
    let frontLip = false;
    let currentEngine = 'i4';
    let currentExhaust = 'standard';
    let currentSuspension = 'comfort';
    let currentTransmission = 'manual';
    let currentBrakes = 'standard';
    let currentDriveMode = 'comfort';
    let currentModelType = 'sports'; // Default model type
    
    // Performance metrics
    const performanceMetrics = {
        i4: { acceleration: '4.8s', topSpeed: '155 mph', horsepower: '255 HP', torque: '295 lb-ft' },
        v6: { acceleration: '4.2s', topSpeed: '165 mph', horsepower: '335 HP', torque: '369 lb-ft' },
        v8: { acceleration: '3.5s', topSpeed: '180 mph', horsepower: '472 HP', torque: '439 lb-ft' },
        hybrid: { acceleration: '4.0s', topSpeed: '160 mph', horsepower: '362 HP', torque: '516 lb-ft' }
    };
    
    // Predefined community configurations
    const communityConfigurations = [
        {
            id: 'community-1',
            name: 'Midnight Racer',
            description: 'A sleek black sports car with performance upgrades',
            author: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            date: '2 hours ago',
            likes: 124,
            comments: 23,
            // image: '',
            config: {
                modelType: 'sports',
                color: '#000000',
                finish: 'glossy',
                wheel: 'sport',
                interiorColor: '#212121',
                interiorMaterial: 'leather',
                trimMaterial: 'carbon',
                engine: 'v8',
                exhaust: 'performance',
                suspension: 'track',
                transmission: 'dual-clutch',
                brakes: 'ceramic',
                driveMode: 'track',
                ledHeadlights: true,
                ledTaillights: true,
                ambientLighting: true,
                spoiler: true,
                roofRack: false,
                sideSkirts: true,
                frontLip: true
            }
        },
        {
            id: 'community-2',
            name: 'Family Adventure SUV',
            description: 'Perfect for family trips with all the essentials',
            author: 'Sarah Williams',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            date: '1 day ago',
            likes: 89,
            comments: 15,
            // image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            config: {
                modelType: 'suv',
                color: '#1e88e5',
                finish: 'metallic',
                wheel: 'offroad',
                interiorColor: '#f5f5f5',
                interiorMaterial: 'fabric',
                trimMaterial: 'wood',
                engine: 'v6',
                exhaust: 'standard',
                suspension: 'comfort',
                transmission: 'automatic',
                brakes: 'standard',
                driveMode: 'comfort',
                ledHeadlights: true,
                ledTaillights: true,
                ambientLighting: false,
                spoiler: false,
                roofRack: true,
                sideSkirts: false,
                frontLip: false
            }
        },
        {
            id: 'community-3',
            name: 'Eco-Friendly Commuter',
            description: 'Electric car with solar roof for extra range',
            author: 'Michael Chen',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
            date: '3 days ago',
            likes: 156,
            comments: 42,
            // image: 'https://images.unsplash.com/photo-1619452821096-0dc0b4a2d8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            config: {
                modelType: 'electric',
                color: '#43a047',
                finish: 'pearl',
                wheel: 'luxury',
                interiorColor: '#f5f5f5',
                interiorMaterial: 'alcantara',
                trimMaterial: 'aluminum',
                engine: 'hybrid',
                exhaust: 'standard',
                suspension: 'adaptive',
                transmission: 'automatic',
                brakes: 'sport',
                driveMode: 'eco',
                ledHeadlights: true,
                ledTaillights: true,
                ambientLighting: true,
                spoiler: false,
                roofRack: true,
                sideSkirts: false,
                frontLip: false
            }
        },
        
        
    ];
    
    function init() {
        // Create scene
        scene = new THREE.Scene();
        // Set initial background based on current theme
        const isDark = body.getAttribute('data-theme') === 'dark';
        scene.background = new THREE.Color(isDark ? 0x121212 : 0xf5f5f5);
        
        // Create camera
        const viewportContainer = document.getElementById('canvas-container');
        const aspectRatio = viewportContainer.clientWidth / viewportContainer.clientHeight;
        camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        camera.position.set(5, 2, 5);
        camera.lookAt(0, 0, 0);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(viewportContainer.clientWidth, viewportContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType && renderer.xr.setReferenceSpaceType('local');
        viewportContainer.appendChild(renderer.domElement);
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 3;
        controls.maxDistance = 10;
        controls.maxPolarAngle = Math.PI / 2;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Add ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: isDark ? 0x1e1e1e : 0xe0e0e0,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Create car model
        createCarModel();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start animation using XR-friendly loop
        renderer.setAnimationLoop(render);
        
        // Add VRButton to UI when available
        if (typeof VRButton !== 'undefined') {
            try {
                const vrButton = VRButton.createButton(renderer);
                const arVrContainer = document.querySelector('.ar-vr-container');
                if (arVrContainer && vrButton) arVrContainer.appendChild(vrButton);
            } catch (err) {
                console.warn('VRButton not available:', err);
            }
        }
    }
    
    function createCarModel() {
        // Remove existing car if it exists
        if (car) {
            scene.remove(car);
        }
        
        car = new THREE.Group();
        
        // Car dimensions based on model type
        let carWidth = 2;
        let carHeight = 0.8;
        let carLength = 4;
        let roofWidth = 1.6;
        let roofHeight = 0.6;
        let roofLength = 2;
        let wheelSize = 0.4;
        
        // Adjust dimensions based on model type
        switch(currentModelType) {
            case 'sports':
                carHeight = 0.7;
                roofHeight = 0.5;
                wheelSize = 0.45;
                break;
            case 'suv':
                carHeight = 1.0;
                roofHeight = 0.8;
                wheelSize = 0.5;
                break;
            case 'sedan':
                carLength = 4.5;
                roofLength = 2.5;
                break;
            case 'convertible':
                roofHeight = 0.3;
                break;
            case 'electric':
                carHeight = 0.75;
                break;
            case 'luxury':
                carLength = 4.8;
                roofWidth = 1.7;
                break;
        }
        
        // Car body (main part)
        const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
        const bodyMaterial = createCarMaterial(currentColor, currentFinish);
        carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        carBody.position.y = carHeight / 2;
        carBody.castShadow = true;
        carBody.receiveShadow = true;
        car.add(carBody);
        
        // Car roof (skip for convertible)
        if (currentModelType !== 'convertible') {
            const roofGeometry = new THREE.BoxGeometry(roofWidth, roofHeight, roofLength);
            const roofMaterial = createCarMaterial(currentColor, currentFinish);
            carRoof = new THREE.Mesh(roofGeometry, roofMaterial);
            carRoof.position.y = carHeight + roofHeight / 2;
            carRoof.position.z = -carLength / 4;
            carRoof.castShadow = true;
            carRoof.receiveShadow = true;
            car.add(carRoof);
        }
        
        // Car hood
        const hoodGeometry = new THREE.BoxGeometry(roofWidth, carHeight / 3, carLength / 4);
        const hoodMaterial = createCarMaterial(currentColor, currentFinish);
        carHood = new THREE.Mesh(hoodGeometry, hoodMaterial);
        carHood.position.y = carHeight + carHeight / 6;
        carHood.position.z = carLength / 2 - carLength / 8;
        carHood.castShadow = true;
        carHood.receiveShadow = true;
        car.add(carHood);
        
        // Car trunk
        const trunkGeometry = new THREE.BoxGeometry(roofWidth, carHeight / 3, carLength / 6);
        const trunkMaterial = createCarMaterial(currentColor, currentFinish);
        carTrunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        carTrunk.position.y = carHeight + carHeight / 6;
        carTrunk.position.z = -carLength / 2 + carLength / 12;
        carTrunk.castShadow = true;
        carTrunk.receiveShadow = true;
        car.add(carTrunk);
        
        // Car windows (skip for convertible)
        if (currentModelType !== 'convertible') {
            const windowGeometry = new THREE.BoxGeometry(roofWidth - 0.2, roofHeight * 0.7, roofLength - 0.2);
            const windowMaterial = new THREE.MeshPhysicalMaterial({ 
                color: 0x88ccff,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.9,
                transparent: true
            });
            carWindows = new THREE.Mesh(windowGeometry, windowMaterial);
            carWindows.position.y = carHeight + roofHeight / 2;
            carWindows.position.z = -carLength / 4;
            car.add(carWindows);
        }
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(wheelSize, wheelSize, 0.3, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.7,
            metalness: 0.3
        });
        
        // Front left wheel
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.position.set(-carWidth / 2 - 0.1, wheelSize, carLength / 3);
        wheelFL.castShadow = true;
        wheelFL.receiveShadow = true;
        car.add(wheelFL);
        wheels.push(wheelFL);
        
        // Front right wheel
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.position.set(carWidth / 2 + 0.1, wheelSize, carLength / 3);
        wheelFR.castShadow = true;
        wheelFR.receiveShadow = true;
        car.add(wheelFR);
        wheels.push(wheelFR);
        
        // Rear left wheel
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.position.set(-carWidth / 2 - 0.1, wheelSize, -carLength / 3);
        wheelRL.castShadow = true;
        wheelRL.receiveShadow = true;
        car.add(wheelRL);
        wheels.push(wheelRL);
        
        // Rear right wheel
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.position.set(carWidth / 2 + 0.1, wheelSize, -carLength / 3);
        wheelRR.castShadow = true;
        wheelRR.receiveShadow = true;
        car.add(wheelRR);
        wheels.push(wheelRR);
        
        // Headlights
        const headlightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightL.position.set(-carWidth / 3, carHeight / 2, carLength / 2 + 0.05);
        car.add(headlightL);
        headlights.push(headlightL);
        
        const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightR.position.set(carWidth / 3, carHeight / 2, carLength / 2 + 0.05);
        car.add(headlightR);
        headlights.push(headlightR);
        
        // Taillights
        const taillightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const taillightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        
        const taillightL = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillightL.position.set(-carWidth / 3, carHeight / 2, -carLength / 2 - 0.05);
        car.add(taillightL);
        taillights.push(taillightL);
        
        const taillightR = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillightR.position.set(carWidth / 3, carHeight / 2, -carLength / 2 - 0.05);
        car.add(taillightR);
        taillights.push(taillightR);
        
        // Grille
        const grilleGeometry = new THREE.BoxGeometry(carWidth / 2, carHeight / 3, 0.1);
        const grilleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.7,
            metalness: 0.3
        });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(0, carHeight / 2, carLength / 2 + 0.05);
        car.add(grille);
        
        // Side mirrors
        const mirrorGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.1);
        const mirrorMaterial = createCarMaterial(currentColor, currentFinish);
        
        const mirrorL = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirrorL.position.set(-carWidth / 2 - 0.1, carHeight / 2 + 0.2, carLength / 6);
        car.add(mirrorL);
        
        const mirrorR = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirrorR.position.set(carWidth / 2 + 0.1, carHeight / 2 + 0.2, carLength / 6);
        car.add(mirrorR);
        
        scene.add(car);
    }
    
    function updateCarModel(modelType) {
        currentModelType = modelType;
        createCarModel();
    }
    
    function createCarMaterial(color, finish) {
        let materialProps = {
            color: color,
            roughness: 0.5,
            metalness: 0.5
        };
        
        switch(finish) {
            case 'glossy':
                materialProps.roughness = 0.1;
                materialProps.metalness = 0.7;
                materialProps.clearcoat = 1.0;
                materialProps.clearcoatRoughness = 0.1;
                break;
            case 'metallic':
                materialProps.roughness = 0.2;
                materialProps.metalness = 1.0;
                materialProps.clearcoat = 0.5;
                materialProps.clearcoatRoughness = 0.1;
                break;
            case 'matte':
                materialProps.roughness = 0.9;
                materialProps.metalness = 0.1;
                break;
            case 'pearl':
                materialProps.roughness = 0.2;
                materialProps.metalness = 0.3;
                materialProps.clearcoat = 1.0;
                materialProps.clearcoatRoughness = 0.1;
                materialProps.sheen = 1.0;
                materialProps.sheenColor = new THREE.Color(0xffffff);
                materialProps.sheenRoughness = 0.25;
                break;
        }
        
        return new THREE.MeshPhysicalMaterial(materialProps);
    }
    
    function updateCarColor() {
        if (!carBody) return;
        
        const newMaterial = createCarMaterial(currentColor, currentFinish);
        carBody.material = newMaterial;
        if (carRoof) carRoof.material = newMaterial;
        carHood.material = newMaterial;
        carTrunk.material = newMaterial;
        
        // Update side mirrors
        car.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'BoxGeometry' && 
                (child.position.x < -1 || child.position.x > 1) && 
                child.position.y > 0.6) {
                child.material = newMaterial;
            }
        });
    }
    
    function updateWheels() {
        if (wheels.length === 0) return;
        
        let wheelColor = 0x333333;
        let wheelRoughness = 0.7;
        let wheelMetalness = 0.3;
        
        switch(currentWheel) {
            case 'sport':
                wheelColor = 0x333333;
                wheelRoughness = 0.3;
                wheelMetalness = 0.7;
                break;
            case 'luxury':
                wheelColor = 0x888888;
                wheelRoughness = 0.2;
                wheelMetalness = 0.8;
                break;
            case 'offroad':
                wheelColor = 0x222222;
                wheelRoughness = 0.8;
                wheelMetalness = 0.2;
                break;
            case 'classic':
                wheelColor = 0xaaaaaa;
                wheelRoughness = 0.5;
                wheelMetalness = 0.5;
                break;
        }
        
        wheels.forEach(wheel => {
            wheel.material = new THREE.MeshStandardMaterial({ 
                color: wheelColor,
                roughness: wheelRoughness,
                metalness: wheelMetalness
            });
        });
    }
    
    function updateHeadlights() {
        headlights.forEach(light => {
            if (ledHeadlights) {
                light.material.emissiveIntensity = 0.8;
                light.material.color.set(0xffffee);
            } else {
                light.material.emissiveIntensity = 0.3;
                light.material.color.set(0xffcc99);
            }
        });
    }
    
    function updateTaillights() {
        taillights.forEach(light => {
            if (ledTaillights) {
                light.material.emissiveIntensity = 0.5;
                light.material.color.set(0xff0000);
            } else {
                light.material.emissiveIntensity = 0.2;
                light.material.color.set(0xcc0000);
            }
        });
    }
    
    function updatePerformanceMetrics() {
        const metrics = performanceMetrics[currentEngine];
        document.getElementById('acceleration').textContent = metrics.acceleration;
        document.getElementById('top-speed').textContent = metrics.topSpeed;
        document.getElementById('horsepower').textContent = metrics.horsepower;
        document.getElementById('torque').textContent = metrics.torque;
        
        // Update performance chart based on selected options
        updatePerformanceChart();
    }
    
    function updatePerformanceChart() {
        const chartBars = document.querySelectorAll('.chart-bar');
        
        // Calculate performance score based on selections
        let score = 60; // Base score
        
        // Engine impact
        if (currentEngine === 'v6') score += 10;
        else if (currentEngine === 'v8') score += 20;
        else if (currentEngine === 'hybrid') score += 15;
        
        // Exhaust impact
        if (currentExhaust === 'sport') score += 5;
        else if (currentExhaust === 'performance') score += 10;
        
        // Suspension impact
        if (currentSuspension === 'sport') score += 5;
        else if (currentSuspension === 'adaptive') score += 10;
        else if (currentSuspension === 'track') score += 15;
        
        // Transmission impact
        if (currentTransmission === 'automatic') score += 3;
        else if (currentTransmission === 'dual-clutch') score += 8;
        
        // Brakes impact
        if (currentBrakes === 'sport') score += 5;
        else if (currentBrakes === 'performance') score += 10;
        else if (currentBrakes === 'ceramic') score += 15;
        
        // Drive mode impact
        if (currentDriveMode === 'sport') score += 5;
        else if (currentDriveMode === 'track') score += 10;
        
        // Update chart bars with animation
        chartBars[0].style.height = `${Math.min(score, 95)}%`;
        chartBars[1].style.height = `${Math.min(score + 5, 95)}%`;
        chartBars[2].style.height = `${Math.min(score + 10, 95)}%`;
        chartBars[3].style.height = `${Math.min(score - 5, 95)}%`;
        chartBars[4].style.height = `${Math.min(score + 15, 95)}%}`;
        chartBars[5].style.height = `${Math.min(score, 95)}%`;
    }
    
    function addSpoiler() {
        if (!spoiler) {
            const spoilerGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.4);
            const spoilerMaterial = createCarMaterial(currentColor, currentFinish);
            const spoilerMesh = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
            spoilerMesh.position.set(0, 1.3, -2.1);
            spoilerMesh.name = "spoiler";
            car.add(spoilerMesh);
            spoiler = true;
        }
    }
    
    function removeSpoiler() {
        const spoilerMesh = car.getObjectByName("spoiler");
        if (spoilerMesh) {
            car.remove(spoilerMesh);
            spoiler = false;
        }
    }
    
    function addRoofRack() {
        if (!roofRack) {
            const rackGeometry = new THREE.BoxGeometry(1.4, 0.1, 2.2);
            const rackMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.7,
                metalness: 0.3
            });
            const rackMesh = new THREE.Mesh(rackGeometry, rackMaterial);
            rackMesh.position.set(0, 1.4, -0.5);
            rackMesh.name = "roofRack";
            car.add(rackMesh);
            roofRack = true;
        }
    }
    
    function removeRoofRack() {
        const rackMesh = car.getObjectByName("roofRack");
        if (rackMesh) {
            car.remove(rackMesh);
            roofRack = false;
        }
    }
    
    function addSideSkirts() {
        if (!sideSkirts) {
            const skirtGeometry = new THREE.BoxGeometry(0.1, 0.2, 3);
            const skirtMaterial = createCarMaterial(currentColor, currentFinish);
            
            const skirtL = new THREE.Mesh(skirtGeometry, skirtMaterial);
            skirtL.position.set(-1.05, 0.3, 0);
            skirtL.name = "sideSkirtL";
            car.add(skirtL);
            
            const skirtR = new THREE.Mesh(skirtGeometry, skirtMaterial);
            skirtR.position.set(1.05, 0.3, 0);
            skirtR.name = "sideSkirtR";
            car.add(skirtR);
            
            sideSkirts = true;
        }
    }
    
    function removeSideSkirts() {
        const skirtL = car.getObjectByName("sideSkirtL");
        const skirtR = car.getObjectByName("sideSkirtR");
        
        if (skirtL) car.remove(skirtL);
        if (skirtR) car.remove(skirtR);
        
        sideSkirts = false;
    }
    
    function addFrontLip() {
        if (!frontLip) {
            const lipGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.2);
            const lipMaterial = createCarMaterial(currentColor, currentFinish);
            const lipMesh = new THREE.Mesh(lipGeometry, lipMaterial);
            lipMesh.position.set(0, 0.2, 2.1);
            lipMesh.name = "frontLip";
            car.add(lipMesh);
            frontLip = true;
        }
    }
    
    function removeFrontLip() {
        const lipMesh = car.getObjectByName("frontLip");
        if (lipMesh) {
            car.remove(lipMesh);
            frontLip = false;
        }
    }
    
    function onWindowResize() {
        const viewportContainer = document.getElementById('canvas-container');
        camera.aspect = viewportContainer.clientWidth / viewportContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewportContainer.clientWidth, viewportContainer.clientHeight);
    }
    
    // Render function used by setAnimationLoop (works for XR and non-XR)
    function render(time, frame) {
        // update controls only when not in an immersive XR session
        if (!renderer.xr.isPresenting) {
            controls.update();
        } else {
            // When in XR, you may want different updates (e.g., physics or car animations)
            // ...optional XR-specific updates...
        }
        renderer.render(scene, camera);
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification show';
        
        if (type === 'error') {
            notification.classList.add('error');
        } else if (type === 'warning') {
            notification.classList.add('warning');
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Configuration management functions
    function getCurrentConfiguration() {
        return {
            modelType: currentModelType,
            color: currentColor,
            finish: currentFinish,
            wheel: currentWheel,
            interiorColor: interiorColor,
            interiorMaterial: interiorMaterial,
            trimMaterial: trimMaterial,
            engine: currentEngine,
            exhaust: currentExhaust,
            suspension: currentSuspension,
            transmission: currentTransmission,
            brakes: currentBrakes,
            driveMode: currentDriveMode,
            ledHeadlights: ledHeadlights,
            ledTaillights: ledTaillights,
            ambientLighting: ambientLighting,
            spoiler: spoiler,
            roofRack: roofRack,
            sideSkirts: sideSkirts,
            frontLip: frontLip
        };
    }
    
    function applyConfiguration(config) {
        // Update all configuration settings
        currentModelType = config.modelType;
        currentColor = config.color;
        currentFinish = config.finish;
        currentWheel = config.wheel;
        interiorColor = config.interiorColor;
        interiorMaterial = config.interiorMaterial;
        trimMaterial = config.trimMaterial;
        currentEngine = config.engine;
        currentExhaust = config.exhaust;
        currentSuspension = config.suspension;
        currentTransmission = config.transmission;
        currentBrakes = config.brakes;
        currentDriveMode = config.driveMode;
        ledHeadlights = config.ledHeadlights;
        ledTaillights = config.ledTaillights;
        ambientLighting = config.ambientLighting;
        spoiler = config.spoiler;
        roofRack = config.roofRack;
        sideSkirts = config.sideSkirts;
        frontLip = config.frontLip;
        
        // Update UI elements to match configuration
        document.getElementById('color-picker').value = currentColor;
        
        // Update active states for all options
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.classList.remove('active');
            if (preset.getAttribute('data-color') === currentColor) {
                preset.classList.add('active');
            }
        });
        
        document.querySelectorAll('.finish-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-finish') === currentFinish) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('.wheel-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-wheel') === currentWheel) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-engine]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-engine') === currentEngine) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-exhaust]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-exhaust') === currentExhaust) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-suspension]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-suspension') === currentSuspension) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-transmission]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-transmission') === currentTransmission) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-brakes]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-brakes') === currentBrakes) {
                option.classList.add('active');
            }
        });
        
        document.querySelectorAll('[data-mode]').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-mode') === currentDriveMode) {
                option.classList.add('active');
            }
        });
        
        // Update toggle switches
        document.getElementById('headlight-led').checked = ledHeadlights;
        document.getElementById('taillight-led').checked = ledTaillights;
        document.getElementById('ambient-lighting').checked = ambientLighting;
        document.getElementById('spoiler').checked = spoiler;
        document.getElementById('roof-rack').checked = roofRack;
        document.getElementById('side-skirts').checked = sideSkirts;
        document.getElementById('front-lip').checked = frontLip;
        
        // Recreate car model with new settings
        createCarModel();
        updateCarColor();
        updateWheels();
        updateHeadlights();
        updateTaillights();
        updatePerformanceMetrics();
        
        // Add/remove accessories based on configuration
        if (spoiler) addSpoiler();
        if (roofRack) addRoofRack();
        if (sideSkirts) addSideSkirts();
        if (frontLip) addFrontLip();
    }
    
    function saveConfiguration(name, description) {
        // Get current configuration
        const config = getCurrentConfiguration();
        
        // Add metadata
        const configToSave = {
            id: Date.now(),
            name: name,
            description: description,
            date: new Date().toLocaleDateString(),
            config: config
        };
        
        // Get existing configurations
        let configs = JSON.parse(localStorage.getItem('carConfigurations') || '[]');
        
        // Add new configuration
        configs.push(configToSave);
        
        // Save to localStorage
        localStorage.setItem('carConfigurations', JSON.stringify(configs));
        
        showNotification('Configuration saved successfully');
        
        return configToSave.id;
    }
    
    function loadConfigurations() {
        const configsContainer = document.getElementById('configs-container');
        const emptyState = document.getElementById('empty-configs');
        
        // Get configurations from localStorage
        const configs = JSON.parse(localStorage.getItem('carConfigurations') || '[]');
        
        // Clear existing configurations
        configsContainer.innerHTML = '';
        
        if (configs.length === 0) {
            // Show empty state
            emptyState.classList.add('visible');
        } else {
            // Hide empty state
            emptyState.classList.remove('visible');
            
            // Add each configuration to the page
            configs.forEach(config => {
                const configElement = document.createElement('div');
                configElement.className = 'config-item';
                configElement.innerHTML = `
                    <div class="config-info">
                        <h4>${config.name}</h4>
                        <p>Created: ${config.date}</p>
                        ${config.description ? `<p>${config.description}</p>` : ''}
                    </div>
                    <div class="config-actions">
                        <button class="btn-primary btn-small load-config-btn" data-id="${config.id}">Load</button>
                        <button class="btn-secondary btn-small share-config-btn" data-id="${config.id}">Share</button>
                        <button class="btn-secondary btn-small delete-config-btn" data-id="${config.id}">Delete</button>
                    </div>
                `;
                configsContainer.appendChild(configElement);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.load-config-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const configId = parseInt(button.getAttribute('data-id'));
                    loadConfiguration(configId);
                });
            });
            
            document.querySelectorAll('.share-config-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const configId = parseInt(button.getAttribute('data-id'));
                    shareConfiguration(configId);
                });
            });
            
            document.querySelectorAll('.delete-config-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const configId = parseInt(button.getAttribute('data-id'));
                    deleteConfiguration(configId);
                });
            });
        }
    }
    
    function loadConfiguration(configId) {
        // Get configurations from localStorage
        const configs = JSON.parse(localStorage.getItem('carConfigurations') || '[]');
        
        // Find the configuration with the given ID
        const config = configs.find(c => c.id === configId);
        
        if (config) {
            // Apply the configuration
            applyConfiguration(config.config);
            
            // Navigate to home page
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector('.nav-link[data-page="home"]').classList.add('active');
            
            mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            mobileNav.querySelector('a[data-page="home"]').classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('home-page').classList.add('active');
            
            showNotification(`Configuration "${config.name}" loaded`);
        } else {
            showNotification('Configuration not found', 'error');
        }
    }
    
    function loadCommunityConfiguration(configId) {
        // Find the configuration in the community configurations
        const config = communityConfigurations.find(c => c.id === configId);
        
        if (config) {
            // Apply the configuration
            applyConfiguration(config.config);
            
            // Navigate to home page
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector('.nav-link[data-page="home"]').classList.add('active');
            
            mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            mobileNav.querySelector('a[data-page="home"]').classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('home-page').classList.add('active');
            
            showNotification(`Community configuration "${config.name}" loaded`);
        } else {
            showNotification('Configuration not found', 'error');
        }
    }
    
    function shareConfiguration(configId) {
        // Get configurations from localStorage
        const configs = JSON.parse(localStorage.getItem('carConfigurations') || '[]');
        
        // Find the configuration with the given ID
        const config = configs.find(c => c.id === configId);
        
        if (config) {
            // In a real implementation, this would generate a shareable link
            // For now, we'll just show a notification
            showNotification(`Share functionality for "${config.name}" would be implemented here`, 'warning');
        } else {
            showNotification('Configuration not found', 'error');
        }
    }
    
    function deleteConfiguration(configId) {
        if (confirm('Are you sure you want to delete this configuration?')) {
            // Get configurations from localStorage
            let configs = JSON.parse(localStorage.getItem('carConfigurations') || '[]');
            
            // Filter out the configuration with the given ID
            configs = configs.filter(c => c.id !== configId);
            
            // Save back to localStorage
            localStorage.setItem('carConfigurations', JSON.stringify(configs));
            
            // Reload configurations
            loadConfigurations();
            
            showNotification('Configuration deleted');
        }
    }
    
    function loadCommunityPosts() {
        const communityContainer = document.getElementById('community-posts-container');
        
        // Clear existing posts
        communityContainer.innerHTML = '';
        
        // Add each community configuration as a post
        communityConfigurations.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'community-post';
            
            // Create configuration details HTML
            let configDetailsHTML = '';
            if (post.config) {
                configDetailsHTML = `
                    <div class="config-details">
                        <div class="config-detail-item">
                            <span class="config-detail-label">Model:</span>
                            <span class="config-detail-value">${post.config.modelType.charAt(0).toUpperCase() + post.config.modelType.slice(1)}</span>
                        </div>
                        <div class="config-detail-item">
                            <span class="config-detail-label">Color:</span>
                            <span class="config-detail-value" style="display: inline-block; width: 20px; height: 20px; background-color: ${post.config.color}; border-radius: 4px; vertical-align: middle; margin-right: 5px;"></span>
                            <span>${post.config.finish.charAt(0).toUpperCase() + post.config.finish.slice(1)}</span>
                        </div>
                        <div class="config-detail-item">
                            <span class="config-detail-label">Engine:</span>
                            <span class="config-detail-value">${post.config.engine.toUpperCase()}</span>
                        </div>
                        <div class="config-detail-item">
                            <span class="config-detail-label">Wheels:</span>
                            <span class="config-detail-value">${post.config.wheel.charAt(0).toUpperCase() + post.config.wheel.slice(1)}</span>
                        </div>
                    </div>
                `;
            }
            
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.avatar}" alt="User" class="post-avatar">
                    <div class="post-user">
                        <h4>${post.author}</h4>
                        <p>Posted ${post.date}</p>
                    </div>
                </div>
                <div class="post-content">
                    <h3>${post.name}</h3>
                    <p>${post.description}</p>
                    
                    ${configDetailsHTML}
                </div>
                <div class="post-actions">
                    <div class="post-action">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </div>
                    <div class="post-action">
                        <i class="fas fa-comment"></i> ${post.comments}
                    </div>
                    <div class="post-action">
                        <i class="fas fa-share"></i> Share
                    </div>
                    <div class="post-action load-config-action" data-id="${post.id}">
                        <i class="fas fa-download"></i> Load Config
                    </div>
                </div>
            `;
            communityContainer.appendChild(postElement);
        });
        
        // Add event listeners to load config buttons
        document.querySelectorAll('.load-config-action').forEach(button => {
            button.addEventListener('click', () => {
                const configId = button.getAttribute('data-id');
                loadCommunityConfiguration(configId);
            });
        });
    }
    
    // Initialize the 3D scene
    init();
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Color picker functionality
    const colorPresets = document.querySelectorAll('.color-preset');
    const colorPicker = document.getElementById('color-picker');
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.getAttribute('data-color');
            currentColor = color;
            colorPicker.value = color;
            updateCarColor();
            
            // Update active state
            colorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
    
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        updateCarColor();
        
        // Update active state
        colorPresets.forEach(p => p.classList.remove('active'));
    });
    
    // Finish options functionality
    const finishOptions = document.querySelectorAll('.finish-option');
    
    finishOptions.forEach(option => {
        option.addEventListener('click', () => {
            const finish = option.getAttribute('data-finish');
            if (finish) {
                currentFinish = finish;
                updateCarColor();
                
                // Update active state
                document.querySelectorAll('.finish-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Wheel options functionality
    const wheelOptions = document.querySelectorAll('.wheel-option');
    
    wheelOptions.forEach(option => {
        option.addEventListener('click', () => {
            const wheel = option.getAttribute('data-wheel');
            if (wheel) {
                currentWheel = wheel;
                updateWheels();
                
                // Update active state
                wheelOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Interior color options
    const interiorColorPresets = document.querySelectorAll('[data-interior-color]');
    
    interiorColorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.getAttribute('data-interior-color');
            interiorColor = color;
            
            // Update active state
            interiorColorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
    
    // Engine options
    const engineOptions = document.querySelectorAll('[data-engine]');
    
    engineOptions.forEach(option => {
        option.addEventListener('click', () => {
            const engine = option.getAttribute('data-engine');
            if (engine) {
                currentEngine = engine;
                updatePerformanceMetrics();
                
                // Update active state
                engineOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Exhaust options
    const exhaustOptions = document.querySelectorAll('[data-exhaust]');
    
    exhaustOptions.forEach(option => {
        option.addEventListener('click', () => {
            const exhaust = option.getAttribute('data-exhaust');
            if (exhaust) {
                currentExhaust = exhaust;
                updatePerformanceChart();
                
                // Update active state
                exhaustOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Suspension options
    const suspensionOptions = document.querySelectorAll('[data-suspension]');
    
    suspensionOptions.forEach(option => {
        option.addEventListener('click', () => {
            const suspension = option.getAttribute('data-suspension');
            if (suspension) {
                currentSuspension = suspension;
                updatePerformanceChart();
                
                // Update active state
                suspensionOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Transmission options
    const transmissionOptions = document.querySelectorAll('[data-transmission]');
    
    transmissionOptions.forEach(option => {
        option.addEventListener('click', () => {
            const transmission = option.getAttribute('data-transmission');
            if (transmission) {
                currentTransmission = transmission;
                updatePerformanceChart();
                
                // Update active state
                transmissionOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Brakes options
    const brakesOptions = document.querySelectorAll('[data-brakes]');
    
    brakesOptions.forEach(option => {
        option.addEventListener('click', () => {
            const brakes = option.getAttribute('data-brakes');
            if (brakes) {
                currentBrakes = brakes;
                updatePerformanceChart();
                
                // Update active state
                brakesOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Drive mode options
    const driveModeOptions = document.querySelectorAll('[data-mode]');
    
    driveModeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.getAttribute('data-mode');
            if (mode) {
                currentDriveMode = mode;
                updatePerformanceChart();
                
                // Update active state
                driveModeOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            }
        });
    });
    
    // Lighting options
    document.getElementById('headlight-led').addEventListener('change', (e) => {
        ledHeadlights = e.target.checked;
        updateHeadlights();
    });
    
    document.getElementById('taillight-led').addEventListener('change', (e) => {
        ledTaillights = e.target.checked;
        updateTaillights();
    });
    
    document.getElementById('ambient-lighting').addEventListener('change', (e) => {
        ambientLighting = e.target.checked;
        if (ambientLighting) {
            showNotification('Ambient lighting enabled');
        } else {
            showNotification('Ambient lighting disabled');
        }
    });
    
    // Accessories options
    document.getElementById('spoiler').addEventListener('change', (e) => {
        if (e.target.checked) {
            addSpoiler();
            showNotification('Spoiler added');
        } else {
            removeSpoiler();
            showNotification('Spoiler removed');
        }
    });
    
    document.getElementById('roof-rack').addEventListener('change', (e) => {
        if (e.target.checked) {
            addRoofRack();
            showNotification('Roof rack added');
        } else {
            removeRoofRack();
            showNotification('Roof rack removed');
        }
    });
    
    document.getElementById('side-skirts').addEventListener('change', (e) => {
        if (e.target.checked) {
            addSideSkirts();
            showNotification('Side skirts added');
        } else {
            removeSideSkirts();
            showNotification('Side skirts removed');
        }
    });
    
    document.getElementById('front-lip').addEventListener('change', (e) => {
        if (e.target.checked) {
            addFrontLip();
            showNotification('Front lip added');
        } else {
            removeFrontLip();
            showNotification('Front lip removed');
        }
    });
    
    // Viewport controls functionality
    document.getElementById('reset-view').addEventListener('click', () => {
        camera.position.set(5, 2, 5);
        camera.lookAt(0, 0, 0);
        controls.reset();
        showNotification('View reset to default');
    });
    
    document.getElementById('toggle-wireframe').addEventListener('click', () => {
        if (!car) return;
        
        wireframeMode = !wireframeMode;
        car.traverse(function(child) {
            if (child.isMesh) {
                child.material.wireframe = wireframeMode;
            }
        });
        
        if (wireframeMode) {
            showNotification('Wireframe mode enabled');
        } else {
            showNotification('Wireframe mode disabled');
        }
    });
    
    // AR/VR functionality
    document.getElementById('toggle-ar').addEventListener('click', async () => {
        if (!('xr' in navigator)) {
            showNotification('WebXR is not supported in this browser', 'error');
            return;
        }
        const supported = await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);
        if (!supported) {
            showNotification('AR is not supported on this device', 'error');
            return;
        }
        // call the existing initAR function
        initAR();
    });
    
    document.getElementById('toggle-vr').addEventListener('click', async () => {
        if (!('xr' in navigator)) {
            showNotification('WebXR is not supported in this browser', 'error');
            return;
        }
        const supported = await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
        if (!supported) {
            showNotification('VR is not supported on this device', 'error');
            return;
        }
        // Prefer using VRButton for a stable UX; if not used, fallback to initVR
        // Many browsers will present a UI via VRButton; initVR still works as fallback.
        if (typeof VRButton !== 'undefined') {
            // VRButton already added in init(); clicking it is recommended.
            showNotification('Use the VR button (bottom-left) to enter VR, or fallback mode starting...', 'success');
            // also call initVR as fallback
            initVR();
        } else {
            initVR();
        }
    });
    
    // AR Support (improved)
    async function initAR() {
        if (!navigator.xr) {
            showNotification('WebXR not supported', 'error');
            return;
        }
        try {
            // request an AR session (may require a secure context and device support)
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test']
            });
            session.addEventListener('end', () => {
                showNotification('AR session ended', 'warning');
            });
            // set session on renderer (Three.js will handle the XR camera & rendering)
            await renderer.xr.setSession(session);
            showNotification('AR session started');
        } catch (err) {
            console.error('initAR error', err);
            showNotification('Failed to start AR session', 'error');
        }
    }
    
    // VR Support (improved)
    async function initVR() {
        if (!navigator.xr) {
            showNotification('WebXR not supported', 'error');
            return;
        }
        try {
            const session = await navigator.xr.requestSession('immersive-vr');
            session.addEventListener('end', () => {
                showNotification('VR session ended', 'warning');
            });
            await renderer.xr.setSession(session);
            showNotification('VR session started');
        } catch (err) {
            console.error('initVR error', err);
            showNotification('Failed to start VR session', 'error');
        }
    }
    
    // Modal functionality
    const saveConfigModal = document.getElementById('save-config-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelSaveBtn = document.getElementById('cancel-save');
    const confirmSaveBtn = document.getElementById('confirm-save');
    const configNameInput = document.getElementById('config-name');
    const configDescriptionInput = document.getElementById('config-description');
    
    // Open modal when save button is clicked
    document.getElementById('save-config').addEventListener('click', () => {
        saveConfigModal.classList.add('active');
        configNameInput.focus();
    });
    
    // Close modal when close button or cancel button is clicked
    closeModalBtn.addEventListener('click', () => {
        saveConfigModal.classList.remove('active');
    });
    
    cancelSaveBtn.addEventListener('click', () => {
        saveConfigModal.classList.remove('active');
    });
    
    // Close modal when clicking outside of modal content
    saveConfigModal.addEventListener('click', (e) => {
        if (e.target === saveConfigModal) {
            saveConfigModal.classList.remove('active');
        }
    });
    
    // Save configuration when confirm button is clicked
    confirmSaveBtn.addEventListener('click', () => {
        const name = configNameInput.value.trim();
        const description = configDescriptionInput.value.trim();
        
        if (!name) {
            showNotification('Please enter a configuration name', 'error');
            return;
        }
        
        // Save the configuration
        saveConfiguration(name, description);
        
        // Close modal and reset form
        saveConfigModal.classList.remove('active');
        configNameInput.value = '';
        configDescriptionInput.value = '';
    });
    
    // Panel actions functionality
    document.getElementById('reset-config').addEventListener('click', () => {
        // Reset all options to default
        if (confirm('Are you sure you want to reset all customizations?')) {
            location.reload();
        }
    });
    
    document.getElementById('share-config').addEventListener('click', () => {
        // In a real implementation, this would show sharing options
        showNotification('Share functionality would be implemented here', 'warning');
    });
    
    document.getElementById('request-quote').addEventListener('click', () => {
        // In a real implementation, this would show a quote request form
        showNotification('Quote request functionality would be implemented here', 'warning');
    });
    
    // Create new configuration button
    document.getElementById('create-new-config').addEventListener('click', () => {
        // Navigate to home page
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        document.querySelector('.nav-link[data-page="home"]').classList.add('active');
        
        mobileNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        mobileNav.querySelector('a[data-page="home"]').classList.add('active');
        
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('home-page').classList.add('active');
        
        showNotification('Create a new configuration on the Home page');
    });
    
    // Initialize performance metrics
    updatePerformanceMetrics();
});