
<template>
  <div class="has-text-light has-background-dark">
    <div class="columns is-paddingless is-marginless is-multiline" :style="{display:'flex'}">
      <ul id="dir-list" class="column is-gapless is-paddingless is-one-third-mobile is-one-third-tablet is-one-third-desktop is-one-fifth-widescreen">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            :duration="{enter:150, leave:200}"
          >
            <app-drives :drivesHeight="height" ></app-drives>
          </transition>
      </ul>
        <ul class="column is-gapless is-two-thirds-mobile is-two-thirds-tablet is-two-thirds-desktop is-four-fifths-widescreen">
           <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              duration="200"
            >
          <div class="columns is-multiline">
           
            <div class="panel column is-full is-paddingless is-marginless" :style="{height:folderShowHeight+'px', borderLeft:'1.2px solid #808080', borderBottom:'1.2px solid #808080'}">
              
              <app-directory :windowHeight="folderShowHeight"></app-directory>
    
            </div>
            <ul v-if="selectedDirContent.length > 0 && !selectedFile" class="column is-full center_content" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', overflow:'hidden'}">
        
              <app-controls-sort :windowHeight="controlsHeight"></app-controls-sort>

            </ul>
            <ul v-else-if="selectedFile.length > 0" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', width:'100%',overflow:'hidden'}">
      
              <app-controls-folder :selected="selectedFile" :height="height"></app-controls-folder>
  
            </ul>
            <ul v-else class="center_content" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', width:'100%'}">
              
              <app-empty-controls></app-empty-controls>
     
            </ul>
          </div>
          </transition> 
        </ul>
    </div>
      <app-loading-modal></app-loading-modal>
    <app-error></app-error>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import drives from './components/Drives';
import directory from './components/Directory';
import loadingModal from './components/LoadingModal';
import controls from './components/Controls';
import controlsFolder from './components/ControlsFolder';
import addIcon from './helpers/addIcon.js';
import { setTimeout, setInterval, clearInterval } from 'timers';
import emptyControls from './components/EmptyControls.vue';
import errorMessage from './components/ErrorMessage.vue';
const drivelist = require('drivelist');
const fs = require('fs');



export default {
  data () {
    return {
       loading:false,
       height:"0",
    }
  },
  methods:{
    handleResize(){
        const w = window,
        d = document,
        e=d.documentElement,
        g=d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight,
        x= w.innerWidth || e.clientWidth || g.clientWidth;
        this.height = y.toString();
        this.appWidth = x.toString();
    },
    addDots(el){
     const interval = setInterval(()=>{
         if(this.loading){
           el.innerText += '.';
         } else {
           clearInterval(interval);
         }
       },1000)      
    }
  },
  components:{
    appDrives:drives,
    appDirectory:directory,
    appControlsSort:controls,
    appControlsFolder:controlsFolder,
    appEmptyControls:emptyControls,
    appLoadingModal:loadingModal,
    appError:errorMessage
  },
  computed:{
    windowHeight:function(){
      return this.height;
    },
    currentDirContent(){
      return this.$store.getters.currentDirContent;
    },
    currentDir(){
      return this.$store.getters.currentDir;
    },
    selectedDirContent(){
      return this.$store.getters.selectedDirContent;
    },
    directoryHeight:function(){
      if(this.currentDir == 'Drives'){
        return this.height-72.59
      } else {
        return this.height-97.59
      }
    },
    selectedFile(){
      return this.$store.getters.selectedFile;
    },
    folderShowHeight:function(){
      return this.height/1.6;
    },
    controlsHeight:function(){
      return this.height-this.folderShowHeight;
    }
  },
  mounted(){
    window.addEventListener('resize', this.handleResize);
  },
  created(){
    // this.fetchDrives();
    this.$store.dispatch("fetchSortSubFolderOptions");
    this.$store.dispatch("fetchCreateFolderOptions");
    this.$store.dispatch('fetchFavorites');
    this.handleResize();
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.handleResize)
    this.currentDirContent = null;
    this.currentSelectedContent = null;
  }

}
</script>


