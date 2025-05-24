/* eslint-disable no-console */
export default function setupRomLoader(chip8, containerElement) {
    const preloadedRoms = [
      { name: 'IBM Logo(Example)', url: 'roms/logo.ch8' },
      { name: 'Super Pong', url: 'roms/pong.ch8' },
      { name: 'Snake', url: 'roms/snake.ch8' },
      { name: 'Space Invaders', url: 'roms/invaders.ch8' },
    ];
  
    async function loadRom(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ROM: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const romData = new Uint8Array(arrayBuffer);
        chip8.reset();
        chip8.loadProgram(romData);
      } catch (error) {
        console.error(error);
      }
    }
  
    // eslint-disable-next-line no-param-reassign
    containerElement.innerHTML = '';
    preloadedRoms.forEach(({ name, url }) => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.classList.add('rom-button');
      btn.addEventListener('click', () => loadRom(url));
      containerElement.appendChild(btn);
    });
  }