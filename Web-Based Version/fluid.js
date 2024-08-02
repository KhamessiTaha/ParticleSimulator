const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
const particles = [];

const particleTypes = {
    sand: { color: '#FFD700', density: 2 },
    water: { color: '#1E90FF', density: 1 },
    fire: { color: '#FF4500', density: 0.5 },
    oil: { color: '#8B4513', density: 0.8 },
    wall: { color: '#808080', density: 10 },
    acid: { color: '#32CD32', density: 1 },
    gas: { color: '#FF6347', density: 0.3 },
    smoke: { color: '#696969', density: 0.4 },
    glass: { color: '#ADD8E6', density: 2.5 },
    steam: { color: '#D3D3D3', density: 0.2 }
};

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = particleTypes[type].color;
        this.density = particleTypes[type].density;
        this.life = this.type === 'fire' ? Math.random() * 100 + 50 : null;
    }

    update() {
        try {
            switch (this.type) {
                case 'sand':
                    this.fallSand();
                    break;
                case 'water':
                case 'oil':
                case 'acid':
                    this.fall();
                    break;
                case 'fire':
                    this.spread();
                    this.burn();
                    this.flicker();
                    this.life -= 1;
                    if (this.life <= 0) {
                        this.extinguish();
                    }
                    break;
                case 'gas':
                case 'smoke':
                    this.rise();
                    break;
            }
        } catch (error) {
            console.error(`Error updating particle at (${this.x}, ${this.y}):`, error);
        }
    }

    fall() {
        if (this.y < height - 1 && (!grid[this.y + 1][this.x] || grid[this.y + 1][this.x].density < this.density)) {
            grid[this.y][this.x] = null;
            this.y += 1;
            grid[this.y][this.x] = this;
        } else {
            this.disperse();
        }
    }

    fallSand() {
        if (this.y < height - 1 && (!grid[this.y + 1][this.x] || grid[this.y + 1][this.x].density < this.density)) {
            grid[this.y][this.x] = null;
            this.y += 1;
            grid[this.y][this.x] = this;
        }
    }

    rise() {
        if (this.y > 0 && (!grid[this.y - 1][this.x] || grid[this.y - 1][this.x].density > this.density)) {
            grid[this.y][this.x] = null;
            this.y -= 1;
            grid[this.y][this.x] = this;
        } else if (this.type === 'smoke') {
            this.disperse();
        }
    }

    disperse() {
        const disperseDirections = this.type === 'smoke' ? [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: -1 }
        ] : [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }
        ];

        for (let dir of disperseDirections) {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const neighbor = grid[newY][newX];
                if (!neighbor || (neighbor && neighbor.density < this.density)) {
                    grid[this.y][this.x] = null;
                    this.x = newX;
                    this.y = newY;
                    grid[this.y][this.x] = this;
                    break;
                }
            }
        }
    }

    spread() {
        const spreadDirections = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];

        for (let dir of spreadDirections) {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const neighbor = grid[newY][newX];
                if (neighbor && (neighbor.type === 'oil' || neighbor.type === 'wood')) {
                    grid[newY][newX] = new Particle(newX, newY, 'fire');
                    particles.push(grid[newY][newX]);
                }
            }
        }
    }

    burn() {
        const burnDirections = [
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 }
        ];

        for (let dir of burnDirections) {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const neighbor = grid[newY][newX];
                if (neighbor) {
                    switch (neighbor.type) {
                        case 'oil':
                            grid[newY][newX] = new Particle(newX, newY, 'fire');
                            particles.push(grid[newY][newX]);
                            break;
                        case 'sand':
                            grid[newY][newX] = new Particle(newX, newY, 'glass');
                            particles.push(grid[newY][newX]);
                            break;
                        case 'water':
                            grid[newY][newX] = new Particle(newX, newY, 'steam');
                            particles.push(grid[newY][newX]);
                            break;
                    }
                }
            }
        }
    }

    flicker() {
        const flickerDirections = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        const dir = flickerDirections[Math.floor(Math.random() * flickerDirections.length)];
        const newX = this.x + dir.dx;
        const newY = this.y + dir.dy;
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            const neighbor = grid[newY][newX];
            if (!neighbor || (neighbor && neighbor.density < this.density)) {
                grid[this.y][this.x] = null;
                this.x = newX;
                this.y = newY;
                grid[this.y][this.x] = this;
            }
        }
    }

    extinguish() {
        grid[this.y][this.x] = null;
        particles.splice(particles.indexOf(this), 1);
        if (Math.random() < 0.1) {
            const smoke = new Particle(this.x, this.y, 'smoke');
            particles.push(smoke);
            grid[this.y][this.x] = smoke;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}

function addParticle(x, y, type) {
    if (x >= 0 && x < width && y >= 0 && y < height && !grid[y][x]) {
        const particle = new Particle(x, y, type);
        particles.push(particle);
        grid[y][x] = particle;
    }
}

function addParticleCluster(x, y, type, size = 5) {
    for (let dx = -size; dx <= size; dx++) {
        for (let dy = -size; dy <= size; dy++) {
            if (Math.sqrt(dx * dx + dy * dy) <= size) {
                addParticle(x + dx, y + dy, type);
            }
        }
    }
}

let isMouseDown = false;

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    addParticleCluster(x, y, selectedType);
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        addParticleCluster(x, y, selectedType);
    }
});

let selectedType = 'sand';

function selectType(type) {
    selectedType = type;
    document.getElementById('colorIndicator').style.backgroundColor = particleTypes[type].color;
}

document.getElementById('colorIndicator').style.backgroundColor = particleTypes[selectedType].color;

let simulationRunning = true;

function startSimulation() {
    simulationRunning = true;
}

function pauseSimulation() {
    simulationRunning = false;
}

function resetSimulation() {
    particles.length = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            grid[y][x] = null;
        }
    }
}

function clearSimulation() {
    resetSimulation();
}

function saveState() {
    localStorage.setItem('particles', JSON.stringify(particles));
}

function loadState() {
    resetSimulation();
    const savedParticles = JSON.parse(localStorage.getItem('particles'));
    if (savedParticles) {
        savedParticles.forEach(p => {
            const particle = new Particle(p.x, p.y, p.type);
            particle.life = p.life;
            particles.push(particle);
            grid[p.y][p.x] = particle;
        });
    }
}

let simulationSpeed = 1;

function setSimulationSpeed(value) {
    simulationSpeed = value;
}

function update() {
    if (simulationRunning) {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

function loop() {
    for (let i = 0; i < simulationSpeed; i++) {
        update();
    }
    draw();
    requestAnimationFrame(loop);
}

loop();
