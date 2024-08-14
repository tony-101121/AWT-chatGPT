const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const numMolecules = 50;
const moleculeRadius = 10;
const speed = 2;
const vanDerWaalsRadius = 20; // Example parameter for Van der Waals forces

class DiatomicMolecule {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.angle = Math.random() * 2 * Math.PI;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off the walls
        if (this.x < moleculeRadius || this.x > width - moleculeRadius) {
            this.vx = -this.vx;
        }
        if (this.y < moleculeRadius || this.y > height - moleculeRadius) {
            this.vy = -this.vy;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, moleculeRadius, 0, Math.PI);
        ctx.arc(0, 0, moleculeRadius, Math.PI, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
        ctx.fill();
        ctx.restore();
    }

    applyVanDerWaalsForce(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < vanDerWaalsRadius) {
            const forceMagnitude = (1 / distance) - (1 / vanDerWaalsRadius);
            this.vx -= forceMagnitude * dx / distance;
            this.vy -= forceMagnitude * dy / distance;
            other.vx += forceMagnitude * dx / distance;
            other.vy += forceMagnitude * dy / distance;
        }
    }
}

// Initialize molecules
const molecules = [];
for (let i = 0; i < numMolecules; i++) {
    const x = Math.random() * (width - 2 * moleculeRadius) + moleculeRadius;
    const y = Math.random() * (height - 2 * moleculeRadius) + moleculeRadius;
    molecules.push(new DiatomicMolecule(x, y));
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw molecules
    molecules.forEach(molecule => {
        molecule.update();
        molecule.draw();
    });

    // Apply Van der Waals forces
    for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
            molecules[i].applyVanDerWaalsForce(molecules[j]);
        }
    }

    requestAnimationFrame(animate);
}

animate();
