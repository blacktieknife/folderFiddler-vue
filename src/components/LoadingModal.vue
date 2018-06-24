<template>
  <transition
  enter-active-class="animated fadeIn"
  leave-class="animated fadeOut"
  leave-active-class="animated fadeOut"
  duration="200"
  >
    <div id="loadingModal" v-if="isLoading" :class="['modal','is-active']">
      <div class="modal-background"></div>
      <div class="modal-content columns">
        <div class="column is-full is-centered">
          <div class="has-text-centered has-text-light">
            <h1 id="loadingText">{{isLoading}}</h1>
            <small>This may take a few minutes depending on how many files we are sorting.</small>
          </div>
        <button class="button is-primary is-loading is-fullwidth"></button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {ipcRenderer} from "electron";
export default {
 data(){
   return{
     isLoading:false
   }
 },
 computed:{
   loading(){
      ipcRenderer.on("updateLoading", (e, arg1)=>{

      if(arg1 !== false){

        this.$store.dispatch("updateLoading", true);
      } else {

        this.$store.dispatch("updateLoading", false);
      }
      this.isLoading = arg1;
    })
   }
 },
 watch:{
   loading(val){
   },
   isLoading(val){
     console.log("isloading Changed!!!!!!!!!!!!", val);
     if(val){
       if(document.getElementById("loadingText")){
          document.getElementById("loadingText").innerText = val;
          this.addDots(document.getElementById("loadingText"));
       }
     }
   }
 },
 methods:{
    addDots(el){
     const interval = setInterval(()=>{
       console.log("DOTS IS RUNNING");
         if(this.isLoading){
           el.innerText += '.';
         } else {
           clearInterval(interval);
         }
       },1000)      
    }
 }
}
</script>

<style>

</style>
