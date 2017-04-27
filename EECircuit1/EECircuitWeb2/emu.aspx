﻿<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="emu.aspx.cs" Inherits="EECircuitWeb2.emu" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">Serial</a></h1>
    </div>

    <div role="main" class="ui-content">
        <div id="mon" class="mypane">
            <p class="stop" id="runStopStatus" >STOP</p>
            <table>
                <tr>
                    <th >A</th>
                    <th >BC</th>
                    <th >DE</th>
                    <th >HL</th>
                    <th >M</th>
                    <th >SP</th>
                    <th >PC</th>
                    <th >S</th>
                    <th >Z</th>
                    <th >P</th>
                    <th >C</th>
                    <th >AC</th>
                </tr>
                <tr>
                    <td  class="border"><span id="regA" class="fixed">XX</span></td>
                    <td  class="border"><span id="regBC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regDE" class="fixed">XX</span></td>
                    <td  class="border"><span id="regHL" class="fixed">XX</span></td>
                    <td  class="border"><span id="regM" class="fixed">XX</span></td>
                    <td  class="border"><span id="regSP" class="fixed">XX</span></td>
                    <td  class="border"><span id="regPC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regS" class="fixed">XX</span></td>
                    <td  class="border"><span id="regZ" class="fixed">XX</span></td>
                    <td  class="border"><span id="regP" class="fixed">XX</span></td>
                    <td  class="border"><span id="regC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regAC" class="fixed">XX</span></td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                         <label for="memoryAddress">MEMORY:</label>
                    </td>
                    <td>
                         <input name="memoryAddress" id="memoryAddress" type="text" value="0000" data-clear-btn="true">
                    </td>
                    <td><span id="memoryDump" class="fixed"></span></td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Input Port 0FFH</th>
                </tr>
                <tr>
                    <td>
                        <fieldset data-role="controlgroup" data-type="horizontal" id="setpara"  data-mini="true">
                            <input name="bit7" id="bit7" type="checkbox" class="bit">
                            <label for="bit7">7</label>
                            <input name="bit6" id="bit6" type="checkbox" class="bit">
                            <label for="bit6">6</label>
                            <input name="bit5" id="bit5" type="checkbox" class="bit">
                            <label for="bit5">5</label>
                            <input name="bit4" id="bit4" type="checkbox" class="bit">
                            <label for="bit4">4</label>
                            <input name="bit3" id="bit3" type="checkbox" class="bit">
                            <label for="bit3">3</label>
                            <input name="bit2" id="bit2" type="checkbox" class="bit">
                            <label for="bit2">2</label>
                            <input name="bit1" id="bit1" type="checkbox" class="bit">
                            <label for="bit1">1</label>
                            <input name="bit0" id="bit0" type="checkbox" class="bit">
                            <label for="bit0">0</label>
                        </fieldset>
                    </td>
                </tr>
                <tr>
                    <th>output Port 0FFH</th>
                </tr>
                <tr>
                    <td class="mainText" id="outPortFF">○○○○○○○○</td>
                </tr>
            </table>
            <div data-role="controlgroup" data-type="horizontal">
                <a href="#" id="restart" data-role="button" data-theme="b">Restart</a>
                <a href="#" id="restartbreak" data-role="button" >Restart and break</a>
                <a href="#" id="step" data-role="button">Step Run</a>
                <a href="#" id="stopcont" data-role="button">Stop/Continue</a>
            </div>
        </div>

        <div id="con" class="mypane">
            <div id="vscreen" class="vdt">
                <p class="vdtline" id="vline0">This is Sample Line1</p>
                <p class="vdtline" id="vline1">abc</p>
                <p class="vdtline" id="vline2">The quick brown fox jumps over the lazy dog</p>
                <p class="vdtline" id="vline3"></p>
                <p class="vdtline" id="vline4"></p>
                <p class="vdtline" id="vline5"></p>
                <p class="vdtline" id="vline6"></p>
                <p class="vdtline" id="vline7"></p>
                <p class="vdtline" id="vline8"></p>
                <p class="vdtline" id="vline9"></p>
                <p class="vdtline" id="vline10"></p>
                <p class="vdtline" id="vline11"></p>
                <p class="vdtline" id="vline12"></p>
                <p class="vdtline" id="vline13"></p>
                <p class="vdtline" id="vline14"></p>
                <p class="vdtline" id="vline15"></p>
                <p class="vdtline" id="vline16"></p>
                <p class="vdtline" id="vline17"></p>
                <p class="vdtline" id="vline18"></p>
                <p class="vdtline" id="vline19"></p>
                <p class="vdtline" id="vline20"></p>
                <p class="vdtline" id="vline21"></p>
                <p class="vdtline" id="vline22"></p>
                <p class="vdtline" id="vline23">Line24</p>
            </div>
            <div id="vkeyboard">
                <fieldset id="kbd1" data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <button id="vk1" type="button" class="vkey" data-shift="!" data-normal="1">X</button>
                    <button id="vk2" type="button" class="vkey" data-shift="&quot;" data-normal="2">X</button>
                    <button id="vk3" type="button" class="vkey" data-shift="#" data-normal="3">X</button>
                    <button id="vk4" type="button" class="vkey" data-shift="$" data-normal="4">X</button>
                    <button id="vk5" type="button" class="vkey" data-shift="%" data-normal="5">X</button>
                    <button id="vk6" type="button" class="vkey" data-shift="&amp;" data-normal="6">X</button>
                    <button id="vk7" type="button" class="vkey" data-shift="'" data-normal="7">X</button>
                    <button id="vk8" type="button" class="vkey" data-shift="(" data-normal="8">X</button>
                    <button id="vk9" type="button" class="vkey" data-shift=")" data-normal="9">X</button>
                    <button id="vk0" type="button" class="vkey" data-normal="0">X</button>
                    <button id="vkcolon" type="button" class="vkey" data-shift="*" data-normal=":">X</button>
                    <button id="vkminus" type="button" class="vkey" data-shift="=" data-normal="-">X</button>
                    <button id="vkopen" type="button" class="vkey" data-shift="{" data-normal="[">X</button>
                    <button id="vkclose" type="button" class="vkey" data-shift="}" data-normal="]">X</button>
                    <button id="vkhome" type="button" class="vkey" data-shift="HOME" data-normal="~">X</button>
                </fieldset>
                <fieldset id="kbd2" data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <button id="vkesc" type="button" class="vkey" data-normal="ESC">X</button>
                    <button id="vkq" type="button" class="vkey" data-shift="Q" data-normal="q">X</button>
                    <button id="vkw" type="button" class="vkey" data-shift="W" data-normal="w">X</button>
                    <button id="vke" type="button" class="vkey" data-shift="E" data-normal="e">X</button>
                    <button id="vkr" type="button" class="vkey" data-shift="R" data-normal="r">X</button>
                    <button id="vkt" type="button" class="vkey" data-shift="T" data-normal="t">X</button>
                    <button id="vky" type="button" class="vkey" data-shift="Y" data-normal="y">X</button>
                    <button id="vku" type="button" class="vkey" data-shift="U" data-normal="u">X</button>
                    <button id="vki" type="button" class="vkey" data-shift="I" data-normal="i">X</button>
                    <button id="vko" type="button" class="vkey" data-shift="O" data-normal="i">X</button>
                    <button id="vkp" type="button" class="vkey" data-shift="P" data-normal="p">X</button>
                    <button id="vklf" type="button" class="vkey" data-normal="LF">X</button>
                    <button id="vkenter" type="button" class="vkey" data-normal="Enter">X</button>
                </fieldset>
                <fieldset id="kbd3"  data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <button id="vkctrl" type="button" class="vkey" data-shift="Ctrl" data-normal="_">X</button>
                    <button id="vka" type="button" class="vkey" data-shift="A" data-normal="a">X</button>

                    <button id="vkupline" type="button" class="vkey" data-shift="|" data-normal="\">X</button>
                </fieldset>
                <fieldset id="kbd4"  data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <button id="vklshift" type="button" class="vkey vkshifts" data-normal="Shift">X</button>
                    <button id="vkz" type="button" class="vkey" data-shift="Z" data-normal="z">X</button>


                    <button id="vkquestion" type="button" class="vkey" data-shift="?" data-normal="/">X</button>
                </fieldset>
                <fieldset id="kbd5" data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <button id="vkspace" type="button" class="vkey" data-shift="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">X</button>
                </fieldset>
            </div>

