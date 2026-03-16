function limitarInput() {
var input = getdocument.getElementByLabel('formCalc')
if (input.value.length > 2) {
    input.value = input.value.slice(0, 2);
}
}
document.getElementById("penaAnos").onkeypress = function(e) {
         var chr = String.fromCharCode(e.which);
         if ("1234567890".indexOf(chr) < 0)
           return false;
       };
document.getElementById("penaMeses").onkeypress = function(e) {
         var chr = String.fromCharCode(e.which);
         if ("1234567890".indexOf(chr) < 0)
           return false;
       };
document.getElementById("penaDias").onkeypress = function(e) {
         var chr = String.fromCharCode(e.which);
         if ("1234567890".indexOf(chr) < 0)
           return false;
       };
document.getElementById("detracaoDias").onkeypress = function(e) {
         var chr = String.fromCharCode(e.which);
         if ("1234567890".indexOf(chr) < 0)
              return false;
        };
       
