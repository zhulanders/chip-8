/* eslint-disable no-plusplus */
/* eslint-disable no-new */
import Chip8 from './emulator/chip8';
import Display from './emulator/display';
import setupKeyboard from './emulator/controls';
import ColorPicker from './ui/colorpicker';
import HzController from './ui/hzcontroller';
import FileLoader from './ui/fileloader';
import setupRomLoader from './ui/romLoader';
import './styles.css';

const chip8 = new Chip8();
setupKeyboard(chip8);
const romsContainer = document.getElementById('rightSidebar');
setupRomLoader(chip8, romsContainer);

const colorPicker = new ColorPicker(() => {});
const display = new Display(document.getElementById('screen'), () => colorPicker.getColor());
new FileLoader(chip8);


let hz = 60;
let intervalId;

const run = () => {
  for (let i = 0; i < 10; i++) chip8.cycle();
  display.draw(chip8);
  if (chip8.delayTimer > 0) chip8.delayTimer--;
  if (chip8.soundTimer > 0) chip8.soundTimer--;
  intervalId = setTimeout(run, 1000 / hz);
};

new HzController((newHz) => {
  hz = newHz;
  clearTimeout(intervalId);
  run();
});

run();
