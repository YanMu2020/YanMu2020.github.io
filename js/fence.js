'use strict';

var log = function() {
    console.log.apply(console, arguments);
}

var CN = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30,
    32, 33, 34, 35, 36, 38, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57,
    58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84,
    85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100]

var fence = function(str, shift, iscrack=false) {
    var len = str.length;
    var factor = []
    var result = '';
    if (CN.indexOf(len) !== -1) {
        for (var i = 2; i < len; i++) {
            if (len % i == 0) {
                factor.push(i);
            }
        }
        if (factor.indexOf(shift) !== -1) {
            for (var i = 0; i < shift; i++) {
                var index = i;
                for (var j = 0; j < (len/shift); j++) {
                    result += str[index];
                    index = index + shift;
                }
            }
        } else if (!iscrack) {
            result = '拆分量' + shift + '不是待处理长度' + len + '的因数，可用拆分为' + factor;
        } else {
            result = 'isnot';
        }
    } else {
        result = '待处理长度' + len + '不属于100以内的合数集（CN）';
    }
    return result
}

var crypt = function() {
    var todo = document.getElementById("todo").value;
    var shift = document.getElementById("shift").value;
    document.getElementById("processed").value = fence(todo, parseInt(shift));
}

var crack = function() {
    var todo = document.getElementById("todo").value;
    var result = '';
    for (var i = 0; i < CN.length; i++) {
        var r = fence(todo, CN[i], true);
        if (r !== 'isnot') {
            result += '拆分量' + i + '：' + r + '\n\n';
        }
    }
    document.getElementById("processed").value = result;
}

var encryptButton = document.querySelector("#encrypt");
encryptButton.addEventListener("click", function() {
    crypt();
});

var decryptButton = document.querySelector("#decrypt");
decryptButton.addEventListener("click", function() {
    crypt();
});

var crackButton = document.querySelector("#crack");
crackButton.addEventListener("click", crack);

var intelButton = document.querySelector("#intel");
intelButton.addEventListener("click", function() {
    alert('开发中');
});