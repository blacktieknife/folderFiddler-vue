<template>
    <nav class="panel">
        <p class="panel-heading" style="font-weight:bold;font-size:0.85em;" :dirName="this.currentDir"> 
            <span id='dir-list-title' class="column is-paddingless" :style="{
            display:'block', 
            maxWidth:'97%', 
            color:'#64676f',
            whiteSpace:'nowrap', 
            overflow:'hidden', 
            textOverflow:'ellipsis', 
            marginBottom:'5px',
            fontSize:'12px'
            }" 
            :title="currentDir">{{this.currentDir}}
            </span>
        </p>
        <p class="panel-block is-paddingless is-marginless has-text-light columns" style="border:none;border-bottom:2.3px solid #333; text-align:center; display:flex; justify-content: space-around;">
            <span id="dir-list-back" class="column is-paddingless" title="Back">
                <template v-if="currentDir !== 'Drives'">
                <i class="fas fa-chevron-circle-left" style="cursor:pointer;" @click="goBack"></i>
                </template>
                <template v-else>
                    <i class="fas fa-chevron-circle-left" style="cursor:not-allowed;color:rgba(96,96,96, 0.6)"></i>
                </template>
            </span>
            <span id="dir-list-refresh" class="column is-paddingless" title="Refresh">
                <i class="fas fa-sync-alt" style="cursor:pointer;" @click="refreshDrives"></i>
            </span>
            <span id="dir-list-fav" class="column is-paddingless">
                <template v-if="selectedDir && currentDir !=='Drives'">
                    <template v-if="containsFav">
                        <i class="fas fa-star" style="cursor: pointer;" @click="removeFavorite" :title="`Remove Favorite ${selectedDir}`"></i>
                    </template>
                    <template v-else>
                            <i class="far fa-star" style="cursor: pointer;" @click="addFavorite" :title="`Favorite ${selectedDir}`"></i>
                    </template>
                </template>
                <template v-else-if="selectedDir.length > 3">
                    <template v-if="containsFav">
                        <i class="fas fa-star" style="cursor: pointer;" @click="removeFavorite" :title="`Remove Favorite ${selectedDir}`"></i>
                    </template>
                    <template v-else>
                            <i class="far fa-star" style="cursor: pointer;" @click="addFavorite" :title="`Favorite ${selectedDir}`"></i>
                    </template>
                </template>
                <template v-else>
                    <i class="fas fa-star" style="cursor:not-allowed;color:rgba(96,96,96, 0.6)"></i>
                </template>
            </span>
        </p>   

        <!-- <p class="panel-tabs">
            <a class="is-active">All</a>
            <a>Local</a>
            <a>Networked</a>
        </p> -->
        <div v-if="this.currentDirContent.length > 0" id="dir-items" :style="{height:navPanelHeight, overflowX:'auto',}">
             <div v-if="currentDir =='Drives'" style="padding:5px;font-size:13px;">Drives</div>
   
        <app-drives-item v-for="dir in this.currentDirContent" :key="dir.dir" :driveLetter="dir.dir" :icon="dir.icon"></app-drives-item>
     
        <div v-if="currentDir =='Drives' && favorites.length > 0" style="padding:5px;border-top:1px solid #484848;font-size:13px;">Favorites</div>
       
        <app-favorites-item v-if="currentDir =='Drives'" v-for="dir in this.favorites" :key="dir" :driveLetter="dir"></app-favorites-item>
  
        </div>
        <div v-else>
            <a class="panel-block has-text-light" v-if="this.currentDir == 'Drives'">
                <span class="panel-icon">
                    <i class="fas fa-hourglass-start"></i>
                </span>
                <span>Loading..</span>
            </a>
            <a class="panel-block" v-else>
                <span class="panel-icon">
                    <i class="fas fa-times"></i>
                </span>
                <span>No Content Found..</span>
            </a>
        </div>
    </nav>
</template>

<script>
const drivelist = require('drivelist');
const fs = require('fs');
const networkedDrives = require('windows-network-drive');
import addIcon from '../helpers/addIcon.js';
import clearActive from '../helpers/clearActiveClass.js';
import driveItem from './DrivesItem';
import favoritesItem from './FavoritesItem';
import { mapState } from 'vuex'


