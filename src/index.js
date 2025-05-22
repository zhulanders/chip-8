class Chip8 {
    constructor(){
        this.memory = new Uint8Array(4096); //4kb of RAM
        this.v = new Uint8Array(16); //16 variable registers
        this.I = 0; //index register
        this.pc = 0x200; //program counter
        this.stack = [];
        this.delayTimer = 0;
        this.soundTimer = 0;

        this.display = new Array(64 * 32).fill(0);
        this.keys = new Array(16).fill(false);
        
        this.loadfontSet();
    }
    loadfontSet(){
        fontSetArr = [0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
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
    cycle(){
        const opcode = fetch();
        decode(opcode);
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
                }
            case(0x1000):
                this.pc = nnn;
                break;
            case(0x2000):
                this.stack.push(this.pc);
                this.pc = nnn;
                break;
            case(0x6000):
                this.v[x] = nn;
                break;
            case(0x7000):
                this.v[x] += nn;
                break;
            case(0xA000):
                this.I = nnn;
            case(0xD000):
                
        }
    }
}
