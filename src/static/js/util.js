export default {
   install(Vue,options)
  {
    Vue.prototype.getHostUrl = function () {
      var hostUrl="http://192.168.0.200:8080/qfb";
      return hostUrl;
    },
    Vue.prototype.getCodeArray=function(codeArray,key){
      var code = [];
			for(var i=0;i<codeArray.length;i++) {
				if(codeArray[i].cList == key) {
          code.push({
						name : codeArray[i].cText,
						code : parseInt(codeArray[i].cCode)
					});
				}
			}
			return code;
    }
  }
}
