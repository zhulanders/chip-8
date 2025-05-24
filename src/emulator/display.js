export default class Display {
    constructor(canvas, getPixelColor) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.getPixelColor = getPixelColor;
    }
  
    draw(chip8) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
          const pixel = chip8.display[y * 64 + x];
          if (pixel) {
            const { r, g, b } = this.getPixelColor();
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.fillRect(x * 10, y * 10, 10, 10);
          }
        }
      }
    }
  }