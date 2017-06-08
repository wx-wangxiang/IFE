import Observer from './observer'
import Vue from './instance/vue'


const v = new Vue({
  data:{
  	d: 2,
    a: 1,
    b: {
    	c: 3
    }
  }
})


//v.$watch("a",()=>console.log("你好"));

v.$watch("b", () => console.log('ok'));

/*setTimeout(()=>{
  v.a = 4

},1000)*/

/*setTimeout(()=>{
  v.a = 5

},2000)*/

setTimeout(()=>{
	v.b = {};
}, 1000)
