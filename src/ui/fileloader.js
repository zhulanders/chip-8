export default class FileLoader {
    constructor(chip8Instance) {
      this.chip8 = chip8Instance;
      document.getElementById('romLoader').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const buffer = await file.arrayBuffer();
        this.chip8.reset();
        this.chip8.loadProgram(new Uint8Array(buffer));
      });
    }
  }