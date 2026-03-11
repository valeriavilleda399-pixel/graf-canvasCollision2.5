const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;


canvas.style.background = "linear-gradient(to bottom, #C89EDB, #A99EDB, #DB9ED0)";

let score = 0;
let baseSpeed = 2; 

const imageSources = [
    'https://cdn-icons-png.flaticon.com/512/616/616408.png', 
    'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    'https://cdn-icons-png.flaticon.com/512/616/616554.png',
    'https://cdn-icons-png.flaticon.com/512/616/616438.png'
];

const images = imageSources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

class GameObject {
    constructor(x, y, speed) {
        this.posX = x;
        this.posY = y;
        this.speed = speed;
        // Requisito: Validar zonas y tamaños diferentes [cite: 16]
        this.size = Math.random() * (90 - 40) + 40;
        this.image = images[Math.floor(Math.random() * images.length)];
    }

    draw(context) {
        context.drawImage(this.image, this.posX, this.posY, this.size, this.size);
    }

    update(context) {
        // Requisito: Efecto de caída libre (arriba hacia abajo) [cite: 13]
        this.posY += this.speed;

        // Requisito: Caída indefinida [cite: 17]
        if (this.posY > window_height) {
            this.reset();
        }

        this.draw(context);
    }

    reset() {
        // Re-calculamos tamaño y posición para variar la caída [cite: 16]
        this.size = Math.random() * (90 - 40) + 40;
        this.posY = -this.size; // Inicia justo después del margen superior [cite: 13]
        this.posX = Math.random() * (window_width - this.size);
        this.speed = (Math.random() * baseSpeed) + 1;
        this.image = images[Math.floor(Math.random() * images.length)];
    }

    // Requisito: Detectar mouseX y mouseY para eliminar con clic 
    isClicked(mouseX, mouseY) {
        return (mouseX >= this.posX && mouseX <= this.posX + this.size &&
                mouseY >= this.posY && mouseY <= this.posY + this.size);
    }
}

let objects = [];

function generateObjects(n) {
    for (let i = 0; i < n; i++) {
        let x = Math.random() * (window_width - 90);
        let y = Math.random() * -window_height; // Distribución inicial aleatoria
        let speed = (Math.random() * baseSpeed) + 1;
        objects.push(new GameObject(x, y, speed));
    }
}

// Requisito: Contador en la parte superior derecha [cite: 17, 24]
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Eliminadas: ${score}`, window_width - 20, 40);
}

// Requisito: Reglas de velocidad progresiva [cite: 19]
function updateDifficulty() {
    if (score > 15) {
        baseSpeed = 8; // Velocidad alta [cite: 23]
    } else if (score > 10) {
        baseSpeed = 5; // Velocidad media [cite: 22]
    }
}

// Requisito: Interacción con el clic del usuario 
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    objects.forEach(obj => {
        if (obj.isClicked(mouseX, mouseY)) {
            score++; // Actualizar contador [cite: 17]
            obj.reset(); // El objeto reaparece para no disminuir el número [cite: 18]
            updateDifficulty();
        }
    });
});

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    objects.forEach(obj => obj.update(ctx));
    drawScore();
    requestAnimationFrame(animate);
}

let loadedImages = 0;
images.forEach(img => {
    img.onload = () => {
        loadedImages++;
        if (loadedImages === images.length) {
            generateObjects(20); // Requisito: Mantener flujo constante de objetos [cite: 18]
            animate();
        }
    };
});