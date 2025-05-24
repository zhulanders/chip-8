
import Chip8 from "./chip8";

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
function drawDisplay(chip8) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 64; x++) {
        const pixel = chip8.display[y * 64 + x];
        if (pixel) {
          console.log('draw');
          ctx.fillStyle = '#FFF';
          ctx.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  }
const chip8 = new Chip8();

setInterval(() => {
    for (let i = 0; i < 10; i++) chip8.cycle();
    drawDisplay(chip8);
}, 1000 / 60);
document.getElementById('romLoader').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    chip8.loadProgram(new Uint8Array(arrayBuffer));
});
const keyMap = {
  'Digit1': 0x1,
  'Digit2': 0x2,
  'Digit3': 0x3,
  'Digit4': 0xC,
  'KeyQ':  0x4,
  'KeyW':  0x5,
  'KeyE':  0x6,
  'KeyR':  0xD,
  'KeyA':  0x7,
  'KeyS':  0x8,
  'KeyD':  0x9,
  'KeyF':  0xE,
  'KeyZ':  0xA,
  'KeyX':  0x0,
  'KeyC':  0xB,
  'KeyV':  0xF
};
window.addEventListener('keydown', (event) => {
  const chipKey = keyMap[event.code];
  if (chipKey !== undefined) {
    chip8.keys[chipKey] = true;
    event.preventDefault(); 
  }
});

window.addEventListener('keyup', (event) => {
  const chipKey = keyMap[event.code];
  if (chipKey !== undefined) {
    chip8.keys[chipKey] = false;
    event.preventDefault();
  }
});