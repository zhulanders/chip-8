export default class HzController {
    constructor(onHzChange) {
      this.hz = 60;
      this.onHzChange = onHzChange;
  
      const slider = document.getElementById('hzSlider');
      slider.addEventListener('input', (e) => {
        this.hz = parseInt(e.target.value, 10);
        document.getElementById('hzValue').textContent = this.hz;
        this.onHzChange(this.hz);
      });
    }
  
    getHz() {
      return this.hz;
    }
  }