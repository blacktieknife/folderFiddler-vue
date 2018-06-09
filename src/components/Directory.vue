<template>
    <div>
        <div v-if="selectedDirContent.length">
            <p class="panel-heading" style="padding-top:10px;height:35.5px;font-size:12px;font-weight:bold;" :fullDirPath="this.selectedDir">{{this.selectedDir}}</p>
            <div :style="{height:height, overflow:'auto'}">
                <dir-item v-for="item in selectedDirContent" :directory="item" :key="item.dir"></dir-item>  
            </div>
        </div>
        <empty-dir-item v-else :windowHeight="height"></empty-dir-item>
    </div>
        
</template>

<script>
import DirectoryItem from './DirectoryItem.vue';
import EmptyDirectory from './EmptyDirectory.vue';
import addIcon from '../helpers/addIcon.js';
const fs = require('fs');
export default {
    data(){
        return{

        }
    },
    components:{
        dirItem:DirectoryItem,
        emptyDirItem: EmptyDirectory,
    },
    props:["windowHeight"],
    computed:{
        selectedDirContent:function(){
            return this.$store.getters.selectedDirContent;
        },
        currentDir(){
            return this.$store.getters.currentDir;
        },
        selectedDir(){
            return this.$store.getters.selectedDir;
        },
        height:function(){
            return (this.windowHeight-37)+'px';
        }
    },
    watch:{
        selectedDir(val){
            this.fetchSelectedDir(val);
        }
    },
    methods:{
        fetchSelectedDir(dir){
            console.log("FETCH SELCTED DIR HAS FIRED! ", dir);
            let selectedDir;
            if(dir && dir.length && dir.endsWith(`\\`)){
                selectedDir = dir;
            } else if(dir && dir.length && dir.startsWith('\\')){
                selectedDir = dir;
            } else if(this.currentDir == dir){
                selectedDir = dir;
            } else {
                selectedDir = dir;
            }
            console.log("selected DIR in fetch seleted Dir function", selectedDir)
            fs.readdir(selectedDir,(err,data)=>{
                if(err) {
                    console.log(err)
                    this.$store.dispatch('updateSelectedDir', this.$store.getters.currentDir)
                } else {
                   const returnSelectedArray = addIcon(data).map((val)=>{
                       const returnObj = {};
                       for(let v in val){
                           returnObj['selectedDir'] = selectedDir;
                           returnObj[v] = val[v];
                       }
                       return returnObj;
                   });
                   if(typeof(returnSelectedArray) === 'object' && returnSelectedArray instanceof Array && returnSelectedArray.length > 0){
                    //this.$store.dispatch("updateSelectedDir", selectedDir);
                    console.log("UPDATED ARRAY SENDING TO UPDATE SELECTED DIR CONTENT",returnSelectedArray)   
                    this.$store.dispatch("updateSelectedDirContent",returnSelectedArray);
                   }
                }
            });

        },
    }
}
</script>

<style>

</style>
