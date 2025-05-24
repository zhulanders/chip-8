import Chip8 from "./chip8";
import './styles.css';

let pixelColor = { r: 255, g: 255, b: 255 };
let hz = 60;
let intervalId;
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
        
          ctx.fillStyle = `rgb(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b})`;
          ctx.fillRect(x * 10, y * 10, 10, 10);
        }
      }
    }
  }
const chip8 = new Chip8();

function getTextColor(r, g, b) {
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}
const run = () => {
  for (let i = 0; i < 10; i++) chip8.cycle();
  drawDisplay(chip8);

  if (chip8.delayTimer > 0) chip8.delayTimer--;
  if (chip8.soundTimer > 0) chip8.soundTimer--;

  intervalId = setTimeout(run, 1000 / hz);
};
function updateColor() {
  const r = parseInt(document.getElementById('rSlider').value, 10);
  const g = parseInt(document.getElementById('gSlider').value, 10);
  const b = parseInt(document.getElementById('bSlider').value, 10);

  pixelColor = { r, g, b };
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const textColor = getTextColor(r, g, b);

  const leftSidebar = document.getElementById('leftSidebar');
  const rightSidebar = document.getElementById('rightSidebar');

  leftSidebar.style.backgroundColor = rgbString;
  rightSidebar.style.backgroundColor = rgbString;

  leftSidebar.style.color = textColor;
  rightSidebar.style.color = textColor;
}


['rSlider', 'gSlider', 'bSlider'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateColor);
});
document.getElementById('hzSlider').addEventListener('input', (event) => {
  hz = parseInt(event.target.value, 10);
  document.getElementById('hzValue').textContent = hz;

  clearTimeout(intervalId); 
  run(); 
});
updateColor();
run(); 
document.getElementById('romLoader').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return; 
    const arrayBuffer = await file.arrayBuffer();
    chip8.reset();
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