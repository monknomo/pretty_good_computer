var prettyGoodComputer = {
    editor: null,
    brk: false,
    addressableMemory: 16,
    initialize: function () {
        $("div#prettyGoodComputer").html("<div id='prettyGoodComputerMemory'></div><div id='prettyGoodComputerCompilerMessages'></div>\n<div id='prettyGoodComputerProgramEditor'></div><div id='prettyGoodComputerButtonBar'><button id='prettyGoodComputerRunProgramButton'>Run Me</button>&nbsp<button id='prettyGoodComputerBreakButton'>Break</button>&nbsp<button id='prettyGoodComputerShareButton'>Share</button></div><div id='prettyGoodComputerSharingStation'><p><label for='prettyGoodComputerShareLink'>Share Link: </label><input id='prettyGoodComputerShareLink'  size='35'></input></p></div>");
        var tableString = "<table><tr>";
        var cellClass = "";
        for (var i = 0; i < this.addressableMemory; i++) {
            if (i % 2 === 0) {
                cellClass = "even";
            } else {
                cellClass = "odd";
            }
            if (i < 10) {
                tableString += "<td class='" + cellClass + "'>0" + i + "</td>";
            } else {
                tableString += "<td class='" + cellClass + "'>" + i + "</td>";
            }
        } //end for
        tableString += "</tr><tr>";
        for (i = 0; i < this.addressableMemory; i++) {
            cellClass = "";
            if (i % 2 === 0) {
                cellClass = "even";
            } else {
                cellClass = "odd";
            }
            tableString += "<td class='okMemory " + cellClass + "'><input type='text' size='1' class='okMemory " + i + "'></input></td>";
        } //end for
        tableString += "</tr></table>";
        $("#prettyGoodComputerMemory").html(tableString);
        this.editor = ace.edit("prettyGoodComputerProgramEditor");
        this.editor.setTheme("ace/theme/tomorrow_night_eighties");
        var that = this;
        this.editor.on('change', function () {
            $('#prettyGoodComputerShareLink').val(that.shareUrl());
        });
        this.editor.setValue("z0\nz1\ni0\ni0\ni1\nj0!1)5");

        $("#prettyGoodComputerRunProgramButton").click(this.runProgramButton.bind(this));
        $("#prettyGoodComputerBreakButton").click(this.breakButton.bind(this));
        $("#prettyGoodComputerShareButton").click(this.shareButton.bind(this));
        this.createOrUpdateTweetButton();
    }, //end initialize
    shareButton: function () {
        this.createOrUpdateTweetButton();
        $("#prettyGoodComputerSharingStation").toggle("slow", "linear");
    },//end shareButton
    shareUrl: function () {
        var code = this.editor.getValue().replace(/(?:\r\n|\r|\n)/g, "_");
        console.log("getting url: " + code);
        //if ("" === code) {
        //    return window.location.href;
        //} else {
        //    return window.location.href + "?" + code;
        //}
        return code;
    },//end ShareUrl
    breakButton: function () {
        this.brk = true;
    },//end breakButton
    runProgramButton: function () {
        console.log(this);
        this.brk = false;
        var programCode = this.editor.getValue().toLowerCase();
        var tokens = this.tokenize(programCode);
        var msgs = this.lint(tokens);
        if ("" !== msgs[0]) {
            $("#prettyGoodComputerCompilerMessages").html("<h4>Errors:</h4><p>" + msgs[0] + "</p><h4>Warnings:</h4><p>" + msgs[1] + "</p>");
        } else {
            if ("" !== msgs[1]) {
                $("#prettyGoodComputerCompilerMessages").html("<h4>Warnings:</h4><p>" + msgs[1] + "</p>");
            }
            this.run(tokens);
        }
        this.createOrUpdateTweetButton();
    },//end runProgramButton
    run: function (tokens) {
        var counter = 0;
        var i = 0;
        var that = this;
        var interval = window.setInterval(function () {
                i = that.executeInstruction(tokens, i);
                if (that.brk || i == tokens.length) {
                    console.log("clearing interval");
                    window.clearInterval(interval);
                }//end if
            }, //end anon func
            333); //end window.setInterval

    },//end run
    executeInstruction: function (tokens, i) {
        var token = tokens[i];
        console.log(token);
        console.log(i);
        this.editor.gotoLine(i + 1);
        var address;
        var address1;
        var address2;
        var destination;
        var val;
        var val1;
        var val2;
        var instruction = token.substr(0, 1);
        if ("z" == instruction) {
            address = parseInt(token.substr(1), 10);
            $(".okMemory." + address).val("0");
        } else if ("i" == instruction) {
            address = parseInt(token.substr(1), 10);
            val = parseInt($(".okMemory." + address).val(), 10);
            $(".okMemory." + address).val(val + 1);
        } else if ("j" == instruction) {
            vars = token.substr(1).split("!");
            address1 = parseInt(vars[0], 10);
            val1 = parseInt($(".okMemory." + address1).val(), 10);
            var vars2 = vars[1].split(")");
            address2 = parseInt(vars2[0], 10);
            val2 = parseInt($(".okMemory." + address2).val(), 10);
            destination = vars2[1];
            if (val1 !== val2) {
                i = destination - 2;
            }
        }
        i += 1;
        return i;
    },//end executeInstruction
    lint: function (tokens) {
        var msgs = "";
        var warnings = "";
        var initializedMemory = [];
        var wholeNumRegEx = new RegExp('^[0-9]+$');
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i].trim();
            if (token.substr(0, 1) == "$") {
                //this is a comment
            } else if (token.substr(0, 1) == "z") {
                //z instruction is of the form z<m> where <m> is a memory location
                //z instructions sets memory value to 0 at memory location <m>
                //test to see if memory address is whole number
                console.log(token.substr(1));
                console.log(!wholeNumRegEx.test(token.substr(1)));
                if (!wholeNumRegEx.test(token.substr(1))) {
                    msgs += "line " + (i + 1) + ": " + token + " refers to non-whole number memory location: " + token.substr(1) + "<br/>";
                }
                //test to see if memory address is between 0 and max memory location
                else if (parseInt(token.substr(1), 10) < 0 || parseInt(token.substr(1), 10) >= this.addressableMemory) {
                    msgs += "line " + (i + 1) + ": " + token + " refers to a memory address " + token.substr(1) + " which is outside the addressable range of 0 to " + (this.addressableMemory - 1) + "<br/>";
                }
                //we keep track of initialized memory locations
                initializedMemory.push(token.substr(1));
            } //end z case
            else if (token.substr(0, 1) == "i") {
                //i instruction is of the form i<m> where <m> is a memory location
                //i instruction increments memory location <m>
                //test to see if memory address is whole number
                if (!wholeNumRegEx.test(token.substr(1))) {
                    msgs += "line " + (i + 1) + ": " + token + " refers to non-whole number memory location: " + token.substr(1) + "<br/>";
                }
                //test to see if memory address is between 0 and max memory location
                else if (parseInt(token.substr(1), 10) < 0 || parseInt(token.substr(1), 10) >= this.addressableMemory) {
                    msgs += "line " + (i + 1) + ": " + token + " refers to a memory address " + token.substr(1) + " which is outside the addressable range of 0 to " + (this.addressableMemory - 1) + "<br/>";
                } else {
                    //test to see if memory address is initialized
                    var isInitialized = false;
                    for (var memory = 0; memory < initializedMemory.length; memory++) {
                        if (token.substr(1) == initializedMemory[memory]) {
                            isInitialized = true;
                            break;
                        }
                    }
                    if (!isInitialized) {
                        warnings += "line " + (i + 1) + ": " + token + " is attempting to increment uninitialized memory location " + token.substr(1) + ".  This may result in undesirable operations<br/>";
                    }
                }
            } //end i case
            else if (token.substr(0, 1) == "j") {
                //break instruction into memory locations
                //j instruction is of the form j<m>!<n>)<o> where <m> is a memory address, <n> is a memory address and <o> is a line number
                //j instruction compares memory location <m> with memory location <n> and if they are not equal, goes to line of code <o> otherwise continues to the next line of code
                if (token.indexOf("!") >= 0 && token.indexOf(")") >= 0 && token.indexOf("!") < token.indexOf(")") && token.length >= 6) {
                    var vars = token.substr(1).split("!");
                    var vars2 = vars[1].split(")");
                    var address1 = parseInt(vars[0], 10);
                    var address2 = parseInt(vars2[0], 10);
                    var destination = parseInt(vars2[1], 10);
                    //test to see if address 1 is a whole number
                    if (!wholeNumRegEx.test(vars[0])) {
                        msgs += "line " + (i + 1) + ": " + token + " refers to non-whole number memory location: " + address1 + "<br/>";
                    }
                    // test to see if address 1 is between 0 and the max addressable memory
                    else if (address1 < 0 || address1 >= this.addressableMemory) {
                        msgs += "line " + (i + 1) + ": " + token + " refers to a memory address " + address1 + " which is outside the addressable range of 0 to " + (this.addressableMemory - 1) + "<br/>";
                    }
                    //test to see if address 2 is a whole number
                    if (/\D+/.test(vars2[0])) {
                        msgs += "line " + (i + 1) + ": " + token + " refers to non-whole number memory location: " + address2 + "<br/>";
                    }
                    // test to see if address 2 is between 0 and the max addressable memory
                    else if (address2 < 0 || address2 >= this.addressableMemory) {
                        msgs += "line " + (i + 1) + ": " + token + " refers to a memory address " + address2 + " which is outside the addressable range of 0 to " + (this.addressableMemory - 1) + "<br/>";
                    }
                    //test to see if the destination line number is a whole number
                    if (!wholeNumRegEx.test(vars2[1])) {
                        msgs += "line " + (i + 1) + ": " + token + " refers to non-whole number line of code: " + destination + "<br/>";
                    } else {
                        //test to see if the destination number is a line of code that exists
                        if (this.editor.session.getLength() < destination || 1 > destination) {
                            msgs += "line " + (i + 1) + ": " + token + " refers a line of code: '" + destination + "' that is outside the range of existing lines of code 0 to " + this.editor.session.getLength() + "<br/>";
                        }
                    }
                } else {
                    //error if we can't parse the instruction
                    msgs += "line " + (i + 1) + " is not of the proper form: jN?M>O where N, M and O are whole numbers<br/>";
                }
            }//end j case
            else {
                //error if not a recognized instruction
                msgs += "line " + (i + 1) + ": " + token + " is not a recognized instruction<br/>";
            }
        }//end for loop
        return [msgs, warnings];
    },//end lint
    tokenize: function (input) {
        return input.split("\n");
    },//end tokenize
    createOrUpdateTweetButton: function () {
        var elem = $("#prettyGoodComputerSharingStation > iframe");
        if (elem !== null) {
            elem.remove();
        }
        if(window.twttr.widgets){
            window.twttr.widgets.createShareButton("http://gunnargissel.com/pretty-good-computer", 
                document.getElementById('prettyGoodComputerSharingStation'), 
                {text:'Yay for Z-Machines!!',
                    counturl: window.location.href,
                    via:'monknomo',
                    hashtags:'coding,z-emu',
                    size:'large'});//end createShareButton
        }//end if
        parent.location.hash = "#" + this.shareUrl();
    },//end createOrUpdateTweetButton
    getUrlParameter: function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'), sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }//end if
        }//end for
    }//end getUrlParameter
};//end prettyGoodComputer definition

