
<template>
  <div class="has-text-light has-background-dark">
    <div class="columns is-paddingless is-marginless is-multiline" :style="{display:'flex'}">
      <ul id="dir-list" class="column is-gapless is-paddingless is-one-third-mobile is-one-third-tablet is-one-third-desktop is-one-fifth-widescreen">
          <app-drives :drivesHeight="height" ></app-drives>
      </ul>
        <ul class="column is-gapless is-two-thirds-mobile is-two-thirds-tablet is-two-thirds-desktop is-four-fifths-widescreen">
          <div class="columns is-multiline">
            <div class="panel column is-full is-paddingless is-marginless" :style="{height:folderShowHeight+'px', borderLeft:'1.2px solid #808080', borderBottom:'1.2px solid #808080'}">
                <app-directory :windowHeight="folderShowHeight"></app-directory>
            </div>
            <ul v-if="currentDirContent.length > 0 && !selectedFile" class="column is-full center_content" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', overflow:'hidden'}">
              <app-controls-sort :windowHeight="controlsHeight"></app-controls-sort>
            </ul>
            <ul v-else-if="selectedFile" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', width:'100%',overflow:'hidden'}">
              <app-controls-folder :selected="selectedFile" :height="height"></app-controls-folder>
            </ul>
            <ul v-else class="center_content" :style="{borderLeft:'1.2px solid #808080',height:controlsHeight+'px', width:'100%'}">
              <app-empty-controls></app-empty-controls>
            </ul>
          </div>
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
  name: 'test',
  data () {
    return {
       selectedView:"all",
      //  currentDir: 'Drives',
      //  currentDirContent:[],
       
       loading:false,
      //  selectedDirContent:[],
       height:"0",
    }
  },
  methods:{
    handleResize(){
      console.log("resize EVENT");
        const w = window,
        d = document,
        e=d.documentElement,
        g=d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight,
        x= w.innerWidth || e.clientWidth || g.clientWidth;
        console.log("New X and Y ", x, y)
        this.height = y.toString();
        this.appWidth = x.toString();
    },
    addDots(el){
     const interval = setInterval(()=>{
       console.log("DOTS IS RUNNING");
         if(this.loading){
           el.innerText += '.';
         } else {
           clearInterval(interval);
         }
       },1000)      
    },

    // passSelectedDirContent(dirArr){
    //   console.log("array made it back to app ", dirArr);
    //   this.selectedDirContent = [];
    //   this.selectedDirContent = dirArr;
    // },
    handleNewDir(path){
      console.log("PATH FROM HANDEL NEW DIR", path)
      console.log("THIS CURRENT DIR",this.$store.getters.currentDir)
      console.log("THIS Selected DIR",this.$store.getters.selectedDir)
      this.$store.dispatch('updateCurrentDir');
      this.$store.dispatch('updateSelectedDirContent');
    },
    // sortFunction(){
    //  const findSORegEx = /^(\d{4,})([-\.\d]+)*\s*(.*)\s*(so|spi|po)\s*([\$\d]+|.+)*\.(\w+)$/i;
    //  const seen = [];
    //  this.selectedFolderContent.forEach((val)=>{
    //    const match = val.dir.match(findSORegEx);
    //    //index 0 = full matched string
    //    //index 1 = order number
    //    //index 2 = sub order number
    //    //index 3 = job name
    //    //index 4 = so , spi, or po
    //    //index 5 = $ dollar amount
    //    //index 6 = file extention
    //    if(match && !seen.hasOwnProperty(match[1])){
    //      const orderNum = match[1] && typeof(parseInt(match[1])) === 'number' && parseInt(match[1]) > 0 ? match[1] : false;
    //      const jobName = match[3] && typeof(match[3]) === "string" && match[3].length > 0 ? match[3] : false;
    //      const orderType = match[4] && typeof(match[4]) === 'string' && match[4].length > 0 ? match[4] : false;
    //      const fileExtension = match[6] && typeof(match[6]) === 'string' && match[6].length > 0 ? match[6] : false;
    //      const dollarAmount = match[5] && typeof(match[5]) === 'string' && match[5].length > 0 ? match[5] : '$0';
    //      //console.log(orderNum,jobName,orderType,fileExtension,dollarAmount);
    //      if(orderNum && orderType.toLowerCase() === "so" && jobName && fileExtension){
    //        seen[orderNum] = {
    //          fullFileName: match[0].trim(),
    //          jobName:jobName.trim().replace("  ", " "),
    //          orderType:orderType.toUpperCase().trim(),
    //          dollarAmount:dollarAmount.trim(),
    //          fileExtension:fileExtension.trim()
    //        }
    //      } else if(orderNum && orderType.toLowerCase() === "spi" && jobName && fileExtension) {
    //       seen[orderNum] = {
    //          fullFileName: match[0].trim(),
    //          jobName:jobName.trim().replace("  ", " "),
    //          orderType:orderType.toUpperCase().trim(),
    //          dollarAmount:'$0',
    //          fileExtension:fileExtension.trim()
    //        }
    //      } else if(orderNum && orderType.toLowerCase() === "po" && jobName && fileExtension){
    //        seen[orderNum] = {
    //          fullFileName: match[0].trim(),
    //          jobName:jobName.trim().replace("  ", " "),
    //          orderType:orderType.toUpperCase().trim(),
    //          dollarAmount:'$0',
    //          fileExtension:fileExtension.trim()
    //        }
    //      } else {
    //        alert("ERROR COULD NOT VALIDATE FILENAME IN SORT FUNCTION");
    //      }
    //    }
    //  })
    //  const copyArray = [];
    //  const newFolderArray = [];
    //  for(let folder in seen){
    //    const path = `${this.selectedFolder}/${seen[folder].jobName+' '+seen[folder].dollarAmount+' '+folder}`;
    //    console.log("THE PATH",path)
    //     newFolderArray.push(path);
    //     this.selectedFolderContent.forEach((item)=>{
    //       const getOrderNum = /^\d{4,}/;
    //       const regExFullFileName = /^(\d{4,})([-\.\d]+)*\s*(.+)\s*(so|spi|po|jpg|jpeg)+\s*([\$\d]+|.+)*\.(\w+)$/i;
    //       if(item.dir.match(getOrderNum) && item.dir.match(getOrderNum)[0] == folder){
    //         const fullNameParse = item.dir.match(regExFullFileName);
    //         let subFolder = "";
    //         if(fullNameParse){
    //           if(fullNameParse[4]){
    //             if(fullNameParse[4].toLowerCase() == 'so'){
    //               subFolder = '/Sales Order';
    //             } else if(fullNameParse[4].toLowerCase() == 'po' || fullNameParse[4].toLowerCase() == 'spi'){
    //               subFolder = '/Production';
    //             } else if(fullNameParse[4].toLowerCase() == 'jpg' || fullNameParse[4].toLowerCase() == 'jpeg'){
    //                subFolder = '/Art';
    //             } else if(item.dir.endsWith('.jpg') || item.dir.endsWith('.jpeg')){
    //               subFolder = '/Art';
    //             }
    //           } else if(fullNameParse[6]){
    //             if(fullNameParse[6].toLowerCase() == 'jpg' || fullNameParse[6].toLowerCase() == 'jpeg'){
    //               subFolder = "/Art";
    //             } else if(fullNameParse[6].toLowerCase() == 'pdf'){
    //               subFolder = "/Production";
    //             } else if(fullNameParse[6].toLowerCase() == 'xlsx'){
    //               subFolder = "/Sales Order";
    //             }
    //           }
    //         }
    //        copyArray.push({read:`${this.selectedFolder}/${item.dir}`, write:path + subFolder + '/' + item.dir});
    //       } 
    //     })  
    //   }
    //   const modal = document.querySelector('#loadingModal');
    //   if(newFolderArray.length > 0) {
    //     this.loading = true;
    //     modal.classList.add('is-active');
    //     document.querySelector('#loadingText').innerHTML = 'Creating Folders';
    //     this.addDots(document.querySelector('#loadingText'));
    //     this.batchNewDirectories(newFolderArray).then((foldersArr)=>{
    //       console.log("ALL DIRECTORYS MADE");
    //       document.querySelector('#loadingText').innerHTML = 'Copying Files';
    //       if(copyArray.length > 0) {    
    //        return this.batchCopy(copyArray);
    //       }
    //     }).then(copies=>{
    //       console.log("ALL COPIES COMPLETE");
    //       document.querySelector('#loadingText').innerHTML = 'Cleaning up old files';
    //       return this.batchRemove(copies);
    //     }).then(()=>{
    //       console.log("All old files successfully removed");
    //       document.querySelector('#loadingText').innerHTML = 'Done';
    //       setTimeout(()=>{
    //         modal.classList.remove('is-active');
    //         document.querySelector('#loadingText').innerHTML = 'Loading';
    //         this.fetchDir(this.selectedFolder, true);
    //         this.loading = false;
    //       },1000)
    //     }).catch(err=>{
    //        document.querySelector('#loadingText').innerHTML = 'Loading';
    //       this.loading = false;
    //       console.log("ERROR IN CREATENEWDIRECTORY FUNCTION", err)
    //       modal.classList.remove('is-active');
    //       alert("Error in sorting of files. Please check directory");

    //     })
    //   } else {
    //     modal.classList.remove('is-active');
    //     alert("No Items match criteria to sort");
    //   }
    // },
    // batchCopy(arr){
    //   return new Promise((resolve,reject)=>{
    //     arr.forEach((item,i)=>{
    //      setTimeout(()=>{
    //       const read = fs.createReadStream(item.read);
    //       const write = fs.createWriteStream(item.write);
    //         read.pipe(write);
    //         write.on('error', (err)=>{
    //           reject(err);
    //         })
    //         write.on('finish', ()=>{
    //           console.log("finished Write stream");
    //           if(arr.length-1 == i){
    //               console.log("FINSIHED ALL WRITES")
    //               resolve(arr);
    //           } 
    //         })
    //       },5000) 
    //     })
    //   })
    // },
    // batchRemove(arr){
    //   return new Promise((resolve, reject)=>{
    //     arr.forEach((item,i)=>{
    //       fs.unlink(item.read, (err)=>{
    //         if(err) reject(err);
    //         if(arr.length-1 == i){
    //           resolve();
    //         }
    //       })
    //     })
    //   })
    // },
    // batchNewDirectories(arr){
    //   return new Promise((resolve, reject)=>{
    //     const subFolders = ['Art', 'Sales Order', 'Production'];
    //     document.querySelectorAll('.subfolderChecks').forEach((val)=>{
    //       if(val.checked){
    //         subFolders.push(val.value)
    //       }
    //     })
    //     console.log("SUBFOLDER ARRAY", subFolders);
    //     const promiseArray = arr.map((item,i)=>{
    //       return new Promise((res, rej)=>{
    //         fs.mkdir(item, (err)=>{
    //           if(err) reject(err);
    //           subFolders.forEach((folder)=>{
    //             fs.mkdir(item+'/'+folder, (err)=>{
    //                 if(err) reject(err);
    //                 if(arr.length-1 == i){
    //                   resolve(arr)
    //                 }
    //               })
    //           })
    //         })
    //       })
    //     })

    //   })
    // },
    // showSelectedFile(selectedFile){
    //   this.selectedFile = "";
    //   const file = typeof(selectedFile) === "string" && selectedFile.length > 0 && this.selectedFolder.length > 0 ? this.selectedFolder+'/'+selectedFile : false;
    //   if(file){
    //     fs.stat(file, (err, stats)=>{
    //       if(err) return alert(err.toString());
    //       if(!stats.isDirectory()){
    //         console.log("FILE IS NOT A DIRECTORY");
    //         document.querySelectorAll(".shownFile").forEach((val)=>{
    //           console.log("all .shownFIles value", val)
    //           if(val.innerText.replace('  ', ' ').trim() == selectedFile.replace('  ', ' ').trim()){
    //             console.log("THERE IS A MATCH", val)
    //             val.classList.add('is-active');
    //             val.style.borderLeft = '2.5px solid blue';
    //             val.style.backgroundColor = 'rgba(0,255,0,0.3)';
    //             this.selectedFile = selectedFile;
    //           } else {
    //            // console.log("NOT MATCH", val)
    //             val.classList.remove('is-active');
    //             val.style.borderLeft = '';
    //             val.style.backgroundColor = '';
    //           }
    //         })
    //       } else {
    //         console.log("FILE IS A DIRECTORY");
    //       }
    //     })
    //   } else {
    //    this.selectedFile = "";
    //    document.querySelectorAll(".is-active").forEach((val)=>{
    //      val.classList.remove('is-active')
    //       val.style.borderLeft = '';
    //       val.style.backgroundColor = '';
    //    })
    //   }
    // },
    // showSelectedDir(dir){
    //   this.showSelectedFile();
    //   const selectedDir = typeof(dir) === "string" && dir.trim().length > 0 && dir.trim().endsWith('\\') ? dir.trim() : this.currentDir+'/'+dir;
    //   this.fetchDir(selectedDir, true);
    //   console.log(selectedDir)
    // },
    // refresh(){
    //   this.showSelectedFile();
    //   this.fetchDir(this.currentDir);
    // },
    // goBack(){
    //   this.showSelectedFile();
    //   console.log(this.currentDir);
    //   if(this.currentDir !== 'Drives' && this.currentDir.length > 3){
    //     if(!this.currentDir.includes('/')) {
    //       this.currentDir = this.currentDir.substring(0,3);
    //       this.fetchDir(this.currentDir.substring(0,3))
    //     } else {
    //       const dirArr = this.currentDir.split("/")
    //       let returnStr = '';
    //       console.log("Dir arr ", dirArr);
    //         dirArr.splice(-1, 1);
    //       if(dirArr.length > 1){
    //         returnStr = dirArr.join("/");
    //       } else {
    //         returnStr = dirArr[0];
    //       }
    //       this.fetchDir(returnStr);
    //     }
    //   } else {
    //     this.fetchDrives();
    //   }
    // },
    // fetchDir(dir, selectedFolder){
    //  this.showSelectedFile();
    //   console.log("DIR Sent TO FETCH Dir ",dir);
    //   fs.readdir(`${dir}`, (err, data)=>{
    //     if(err){
    //       if(err.message.includes("not a directory")){
    //         console.log('NOT A DIRECTORY');
    //         return false;
    //       } else {
    //         console.log("ERROR IN FETCH DIR FUNCTION",err.message)
    //       }  
    //     } else {
    //       const dirContentArray = addIcon(data);
    //       if(!selectedFolder){
    //         this.currentDir = dir;
    //         this.currentDirContent = dirContentArray;
    //         this.selectedFolderContent = [];
    //       } else {
    //         this.selectedFolder = dir;
    //         this.selectedFolderContent = dirContentArray;
    //       }
    //     }
    //   });
    // },
    // fetchDrives(){
    //   console.log("Fetch drives function Fired!")
    //   this.showSelectedFile();
    //   drivelist.list((error, drives) => {
    //     if (error) {
    //       throw error;
    //     }
    //     this.currentDir = "Drives";
    //     this.currentDirContent = [];
    //     drives.forEach((drive) => {
    //       this.currentDirContent.push({dir:drive.mountpoints[0].path, icon:'fas fa-hdd'});
    //     });
    //   });
    // }
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
    suggestedFolderName:function(){
      const reggie = /^(\d{4,})([-\.\d]+)*\s*(.*)\s*(so|spi|po)\s*([\$\d]+|.+)*\.(\w+)$/i;
       //index 0 = full matched string
       //index 1 = order number
       //index 2 = sub order number
       //index 3 = job name
       //index 4 = so , spi, or po
       //index 5 = $ dollar amount
       //index 6 = file extention
       const match = this.selectedFile.match(reggie);
      if(match){
        return match[3].replace("  ", " ").trim()+" "+match[5].trim()+" "+match[1].trim();
      } else {
        const revesedFileName = this.selectedFile.split("").reverse().join("");
        const removedExt = revesedFileName.split(".",1);
        console.log("NEW NAME!!!!!!",removedExt);
        //return this.selectedFile.replace("  ", " ").trim();
      }
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
    },
    loadingText:function(){

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