<!-- TBW -->


        </div>
        <div id="ide" class="mypane">
            <div data-role="collapsible" data-mini="true" id="collapsibleIdeCommands">
                <h4>Commands</h4>
                <ul data-role="listview">
                    <li><a href="#" class="ideCommands" id="ideCompile">Compile</a></li>
                    <li><a href="#" class="ideCommands" id="ideCompileAndRun">Compile and Run</a></li>
                    <li><a href="#" class="ideCommands">New File</a></li>
                    <li><a href="#" class="ideCommands">Load File</a></li>
                    <li><a href="#" class="ideCommands">Save File</a></li>
                    <li><a href="#" class="ideCommands">Save As File</a></li>
                    <li><a href="#" class="ideCommands">Cut</a></li>
                    <li><a href="#" class="ideCommands">Copy</a></li>
                    <li><a href="#" class="ideCommands">Paste</a></li>
                </ul>
            </div>
            <label for="result">Compiler Results:</label>
            <textarea name="result" id="result" readonly="readonly"></textarea>
            <label for="sourceCode">Source Code:</label>
            <textarea name="sourceCode" id="sourceCode" data-autogrow="false" style="margin: 0px 0px 0px 0px"></textarea>
        </div>
    </div>

    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navcon">Console</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navmon">Monitor</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navide">Ide</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtest1">Load Test-1</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtest2">Load Test-2</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navcpm">Load CPM to mem</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navreset">Reset System</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
    </div>
    <script src="/Scripts/vdt.js"></script>
    <script src="/Scripts/emu.js"></script>
    <script src="/Scripts/miniAssembler.js"></script>
</asp:Content>
