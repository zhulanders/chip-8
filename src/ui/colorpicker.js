/* eslint-disable no-param-reassign */
import getTextColor from '../utils/textcolor';

export default class ColorPicker {
  constructor(updateCallback) {
    this.color = { r: 255, g: 255, b: 255 };
    this.updateCallback = updateCallback;

    ['rSlider', 'gSlider', 'bSlider'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.updateColor());
    });

    this.updateColor();
  }

  updateColor() {
    const r = parseInt(document.getElementById('rSlider').value, 10);
    const g = parseInt(document.getElementById('gSlider').value, 10);
    const b = parseInt(document.getElementById('bSlider').value, 10);

    this.color = { r, g, b };
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const textColor = getTextColor(r, g, b);

    ['leftSidebar', 'rightSidebar'].forEach(id => {
      const el = document.getElementById(id);
      el.style.backgroundColor = rgb;
      el.style.color = textColor;
    });
    const loadRom = document.getElementById('customFileBtn');
    loadRom.style.backgroundColor = rgb;
    loadRom.style.color = textColor;
    const romsContainer = document.getElementById('rightSidebar');
    if (romsContainer) {
      const buttons = romsContainer.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.backgroundColor = rgb;
        button.style.color = textColor;
        button.style.borderColor = textColor;
      });
    }
    this.updateCallback();
  }

  getColor() {
    return this.color;
  }
}