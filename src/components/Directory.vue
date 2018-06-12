<template>
    <div>
        <div v-if="selectedDirContent.length">
            <p class="panel-heading" 
                style="padding-top:10px;height:35.6px;font-size:12px;font-weight:bold;" 
                :fullDirPath="this.selectedDir"
                >
               <span class="columns">
                    <a class="column is-10" :title="this.selectedDir" style="cursor:unset; color:#64676f; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        {{this.selectedDir}}
                    </a>
                    <a class="column">
                        <div v-if="thisthingexists" :class="['dropdown',{'is-active':sortDrop}, 'is-right']" id="sortDropdown">
                            <div class="dropdown-trigger">
                                <a style="text-decoration:none; color:#64676f;" @click="sortDrop=!sortDrop">
                                sort <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </a>
                            </div>
                            <div class="dropdown-menu " id="dropdown-menu" style="min-width:10px !important;" role="menu">
                                <div class="dropdown-content is-paddingless">
                                    <a href="#" class="dropdown-item is-paddingless">
                                        <span style="padding:3px;">
                                            A-Z <i :class="['fas fa-sort-alpha-down']"></i>
                                        </span>
                                    
                                    </a>
                                </div>
                            </div>
                        </div>
                        <i class="fas fa-sync-alt" @click="refreshSelectedDir"></i>
                    </a>
               </span>
            </p>
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
import clearActive from '../helpers/clearActiveClass.js';
const fs = require('fs');
export default {
    data(){
        return{
            sortDrop:false
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
        },
        isLoading(){
            return this.$store.getters.isLoading;
        }
    },
    watch:{
        selectedDir(val){
            this.fetchSelectedDir(val);
        },
        isLoading(val){
            if(val == false){
                this.refreshSelectedDir();
            }
        }
    },
    methods:{
        fetchSelectedDir(dir){
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
            fs.readdir(selectedDir,(err,data)=>{
                if(err) {
                    console.log(err)
                } else {
                    if(data.length > 0){
                        const returnSelectedArray = addIcon(data).map((val)=>{
                            const returnObj = {};
                            for(let v in val){
                                returnObj['selectedDir'] = selectedDir;
                                returnObj[v] = val[v];
                            }
                            return returnObj;
                        });
                        if(typeof(returnSelectedArray) === 'object' && returnSelectedArray instanceof Array && returnSelectedArray.length > 0){
                            this.$store.dispatch("updateSelectedDirContent",returnSelectedArray);
                        }
                   }
                }
            });

        },
        refreshSelectedDir(){
            fs.readdir(this.selectedDir, (err,data)=>{
                if(err){
                    console.log("ERR IN REFERSH FUNCTION", err)
                } else {
                    clearActive();
                    this.$store.dispatch("updateSelectedFile");
                     const returnSelectedArray = addIcon(data).map((val)=>{
                       const returnObj = {};
                       for(let v in val){
                           returnObj['selectedDir'] = this.selectedDir;
                           returnObj[v] = val[v];
                       }
                       return returnObj;
                   });
                   if(typeof(returnSelectedArray) === 'object' && returnSelectedArray instanceof Array && returnSelectedArray.length > 0){ 
                    this.$store.dispatch("updateSelectedDirContent",returnSelectedArray);
                   }
                }
            })
        }
    }
}
</script>

<style>

</style>
