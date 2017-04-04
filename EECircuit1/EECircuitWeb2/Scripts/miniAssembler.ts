﻿namespace miniAssembler
{
    var resultMessage = "";
    var lineNumber = 0;
    var pass = 0;
    var symbolTable = null;
    
    function writeError(msg: string) {
        if (lineNumber)
            resultMessage += "Line " + lineNumber + ": " + msg + "\r\n";
        else
            resultMessage += msg + "\r\n";
    }

    class mnemonicUnit {
        constructor(public operands: number, public bytes: number, public generate: (opr1: string, opr2: string, out: (byte: number) => void) => void) {
        }
    }

    function myParseSSS(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "C") return 1;
        if (opr == "D") return 2;
        if (opr == "E") return 3;
        if (opr == "H") return 4;
        if (opr == "L") return 5;
        if (opr == "M") return 6;
        if (opr == "A") return 7;
        writeError(opr + " is not a register name. Assumed that it's for accumulator");
        return 7;
    }

    function myParseDDD(opr: string): number {
        return myParseSSS(opr) << 3;
    }

    function myParseBDH(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "D") return 0x10;
        if (opr == "H") return 0x20;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }

    function myParseNumber(oprorg: string, equMode: boolean = false): number {
        var opr = oprorg;
        var hex = false;
        var dec = false;
        if (opr.length > 0 && opr.substring(0, 1) == "$") {
            hex = true;
            opr = opr.substring(1);
        }
        else if (opr.length > 0 && (opr.substring(0, 1) >= "0" && opr.substring(0, 1) <= "9")) {
            if (opr.substring(opr.length - 1, opr.length) == "H") {
                hex = true;
                opr = opr.substring(0, opr.length - 1);
            }
            else {
                dec = true;
                opr = opr.substring(0, opr.length);
            }
        }
        var n = 0;
        if (hex || dec) {
            for (var i = 0; i < opr.length; i++) {
                var c = opr.charCodeAt(i);
                if (hex) {
                    if (c >= 0x30 && c <= 0x39)
                        n = c - 0x30 + n * 16;
                    else if (c >= 0x41 && c <= 0x46)
                        n = c - 0x41 + 10 + n * 16;
                    else {
                        writeError(oprorg + " is not a correct number, assumed that it's 0.");
                        return 0;
                    }
                }
                else {
                    if (c >= 0x30 && c <= 0x39)
                        n = c - 0x30 + n * 10;
                    else {
                        writeError(oprorg + " is not a correct number, assumed that it's 0.");
                        return 0;
                    }
                }
            }
        }
        else {
            if ((!equMode && pass == 2) || (equMode && pass == 1)) {
                n = symbolTable[opr];
                if (n == undefined) {
                    writeError("Symbol " + opr + " was not a found, assumed that it's 0.");
                    n = 0;
                }
            }
        }
        return n;
    }

    function out16(hl:number, out:(n:number)=>void)
    {
        out(lowByte(hl));
        out(highByte(hl));
    }

    var mnemonicTable = new Object();

    function fillMnemonicTable() {
        mnemonicTable["ORG"] = new mnemonicUnit(1, 0, (opr1, opr2, out) => {
            this.pc = myParseNumber(opr1);
        });
        mnemonicTable["END"] = new mnemonicUnit(0, 0, (opr1, opr2, out) => {
            endRequest = true;
        });
        mnemonicTable["JMP"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0xc3);
            out16(myParseNumber(opr1), out);
        });



        mnemonicTable["MOV"] = new mnemonicUnit(3, 1, (opr1, opr2, out) => {
            out(0x40 | myParseDDD(opr1) | myParseSSS(opr2));
        });
        mnemonicTable["MVI"] = new mnemonicUnit(2, 2, (opr1, opr2, out) => {
            out(6 | myParseDDD(opr1));
            out(myParseNumber(opr2));
        });
        mnemonicTable["STA"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x32);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["LDA"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x3A);
            out16(myParseNumber(opr1), out);
        });



        mnemonicTable["ADD"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x80 | myParseSSS(opr1));
        });
        mnemonicTable["ADI"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xc6);
            out(myParseNumber(opr1));
        });


        mnemonicTable["CMP"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xb8 | myParseSSS(opr1));
        });
        mnemonicTable["CPI"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xfe);
            out(myParseNumber(opr1));
        });
        mnemonicTable["HLT"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x76);
        });
        mnemonicTable["LXI"] = new mnemonicUnit(2, 3, (opr1, opr2, out) => {
            out(1 | myParseBDH(opr1));
            out16(myParseNumber(opr2), out);
        });
        mnemonicTable["JNZ"] = new mnemonicUnit(2, 3, (opr1, opr2, out) => {
            out(0xd2);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["IN"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xdb);
            out(myParseNumber(opr1));
        });
        mnemonicTable["OUT"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xd3);
            out(myParseNumber(opr1));
        });
    }

    fillMnemonicTable();

    function lineParser(line: string): string[] {
        var tokens: string[] = [];
        var p = 0;
        var inSingleQuote = false;
        var inDoubleQuote = false;

        for (; ;) {
            var s = "";
            for (; ;) {
                if (p >= line.length) {
                    tokens.push(s);
                    return tokens;
                }
                var ch = line[p++];
                if (!inSingleQuote && !inDoubleQuote) {
                    if (ch == ";") {
                        tokens.push(s);
                        return tokens;
                    }
                    if (ch == "\t" || ch == " " || ch == ",") {
                        tokens.push(s);
                        break;
                    }
                }
                if (!inSingleQuote && ch == "\"") inDoubleQuote = !inDoubleQuote;
                if (!inDoubleQuote && ch == "'") inSingleQuote = !inSingleQuote;
                s += ch;
            }
            for (; ;) {
                if (p >= line.length) return tokens;
                var ch = line[p];
                if (ch != "\t" && ch != " " && ch != ",") break;
                p++;
            }
        }
    }

    function compileLine(pc: number, tokens: string[], out: (byte: number) => void) {
        if (pass == 1 && tokens[0]) {
            var n = tokens[0];
            if (n.substring(n.length - 1, n.length) == ":") {
                n = n.substring(0, n.length - 1).trim();
            }
            if (tokens[1] == "EQU") {
                symbolTable[n] = myParseNumber(tokens[2], true);
                return;
            }
            else {
                symbolTable[n] = pc;
            }
        }
        if (tokens[1]) {
            if (tokens[1] == "EQU") return;
            var mnem: mnemonicUnit = mnemonicTable[tokens[1]];
            if (mnem)
                mnem.generate(tokens[2], tokens[3], out);
            else
                writeError(tokens[1] + " is not a correct mnemonic.");
        }
    }

    var endRequest = false;

    function passX(sourceCode: string, outputMemory: emu.NumberArray) {
        var pc = 0;
        var start = 0;
        endRequest = false;
        lineNumber = 1;
        for (; ;) {
            var end = start;
            var line: string;
            for (; ;) {
                if (start >= sourceCode.length) return;
                if (end >= sourceCode.length) {
                    line = sourceCode.substring(start);
                    break;
                }
                var ch = sourceCode[end];
                if (ch == "\r" || ch == "\n") {
                    line = sourceCode.substring(start, end);
                    break;
                }
                end++;
            }
            var tokens = lineParser(line.toUpperCase());
            compileLine(pc, tokens, (byte: number) => {
                if (pass == 2) outputMemory.write(pc, byte);
                pc++;
            });
            if (endRequest) return;
            if (ch == "\r" && sourceCode[end + 1] == "\n")
                start = end + 2;
            else
                start = end + 1;
            lineNumber++;
        }
    }

    function compile(sourceCode: string, outputMemory: emu.NumberArray) {
        symbolTable = new Object();
        pass = 1;
        passX(sourceCode, outputMemory);
        if (resultMessage)
        {
            lineNumber = 0;
            writeError("Abnormal Terminated.");
            return;
        }
        pass = 2;
        passX(sourceCode, outputMemory);

        //var r = lineParser(" mvi \'\"',\"\'\",\",\" ;comment");
        //result += r.length + "tokens\r\n";
        //for (var i = 0; i < r.length; i++) {
        //    result += r[i] + "\r\n";
        //}
    }

    function compileCommon(completion:()=>void)
    {
        $("#result").text("");
        resultMessage = "";
        setTimeout(() => {
            var result = false;
            compile($("#sourceCode").val(), emu.virtualMachine.memory.Bytes);
            if (!resultMessage) {
                resultMessage += "Compile Completed\r\n"
                result = true;
            }
            resultMessage += "Done\r\n";
            $("#result").text(resultMessage);
            if (result && completion) completion();
        }, 10);
        $('#result').keyup();   // 枠を広げるおまじない
    }

    $("#ideCompile").click(() => {
        compileCommon(null);
    });

    $("#ideCompileAndRun").click(() => {
        var r = compileCommon(() => {
            emu.setMonitor();
            emu.restart();
        });
    });

    $(document).on("pagecreate", function () {
        // TBW
    });
}
