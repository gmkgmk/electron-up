var ref=require('ref');
var FFI = require('ffi');


try {
 // 你现在的代码放进来
 var func = FFI.Library('YLE300_API', {
   'YLE300_Open':['int32',['int32']],
   'YLE300_SetTrack2Density': ['int32', ['int32']],
   'YLE300_Read': ['int32', ['int32','string']],
   'YLE300_SetShowDialog': ['int32', ['int32']]
});

var ComPort = 0;   //端口号
var n=func.YLE300_Open(ComPort);
console.log("open: "+n);
if(n==0)
{
	func.YLE300_SetTrack2Density(0);
	 var ReadBuf='1100043200=3631062';
	  //var val2= ref.alloc(ref.types.int,36);
	  var val2=ref.allocCString('1111111111111111110');
	// func.YLE300_SetShowDialog(1);       
	 //Open Success 
	 var iRead = func.YLE300_Read(2, val2);
	 console.log("read: "+iRead);
	 //console.log(val2.toGMTString);
	 if(iRead==0) {
	  
	  //ReadBuf = ref.readPointer(val2, 0, ReadBuf.length);
	  ReadBuf = ref.readCString(val2, 0);
	  console.log(ReadBuf.length);
	  console.log("success  contents: "+ReadBuf);
	 }
	 else {
	 console.log(iRead);
	 console.log("error");
	 }
}


//console.log(n);
} catch (e) {
 console.log(e);
}

