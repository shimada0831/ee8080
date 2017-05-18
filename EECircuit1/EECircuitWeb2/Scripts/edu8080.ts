﻿namespace edu8080
{
    class DataBus {

    }
    class AddressBus {

    }
    class AddressBuffer {

    }
    class DataBusBufferLatch {

    }
    class InternalDataBus {

    }
    class Register {
        protected upperLimit = 65535;
        private value = 0;
        public setValue(n: number) {
            if (n < 0 || n > this.upperLimit) {
                throw Error("value is out of range n=" + n);
            }
            this.value = n;
        }
        public getValue(): number {
            return this.value;
        }
        public Increment() {
            this.value++;
            if (this.value > this.upperLimit) this.value = 0;
        }
        public Decrement() {
            this.value--;
            if (this.value > this.upperLimit) this.value = 0;
        }
        public randomInitialize() {
            this.value = Math.floor(Math.random() * this.upperLimit);
        }
    }
    class Register8 extends Register {
        protected upperLimit = 255;
    }
    class Register16 extends Register { }
    class Accumulator extends Register8 { }
    class AccumulatorLatch extends Register8 { }
    class TempReg extends Register8 { }
    class ArithmeticLogicUnit {

    }
    class FlagFlipFlop {
        public z: boolean = false;
        public s: boolean = false;
        public p: boolean = false;
        public cy: boolean = false;
        public ac: boolean = false;
        public getPacked(): number {
            var n = 2;
            if (this.cy) n |= 1;
            if (this.p) n |= 4;
            if (this.ac) n |= 16;
            if (this.z) n |= 64;
            if (this.s) n |= 128;
            return n;
        }
        public setPacked(n: number) {
            this.cy = (n & 1) != 0;
            this.p = (n & 4) != 0;
            this.ac = (n & 16) != 0;
            this.z = (n & 64) != 0;
            this.s = (n & 128) != 0;
        }
    }
    class DecimalAdjust {

    }
    class InstructionRegister {

    }
    class InstructionDecoderAndMachineCycleEncoding {

    }
    class RegisterArray {
        public w = new Register8();
        public z = new Register8();
        public b = new Register8();
        public c = new Register8();
        public d = new Register8();
        public e = new Register8();
        public h = new Register8();
        public l = new Register8();
        public sp = new Register16();
        public pc = new Register16();
        public incrementerDecrementerAddressLatch = new Register16();
        // n: 0=BC, 1=DE, 2=HL, 3=SP
        public getRegisterPairValue(n: number) {
            switch (n) {
                case 0:
                    return this.b.getValue() * 256 + this.c.getValue();
                case 1:
                    return this.d.getValue() * 256 + this.e.getValue();
                case 2:
                    return this.h.getValue() * 256 + this.l.getValue();
                case 3:
                    return this.sp.getValue();
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
            }
        }
        public setRegisterPairValue(n: number, v: number) {
            var l = v & 255;
            var h = v >> 8;
            switch (n) {
                case 0:
                    this.b.setValue(h);
                    this.c.setValue(l);
                    break;
                case 1:
                    this.d.setValue(h);
                    this.e.setValue(l);
                    break;
                case 2:
                    this.h.setValue(h);
                    this.l.setValue(l);
                    break;
                case 3:
                    this.sp.setValue(v);
                    break;
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
                    break;
            }
        }
    }
    class TimingAndControl {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public runMain() {
            vdt.inputFunc = (num) => {
                emu.inputChars += String.fromCharCode(num);
                if (vdt.inputFuncAfter) vdt.inputFuncAfter();
            };
            for (; ;) {
                if (emu.waitingInput) {
                    emu.waitingInput = false;
                    vdt.inputFuncAfter = () => {
                        vdt.inputFuncAfter = null;
                        setTimeout(() => {
                            this.chip.runMain();
                        }, 0);
                    };
                    return;
                }
                if (emu.screenRefreshRequest) {
                    emu.screenRefreshRequest = false;
                    setTimeout(() => {
                        this.chip.runMain();
                    }, 0);
                    return;
                }

                var machinCode1 = this.chip.fetchNextByte();
                var g1 = machinCode1 >> 6;
                var g2 = (machinCode1 >> 3) & 0x7;
                var g3 = machinCode1 & 0x7;
                if (g1 == 0) {
                    if (g3 == 0) {
                        if (g2 == 0) { // NOP
                            // NO OPETATION
                        }
                        else {
                            // NO OPETATION
                            this.chip.hlt();
                            return;
                            //this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 1) // LXI or DAD
                    {
                        if ((g2 & 1) == 0) // LXI
                        {
                            if (g2 == 0x6) {    // LXI SP,
                                var sp = this.chip.fetchNextWord();
                                //if (sp != Math.ceil(sp)) {
                                //    this.chip.hlt();
                                //    return;
                                //}
                                this.chip.regarray.sp.setValue(sp);
                                //tracebox.add("lxi pc="+virtualMachine.cpu.regarray.pc.getValue().toString(16)+" sp=" +virtualMachine.cpu.regarray.sp.getValue().toString(16));
                            }
                            else {  // LXI B/D/H,
                                this.chip.setRegister(g2 + 1, this.chip.fetchNextByte());
                                this.chip.setRegister(g2, this.chip.fetchNextByte());
                            }
                        }
                        else // DAD
                        {
                            var t1 = this.chip.regarray.getRegisterPairValue(2);
                            var t2 = this.chip.regarray.getRegisterPairValue(g2 >> 1);
                            var s = t1 + t2;
                            this.chip.flags.cy = (s >= 0x10000) ? true : false;
                            this.chip.regarray.setRegisterPairValue(2, s & 0xffff);
                        }
                    }
                    else if (g3 == 2) {
                        if ((g2 & 0x5) == 0x0)  // STAX
                        {
                            emu.virtualMachine.memory.Bytes.write(this.chip.regarray.getRegisterPairValue(g2 >> 1), this.chip.accumulator.getValue());
                        }
                        else if ((g2 & 0x5) == 0x1)  // LDAX
                        {
                            this.chip.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(
                                this.chip.regarray.getRegisterPairValue(g2 >> 1)
                            ));
                        }
                        else if (g2 == 4)  // SHLD
                        {
                            var addr = this.chip.fetchNextWord();
                            emu.virtualMachine.memory.Bytes.write(addr, this.chip.regarray.l.getValue());
                            addr = incrementAddress(addr);
                            emu.virtualMachine.memory.Bytes.write(addr, this.chip.regarray.h.getValue());
                        }
                        else if (g2 == 5)  // LHLD
                        {
                            var addr = this.chip.fetchNextWord();
                            this.chip.regarray.l.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                            addr = incrementAddress(addr);
                            this.chip.regarray.h.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                        }
                        else if (g2 == 6) // STA
                        {
                            emu.virtualMachine.memory.Bytes.write(this.chip.fetchNextWord(), this.chip.accumulator.getValue());
                        }
                        else if (g2 == 7) { // LDA
                            this.chip.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(this.chip.fetchNextWord()));
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 3) {
                        var hl = this.chip.regarray.getRegisterPairValue(g2 >> 1);
                        if ((g2 & 1) == 0) // INX
                            hl++;
                        else // DEX
                            hl--;
                        this.chip.regarray.setRegisterPairValue(g2 >> 1, hl & 0xffff);
                        //if ((g2 >> 1) == 3)
                        //{
                        //tracebox.add("inx/dex pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        //}
                    }
                    else if (g3 == 4) { // INR
                        var val = this.chip.getRegister(g2);
                        val = this.chip.add(val, 1, true);
                        this.chip.setRegister(g2, val);
                    }
                    else if (g3 == 5) { // DCR
                        var val = this.chip.getRegister(g2);
                        val = this.chip.sub(val, 1, true);
                        this.chip.setRegister(g2, val);
                    }
                    else if (g3 == 6)    // MVI r,x
                    {
                        this.chip.setRegister(g2, this.chip.fetchNextByte());
                    }
                    else if (g3 == 7) {
                        if (g2 == 0)    // RLC
                        {
                            var r = this.chip.accumulator.getValue();
                            r <<= 1;
                            var over = (r & 0x100) != 0;
                            this.chip.accumulator.setValue((r & 255) + (over ? 1 : 0));
                            this.chip.flags.cy = over;
                        }
                        else if (g2 == 1)    // RRC
                        {
                            var r = this.chip.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.chip.accumulator.setValue((r & 255) + (over ? 0x80 : 0));
                            this.chip.flags.cy = over;
                        }
                        else if (g2 == 2)    // RAL
                        {
                            var r = this.chip.accumulator.getValue();
                            r <<= 1;
                            this.chip.accumulator.setValue((r & 255) + (this.chip.flags.cy ? 1 : 0));
                            this.chip.flags.cy = (r & 0x100) != 0;
                        }
                        else if (g2 == 3)    // RAR
                        {
                            var r = this.chip.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.chip.accumulator.setValue((r & 255) + (this.chip.flags.cy ? 0x80 : 0));
                            this.chip.flags.cy = over;
                        }
                        else if (g2 == 4)    // DAA
                        {
                            var a = this.chip.accumulator.getValue();
                            var al4 = a & 15;
                            if (al4 > 9 || this.chip.flags.ac) a += 6;
                            var ah4 = (a >> 4) & 15;
                            if (ah4 > 9 || this.chip.flags.cy) a += 0x60;
                            var r0 = a & 255;
                            this.chip.accumulator.setValue(r0);
                            var rc = (a >> 8) != 0;
                            this.chip.flags.z = (a == 0);
                            this.chip.flags.cy = rc;
                            this.chip.setps(r0);
                            this.chip.flags.ac = false;
                        }
                        else if (g2 == 5)    // CMA
                        {
                            this.chip.accumulator.setValue((~this.chip.accumulator.getValue()) & 255);
                        }
                        else if (g2 == 6)    // STC
                        {
                            this.chip.flags.cy = true;
                        }
                        else if (g2 == 7)    // CMC
                        {
                            this.chip.flags.cy = !this.chip.flags.cy;
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g1 == 1) {
                    if (g2 == 6 && g3 == 6)    // HLT
                    {
                        this.chip.hlt();
                        return;
                    }
                    else {  // MOV
                        this.chip.setRegister(g2, this.chip.getRegister(g3));
                    }
                }
                else if (g1 == 2) {
                    if (g2 == 0)    // ADD
                    {
                        this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                    }
                    else if (g2 == 1)    // ADC
                    {
                        this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.getRegister(g3), false, this.chip.flags.cy));
                    }
                    else if (g2 == 2)    // SUB
                    {
                        this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                    }
                    else if (g2 == 3)    // SBB
                    {
                        this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.getRegister(g3), false, this.chip.flags.cy));
                    }
                    else if (g2 == 4)    // AND
                    {
                        this.chip.accumulator.setValue(this.chip.and(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                    }
                    else if (g2 == 5)    // XRA
                    {
                        this.chip.accumulator.setValue(this.chip.xor(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                    }
                    else if (g2 == 6)    // ORA
                    {
                        this.chip.accumulator.setValue(this.chip.or(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                    }
                    else if (g2 == 7)    // CMP
                    {
                        this.chip.cmp(this.chip.accumulator.getValue(), this.chip.getRegister(g3));
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else {
                    if (g3 == 0) {  // Rxx
                        if (this.chip.condCommon(g2)) {
                            this.chip.regarray.pc.setValue(this.chip.popCommon());
                            //tracebox.add("rxx pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                    }
                    else if (g3 == 1) {
                        if ((g2 & 1) == 0) // POP
                        {
                            this.chip.setRegisterPairBDHPSW(g2 & 6, this.chip.popCommon());
                            //tracebox.add("pop pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else if (g2 == 1) { // RET
                            this.chip.regarray.pc.setValue(this.chip.popCommon());
                            //tracebox.add("ret pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else if (g2 == 5) // PCHL
                        {
                            this.chip.regarray.pc.setValue(this.chip.regarray.getRegisterPairValue(2));
                        }
                        else if (g2 == 7) // SPHL
                        {
                            this.chip.regarray.sp.setValue(this.chip.regarray.getRegisterPairValue(2));
                            //tracebox.add("sphl pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 2)   // Jxx
                    {
                        this.chip.condJump(this.chip.condCommon(g2));
                    }
                    else if (g3 == 3) {
                        if (g2 == 0) // JMP
                        {
                            var n = this.chip.fetchNextWord();
                            this.chip.regarray.pc.setValue(n);
                        }
                        else if (g2 == 3) // IN
                        {
                            var port = this.chip.fetchNextByte();
                            var r = emu.virtualMachine.io.in(port);
                            this.chip.setRegister(7, r);
                        }
                        else if (g2 == 2) // OUT
                        {
                            var port = this.chip.fetchNextByte();
                            var v = this.chip.getRegister(7);
                            emu.virtualMachine.io.out(port, v);
                        }
                        else if (g2 == 4)   // XTHL
                        {
                            var t = this.chip.popCommon();
                            this.chip.pushCommon(this.chip.regarray.getRegisterPairValue(2));
                            this.chip.regarray.setRegisterPairValue(2, t);
                            //tracebox.add("xthl pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else if (g2 == 5) // XCHG
                        {
                            var t1 = this.chip.regarray.l.getValue();
                            var t2 = this.chip.regarray.h.getValue();
                            this.chip.regarray.l.setValue(this.chip.regarray.e.getValue());
                            this.chip.regarray.h.setValue(this.chip.regarray.d.getValue());
                            this.chip.regarray.e.setValue(t1);
                            this.chip.regarray.d.setValue(t2);
                        }
                        else if (g2 == 6) // DI
                        {
                            // ASSUMED AS NOP
                        }
                        else if (g2 == 7) // EI
                        {
                            // ASSUMED AS NOP
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 4)   // Cxx
                    {
                        var oldpc = this.chip.condJump(this.chip.condCommon(g2));
                        if (oldpc != null) this.chip.pushCommon(oldpc);
                    }
                    else if (g3 == 5) {
                        if ((g2 & 1) == 0) // PUSH
                        {
                            var val = this.chip.getRegisterPairBDHPSW(g2 & 6);
                            this.chip.pushCommon(val);
                            //tracebox.add("push pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else if (g2 == 1)   // CALL
                        {
                            var oldpc = this.chip.condJump(true);
                            this.chip.pushCommon(oldpc);
                            //tracebox.add("call pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6) {
                        if (g2 == 0) // ADI
                        {
                            this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.fetchNextByte()));
                        }
                        else if (g2 == 1) // ACI
                        {
                            this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.fetchNextByte(), false, this.chip.flags.cy));
                        }
                        else if (g2 == 2) // SUI
                        {
                            this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.fetchNextByte()));
                        }
                        else if (g2 == 3) // SBI
                        {
                            this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.fetchNextByte(), false, this.chip.flags.cy));
                        }
                        else if (g2 == 4) // ANI
                        {
                            this.chip.accumulator.setValue(this.chip.and(this.chip.accumulator.getValue(), this.chip.fetchNextByte()));
                        }
                        else if (g2 == 5) // XRI
                        {
                            this.chip.accumulator.setValue(this.chip.xor(this.chip.accumulator.getValue(), this.chip.fetchNextByte()));
                        }
                        else if (g2 == 6) // ORI
                        {
                            this.chip.accumulator.setValue(this.chip.or(this.chip.accumulator.getValue(), this.chip.fetchNextByte()));
                        }
                        else if (g2 == 7) // CPI
                        {
                            this.chip.cmp(this.chip.accumulator.getValue(), this.chip.fetchNextByte());
                        }
                        else {
                            this.chip.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 7)   // RST
                    {
                        var oldpc = this.chip.regarray.pc.getValue();
                        if (emu.superTrap && g2 == 7) {
                            this.chip.hlt();
                            emu.setMonitor();
                            return;
                        }
                        this.chip.regarray.pc.setValue(g2 << 3);
                        this.chip.pushCommon(oldpc);
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
            }
        }
    }
    export class i8080 implements icpu {
        public halt = true;
        public accumulator = new Accumulator();
        public accumulatorLatch = new AccumulatorLatch();
        public tempReg = new TempReg();
        public regarray = new RegisterArray();
        public flags = new FlagFlipFlop();
        public timingAndControl = new TimingAndControl(this);
        public update() {
            $("#regA").text(dec2hex(this.accumulator.getValue(), 2));
            $("#regBC").text(dec2hex(this.regarray.b.getValue(), 2) + dec2hex(this.regarray.c.getValue(), 2));
            $("#regDE").text(dec2hex(this.regarray.d.getValue(), 2) + dec2hex(this.regarray.e.getValue(), 2));
            $("#regHL").text(dec2hex(this.regarray.h.getValue(), 2) + dec2hex(this.regarray.l.getValue(), 2));
            $("#regSP").text(dec2hex(this.regarray.sp.getValue(), 4));
            $("#regPC").text(dec2hex(this.regarray.pc.getValue(), 4));
            var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
            var m = emu.virtualMachine.memory.Bytes.read(Math.floor(hl));
            $("#regM").text(dec2hex(m, 2));

            $("#regS").text(this.flags.s ? 1 : 0);
            $("#regZ").text(this.flags.z ? 1 : 0);
            $("#regP").text(this.flags.p ? 1 : 0);
            $("#regC").text(this.flags.cy ? 1 : 0);
            $("#regAC").text(this.flags.ac ? 1 : 0);
        }
        private randomInitialize() {
            this.accumulator.randomInitialize();
            this.regarray.b.randomInitialize();
            this.regarray.c.randomInitialize();
            this.regarray.d.randomInitialize();
            this.regarray.e.randomInitialize();
            this.regarray.h.randomInitialize();
            this.regarray.l.randomInitialize();
            this.regarray.sp.randomInitialize();
        }
        public selectRegister(n: number) {
            var r: Register;
            switch (n) {
                case 0: return this.regarray.b;
                case 1: return this.regarray.c;
                case 2: return this.regarray.d;
                case 3: return this.regarray.e;
                case 4: return this.regarray.h;
                case 5: return this.regarray.l;
                case 6: return null;
                case 7: return this.accumulator;
            }
        }

        public setRegister(n: number, v: number) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                emu.virtualMachine.memory.Bytes.write(Math.floor(hl), v);
            }
            else
                r.setValue(v);
        }
        public getRegister(n: number) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                return emu.virtualMachine.memory.Bytes.read(Math.floor(hl));
            }
            else
                return r.getValue();
        }

        public getRegisterPairBDHPSW(n: number): number {
            switch (n) {
                case 0:
                    return this.regarray.b.getValue() * 256 + this.regarray.c.getValue();
                case 2:
                    return this.regarray.d.getValue() * 256 + this.regarray.e.getValue();
                case 4:
                    return this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                case 6:
                    return this.accumulator.getValue() * 256 + this.flags.getPacked();
            }
        }

        public setRegisterPairBDHPSW(n: number, v: number) {
            var l = v & 255;
            var h = v >> 8;
            switch (n) {
                case 0:
                    this.regarray.b.setValue(h);
                    this.regarray.c.setValue(l);
                    break;
                case 2:
                    this.regarray.d.setValue(h);
                    this.regarray.e.setValue(l);
                    break;
                case 4:
                    this.regarray.h.setValue(h);
                    this.regarray.l.setValue(l);
                    break;
                case 6:
                    this.accumulator.setValue(h);
                    this.flags.setPacked(l);
                    break;
            }
        }

        public fetchNextByte() {
            var pc = this.regarray.pc.getValue();
            var m = emu.virtualMachine.memory.Bytes.read(Math.floor(pc));
            this.regarray.pc.Increment();
            return m;
        }
        public fetchNextWord() {
            var l = this.fetchNextByte();
            var h = this.fetchNextByte();
            var hl = h * 256 + l;
            return hl;
        }
        public setRuning() {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("run");
            $("#runStopStatus").text("RUN");
        }
        public setStopped() {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("stop");
            $("#runStopStatus").text("STOP");
        }

        public undefinedInstuction(n: number) {
            alert(n.toString(16) + " is not undefined machine code");
        }

        public notImplemented(n: number) {
            alert(n.toString(16) + " is not implemented");
        }

        public setps(a: number) {
            this.flags.s = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1) p++;
                x >>= 1;
            }
            this.flags.p = ((p & 1) == 0);
        }

        public cmp(a: number, b: number) {
            //this.flags.z = (a == b);
            //this.flags.cy = (a < b);
            //this.setps(this.accumulator.getValue());
            //this.flags.ac = false;
            this.sub(a, b);
        }

        public add(a: number, b: number, cyUnchange: boolean = false, c: boolean = false): number {
            var r = a + b + (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange) this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = ((a & 0x8) & (b & 0x8)) != 0;
            return r0;
        }
        public sub(a: number, b: number, cyUnchange: boolean = false, c: boolean = false): number {
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange) this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = false;
            return r0;
        }

        public setlogicFlags(v: number, ac: boolean) {
            this.flags.z = (v == 0);
            this.flags.cy = false;
            this.setps(v);
            this.flags.ac = ac;
        }

        public and(a: number, b: number): number {
            var r = a & b;
            this.setlogicFlags(r, true);
            return r;
        }
        public or(a: number, b: number): number {
            var r = a | b;
            this.setlogicFlags(r, false);
            return r;
        }
        public xor(a: number, b: number): number {
            var r = a ^ b;
            this.setlogicFlags(r, false);
            return r;
        }

        public condJump(cond: boolean): number {
            var tgt = this.fetchNextWord();
            if (cond) {
                var oldpc = this.regarray.pc.getValue();
                this.regarray.pc.setValue(tgt);
                return oldpc;
            }
            else
                return null;
        }

        public condCommon(g2: number): boolean {
            switch (g2) {
                case 0: // NZ
                    return !this.flags.z;
                case 1: // Z
                    return this.flags.z;
                case 2: // NC
                    return !this.flags.cy;
                case 3: // C
                    return this.flags.cy;
                case 4: // PO
                    return !this.flags.p;
                case 5: // PE
                    return this.flags.p;
                case 6: // P
                    return !this.flags.s;
                case 7: // M
                    return this.flags.s;
            }
        }

        public popCommon(): number {
            var l = emu.virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            var h = emu.virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            return h * 256 + l;
        }

        public pushCommon(val: number) {
            this.regarray.sp.Decrement();
            emu.virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val >> 8);
            this.regarray.sp.Decrement();
            emu.virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val & 255);
        }

        public hlt() {
            this.halt = true;
            emu.virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
            emu.tracebox.dump();
        }
        private lastval = 65536;

        public runMain() {
            this.timingAndControl.runMain();
        }

        public reset() {
            // TBW
            //this.regarray.b.setValue(255);  // DEBUG

            this.randomInitialize();
            this.regarray.pc.setValue(0);
            this.halt = false;
            this.setRuning();
            setTimeout(() => {
                this.runMain();
            }, 100);
        }

        public diskread() {
            var hl = this.regarray.getRegisterPairValue(2);
            var r = disk.read(this.regarray.b.getValue(),
                this.regarray.c.getValue(),
                this.regarray.e.getValue(),
                hl);
            //alert(virtualMachine.memory.Bytes.read(hl));
            return r;
        }
        public diskwrite() {
            return disk.write(this.regarray.b.getValue(),
                this.regarray.c.getValue(),
                this.regarray.e.getValue(),
                this.regarray.getRegisterPairValue(2));
        }
        public getName() {
            return "i8080 emulator (Educational) Ready\r\n";
        }
    }
}