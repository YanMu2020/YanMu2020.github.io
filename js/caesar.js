'use strict';

var LOWER = 'abcdefghijklmnopqrstuvwxyz';

var lowercase = function(str) {
    var result = str.toLowerCase();
    return result;
}

var caesar = function(str, shift, method) {
    var result = '';
    var code = lowercase(str);
    for (var i = 0; i < code.length; i++) {
        var index = LOWER.indexOf(code[i]);
        if (index >= 0) {
            if (method == 'enc') {
                var shiftindex = (index + shift) % 26;
            }
            if (method == 'dec') {
                var shiftindex = (index + 26 - shift) % 26;
            }
            result += LOWER[shiftindex];
        } else {
            result += code[i];
        }
    }
    return result;
}

var crypt = function(method) {
    var todo = document.getElementById("todo").value;
    var shift = document.getElementById("shift").value;
    document.getElementById("processed").value = caesar(todo, parseInt(shift), method);
}

var crack = function() {
    var todo = document.getElementById("todo").value;
    var result = '';
    for (var i = 0; i < 26; i++) {
        result += '偏移量' + i + '：' + caesar(todo, i, 'dec') + '\n\n';
    }
    document.getElementById("processed").value = result;
}

var encryptButton = document.querySelector("#encrypt");
encryptButton.addEventListener("click", function() {
    crypt('enc');
});

var decryptButton = document.querySelector("#decrypt");
decryptButton.addEventListener("click", function() {
    crypt('dec');
});

var crackButton = document.querySelector("#crack");
crackButton.addEventListener("click", crack);

var intelButton = document.querySelector("#intel");
intelButton.addEventListener("click", function() {
    alert('开发中');
});