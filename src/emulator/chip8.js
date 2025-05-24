/* eslint-disable no-continue */
/* eslint-disable no-case-declarations */
/* eslint-disable no-bitwise */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
export default class Chip8 {
    constructor(){
        this.memory = new Uint8Array(4096); // 4kb of RAM
        this.v = new Uint8Array(16); // 16 variable registers
        this.I = 0; // index register
        this.pc = 0x200; // program counter
        this.stack = [];
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.programLoaded = false;
        this.display = new Array(64 * 32).fill(0);
        this.keys = new Array(16).fill(false);
        
        this.loadfontSet();
    }

    loadfontSet(){
        const fontSetArr = [0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
        for (let i = 0; i < fontSetArr.length; i++){
            this.memory[i + 0x50] = fontSetArr[i];
        }
    }

    loadProgram(programBuffer) {
        for (let i = 0; i < programBuffer.length; i++) {
          this.memory[0x200 + i] = programBuffer[i];
        }
        this.programLoaded = true;
    }

    reset() {
        this.memory.fill(0);
        this.v.fill(0);
        this.I = 0;
        this.pc = 0x200;
        this.stack = [];
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.programLoaded = false;
        this.display.fill(0);
        this.keys.fill(false);
        this.loadfontSet();
    }
    
    cycle(){
        if (!this.programLoaded) return;
        
        const opcode = this.fetch();
        this.decode(opcode);
    }
    
    fetch(){
        const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        this.pc += 2;
        return opcode;
    }

    decode(opcode){
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const n = opcode & 0x000F;
        const nn = opcode & 0x00FF;
        const nnn = opcode & 0x0FFF;

        switch(opcode & 0xF000) {
            case (0x0000):
                switch(opcode & 0x00FF){
                    case 0x00E0:
                        this.display.fill(0);
                        break;
                    case 0x00EE:
                        this.pc = this.stack.pop();
                        break;
                    default:
                        break;
                }
                break;
            case(0x1000):
                this.pc = nnn;
                break;
            case(0x2000):
                this.stack.push(this.pc);
                this.pc = nnn;
                break;
            case(0x3000):
                if (this.v[x] === nn){
                    this.pc += 2;
                }
                break;
            case(0x4000):
                if (this.v[x] !== nn){
                    this.pc += 2;
                }
                break;
            case(0x5000):
                if (this.v[x] === this.v[y]){
                    this.pc += 2;
                }
                break;
            case(0x6000):
                this.v[x] = nn;
                break;
            case(0x7000):
                this.v[x] += nn;
                break;
            case(0x8000):
                switch(opcode & 0x000F){
                    case(0x0000):
                        this.v[x] = this.v[y];
                        break;
                    case(0x0001):
                        this.v[x] |= this.v[y];
                        break;
                    case(0x0002):
                        this.v[x] &= this.v[y];
                        break;
                    case(0x0003):
                        this.v[x] ^= this.v[y];
                        break;
                    case(0x0004):
                        const sum = this.v[x] + this.v[y];
                        this.v[0xF] = sum > 0xFF ? 1 : 0;   
                        this.v[x] = sum & 0xFF;             
                        break;
                    case(0x0005): 
                        
                        this.v[0xF] = this.v[x] >= this.v[y] ? 1 : 0;
                        this.v[x] = (this.v[x] - this.v[y]) & 0xFF;
                        break;
                    case(0x0006):
                        this.v[0xF] = this.v[x] & 0x1;        
                        this.v[x] >>= 1;                     
                        break;
                    case(0x0007):
                        this.v[0xF] = this.v[y] >= this.v[x] ? 1 : 0;
                        this.v[x] = (this.v[y] - this.v[x]) & 0xFF;
                        break;
                    case(0x000E):
                        this.v[0xF] = (this.v[x] & 0x80) >> 7; 
                        this.v[x] = (this.v[x] << 1) & 0xFF;   
                    break;
                    default:
                        break;
                }
                break;
            case(0x9000):
                if (this.v[x] !== this.v[y]){
                    this.pc += 2;
                }
                break;
            case(0xA000):
                this.I = nnn;
                break;
            case (0xB000):
                this.pc = nnn + this.v[0];
                break;
            case 0xC000:
                this.v[x] = (Math.floor(Math.random() * 256)) & nn;
                break;
            case(0xD000):
                const xCoord = this.v[x] % 64;
                const yCoord = this.v[y] % 32;
                this.v[0xF] = 0;
                for (let row = 0; row < n; row++){
                    const spriteByte = this.memory[this.I + row];
                    for (let col = 0; col < 8; col++) {
                        const spritePixel = (spriteByte >> (7 - col)) & 1; 
                       
                        const px = (xCoord + col) % 64;
                        const py = (yCoord + row) % 32;
            
                        const index = py * 64 + px;
            
                    
                        if (spritePixel === 1) {
                            if (this.display[index] === 1) {
                                this.v[0xF] = 1;
                            }
                            this.display[index] ^= 1; 
                        }
                    }
                }
                break;
            case(0xE000):
                switch(opcode & 0x00FF){
                    case(0x009E):
                        if (this.keys[this.v[x]]) {
                            this.pc += 2;
                        }
                        break;
                    case(0x00A1):
                        if (!this.keys[this.v[x]]) {
                            this.pc += 2;
                        }
                        break;
                    default:
                        break;
                }
                break;
            case(0xF000):
                switch(opcode & 0x00FF){
                    case(0x0007):
                        this.v[x] = this.delayTimer;
                        break;
                    case(0x0015):
                        this.delayTimer = this.v[x];
                        break;
                    case(0x0018):
                        this.soundTimer = this.v[x];
                        break;
                    case(0x001E):
                        this.I += this.v[x];
                        break;
                    case(0x000A):
                        const pressedKey = this.keys.findIndex(key => key === true);

                        if (pressedKey === -1) {
                            this.pc -= 2;
                        } else {
                            this.v[x] = pressedKey;
                        }
                        break;
                    case(0x0029):
                        this.I = 0x50 + (this.v[x] * 5);    
                        break;
                    case(0x0033):
                        const value = this.v[x];
                        this.memory[this.I] = Math.floor(value / 100);         
                        this.memory[this.I + 1] = Math.floor((value % 100) / 10); 
                        this.memory[this.I + 2] = value % 10;                   
                        break;
                    case(0x0055):
                        for (let i = 0; i <= x; i++) {
                            this.memory[this.I + i] = this.v[i];
                        }
                    break;
                    
                    case(0x0065):
                        for (let i = 0; i <= x; i++) {
                            this.v[i] = this.memory[this.I + i];
                        }
                        break;

                    default:
                        break;
                }
                break;
            default: 
                break;
        }
    }
}
