const keyMap = {
    'Digit1': 0x1, 'Digit2': 0x2, 'Digit3': 0x3, 'Digit4': 0xC,
    'KeyQ': 0x4, 'KeyW': 0x5, 'KeyE': 0x6, 'KeyR': 0xD,
    'KeyA': 0x7, 'KeyS': 0x8, 'KeyD': 0x9, 'KeyF': 0xE,
    'KeyZ': 0xA, 'KeyX': 0x0, 'KeyC': 0xB, 'KeyV': 0xF
  };
  
export default function setupKeyboard(chip8) {
    window.addEventListener('keydown', (event) => {
        const key = keyMap[event.code];
        if (key !== undefined) {
        chip8.keys[key] = true;
        event.preventDefault();
        }
    });

    window.addEventListener('keyup', (event) => {
        const key = keyMap[event.code];
        if (key !== undefined) {
        chip8.keys[key] = false;
        event.preventDefault();
        }
    });
}