export default {
    data(){
        return{
    
        }
    },
    props:["drivesHeight"],
    computed:{
        favorites(){
          return this.$store.getters.favorites;
        },
        currentDir(){
            return this.$store.getters.currentDir;
        },
        currentDirContent(){
            return this.$store.getters.currentDirContent;
        },
        selectedDir(){
            return this.$store.getters.selectedDir;
        },
        containsFav(){
            if(this.selectedDir && this.favorites.includes(this.selectedDir)){
                return true;
            } else {
                return false;
            }
        },
        navPanelHeight:function(){
            return (this.drivesHeight -61.48)+'px';
        },
        navPanelWidth:function(){

        }
    },
    components:{
        appDrivesItem:driveItem,
        appFavoritesItem:favoritesItem,
    },
    methods:{
        goBack(){
            //this.showSelectedFile();
            if(this.currentDir !== 'Drives' && this.currentDir.length > 3){
                if(!this.currentDir.includes('\\')) {
                    //this.currentDir = this.currentDir.substring(0,3);
                    this.$store('updateCurrentDir', this.currentDir.substring(0,3));
                    this.fetchDir(this.currentDir.substring(0,3))
                } else {
                    const dirArr = this.currentDir.split('\\')
                    let returnStr = '';
                        dirArr.splice(-1, 1);
                    if(dirArr.length > 1){
                        returnStr = dirArr.join("\\");
                    } else {
                        returnStr = dirArr[0];
                    }
                    if(returnStr.length<3)returnStr+='\\';
                    this.fetchDir(returnStr);
                }
            } else {
                this.fetchDrives();
            }
        },
        fetchDir(dir){
            if(dir && typeof(dir) === "string" && dir.length > 0){
                clearActive();
                fs.readdir(`${dir}`, (err, data)=>{
                    if(err){
                        if(err.message.includes("not a directory")){
                            alert('NOT A DIRECTORY');
                            return false;
                        } else {
                            alert(err.message,"ERROR IN FETCH DIR FUNCTION -- ")
                        }  
                    } else {         
                        const dirContentArray = addIcon(data); //addicon returns an array of object which contain dir, & icon
                        this.$store.dispatch("updateCurrentDir",dir);
                        this.$store.dispatch("updateCurrentDirContent", dirContentArray)
                    }
                });
            }
        },
        fetchDrives(){
            clearActive();
            drivelist.list((error, drives) => {
                if (error) {
                    alert("Error in fetch drives function ", error);
                }
                const currentDirContentArr = [];
                drives.forEach((drive) => {
                    currentDirContentArr.push({dir:drive.mountpoints[0].path, icon:'fas fa-hdd'});
                });
                networkedDrives.list().then((drives)=>{
                    for(let drive in drives){
                        currentDirContentArr.push({dir:drive+":\\", icon:'fas fa-hdd'}); 
                    }
                }).catch((err)=>{
                    console.error("error in fetching networked drives ", err);
                })
                this.$store.dispatch('updateCurrentDir', 'Drives');
                this.$store.dispatch('updateCurrentDirContent',currentDirContentArr);
            });
        },
        fetchFavorites(){

        },
        refreshDrives(){
            if(this.currentDir !== "Drives"){
                this.fetchDir(this.currentDir);
            } else {
                this.fetchDrives();
            }
        },
        addFavorite(){
            const selectedDir = this.selectedDir;
            this.favorites.push(this.selectedDir)
            this.$store.dispatch("updateFavorites", this.favorites);
        },
        removeFavorite(){
             const spliceIndex =  this.favorites.indexOf(this.selectedDir) !== -1 ? this.favorites.indexOf(this.selectedDir) : false;
             if(spliceIndex || spliceIndex === 0){
                this.favorites.splice(spliceIndex, 1);
                this.$store.dispatch('removeFavorite', this.favorites);
             } else {
                 console.error("MISSING INDEX",this.favorites.indexOf(this.selectedDir), "this.selectedDir", this.selectedDir);
             }
        }
    },
    watch:{
        currentDir(val){
            if(val !== "Drives"){
                this.fetchDir(val);
            } else {
                this.fetchDrives();
            }
        },
            
    },
    created(){
        this.fetchDrives();
    }
}
</script>

<style>

</style>
