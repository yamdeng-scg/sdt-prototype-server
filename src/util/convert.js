'use strict';

const convert = {};

convert.stringToNumber = function (object, keys) {
    keys.forEach((keyName) => {
        if (!isNaN(object[keyName])) {
            object[keyName] = Number(object[keyName]);
        }
    });
};

// int to bit string
convert.intToBitString = function (srcIntValue, maxBitLength) {
    let convertString = srcIntValue.toString(2);
    let resultString = convertString;
    for (let index = convertString.length; index < maxBitLength; index++) {
        resultString = '0' + resultString;
    }
    return resultString;
};

// bit string to int
convert.bitStringtoInt = function (srcString) {
    return parseInt(srcString, 2);
};

// 2 address convert to float : 0.1
// convert.twoAddressValueToFloat(16268, -13107)
// convert.twoAddressValueToFloat(16268, 52429)
convert.twoAddressValueToFloat = function (address1, address2) {
    let address1BitStr = convert.intToBitString((address1 < 0 ? (address1 & 0xFFFF) : address1), 16);
    let address2BitStr = convert.intToBitString((address2 < 0 ? (address2 & 0xFFFF) : address2), 16);
    let buffer = new ArrayBuffer(4);
    let bytes = new Uint8Array(buffer);
    bytes[0] = convert.bitStringtoInt(address1BitStr.substr(0, 8));
    bytes[1] = convert.bitStringtoInt(address1BitStr.substr(8));
    bytes[2] = convert.bitStringtoInt(address2BitStr.substr(0, 8));
    bytes[3] = convert.bitStringtoInt(address2BitStr.substr(8));
    let view = new DataView(buffer);
    return view.getFloat32();
};

// address 값을 bit string으로 return
convert.addressToBitString = function (address) {
    return convert.intToBitString(address, 16);
};

// 2 address convert to int
convert.twoAddressValueToInt = function (address1, address2) {
    return convert.bitStringtoInt(convert.intToBitString(address1, 16) + convert.intToBitString(address2, 16));
};

// address[] convert to string : [address1, address2...] ---> 'LSABC'
convert.addressArrayToString = function (addressArray) {
    if (addressArray && addressArray.length) {
        let resultString = '';
        addressArray.forEach((address) => {
            let addressBitString = convert.intToBitString(address, 16);
            let firstNumber = convert.bitStringtoInt(addressBitString.substr(0, 8));
            let secondNumber = convert.bitStringtoInt(addressBitString.substr(8));
            resultString = resultString + (firstNumber !== 0 ? String.fromCharCode(firstNumber) : '');
            resultString = resultString + (secondNumber !== 0 ? String.fromCharCode(secondNumber) : '');
        });
        return resultString;
    } else {
        return '';
    }
};

module.exports = convert;