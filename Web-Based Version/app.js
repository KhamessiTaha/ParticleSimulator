const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const particles = [];
const grid = Array.from({ length: height }, () => Array(width).fill(null));

const particleTypes = {
    sand: { color: 'yellow', density: 2 },
    water: { color: 'blue', density: 1 },
    fire: { color: 'red', density: 0 },
    oil: { color: 'brown', density: 1 },
    wall: { color: 'gray', density: Infinity },
    acid: { color: 'green', density: 1 },
    gas: { color: 'lightgray', density: 0 },
    smoke: { color: 'darkgray', density: 0 },
    glass: { color: 'lightblue', density: 3 }
};

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = particleTypes[type].color;
        this.density = particleTypes[type].density;
    }

    update() {
        switch (this.type) {
            case 'sand':
            case 'water':
            case 'oil':
            case 'acid':
                this.fall();
                break;
            case 'fire':
                this.spread();
                this.burn();
                break;
            case 'gas':
            case 'smoke':
                this.rise();
                break;
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
            { dx: 1, dy: 0 },  // right
            { dx: -1, dy: 0 }, // left
            { dx: 0, dy: -1 }  // up
        ] : [
            { dx: 1, dy: 0 },  // right
            { dx: -1, dy: 0 }, // left
            { dx: 0, dy: 1 }   // down
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
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];

        for (let dir of spreadDirections) {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const neighbor = grid[newY][newX];
                if (neighbor) {
                    if (neighbor.type === 'oil') {
                        grid[newY][newX] = new Particle(newX, newY, 'fire');
                        particles.push(grid[newY][newX]);
                    } else if (neighbor.type === 'sand') {
                        grid[newY][newX] = new Particle(newX, newY, 'glass');
                        particles.push(grid[newY][newX]);
                    }
                }
            }
        }
    }

    burn() {
        if (this.y < height - 1) {
            const below = grid[this.y + 1][this.x];
            if (below) {
                if (below.type === 'oil') {
                    grid[this.y + 1][this.x] = new Particle(this.x, this.y + 1, 'fire');
                    particles.push(grid[this.y + 1][this.x]);
                } else if (below.type === 'sand') {
                    grid[this.y + 1][this.x] = new Particle(this.x, this.y + 1, 'glass');
                    particles.push(grid[this.y + 1][this.x]);
                } else if (below.type === 'water') {
                    grid[this.y + 1][this.x] = new Particle(this.x, this.y + 1, 'steam');
                    particles.push(grid[this.y + 1][this.x]);
                }
            }
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
            particles.push(particle);
            grid[p.y][p.x] = particle;
        });
    }
}

let simulationSpeed = 1;

function setSimulationSpeed(speed) {
    simulationSpeed = speed;
}

function gameLoop() {
    if (simulationRunning) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < simulationSpeed; i++) {
            particles.forEach(particle => {
                particle.update();
            });
        }
        particles.forEach(particle => {
            particle.draw();
        });
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
