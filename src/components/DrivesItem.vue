<template>
    <a :class="['panel-block' ,'directory','no_selection','has-text-light', 'has-background-dark',{'is-active':activeDir}]" :style="{paddingLeft:'20px',width:'100%', border:'none'}" @click="setActiveDir(driveLetter)" @dblclick="sendDir(driveLetter)">
        <span class="panel-icon">
            <i :class="icon"></i>
        </span>
        <span :style="{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}" :title="driveLetter">{{driveLetter}}</span>
    </a>
</template>

<script>
import clearActive from '../helpers/clearActiveClass.js';
const fs = require('fs');
export default {
    data(){
        return {
            test:"AHHHH",
            activeDir:'',
        }
    },
    props:["driveLetter", "maxwidth", "icon"],
    computed:{
        currentDir(){
            return this.$store.getters.currentDir;
        },
    },
    methods:{
        sendDir(driveLetter){
            this.$store.dispatch('updateSelectedFile');
            let dir;
            if(this.currentDir === "Drives"){
                dir = driveLetter;
            } else if(this.currentDir.endsWith("\\")) {
                dir = this.currentDir+driveLetter
            } else {
                dir = this.currentDir+"\\"+driveLetter;
            }
            fs.stat(dir, (err, stats)=>{
                if(!err && stats.isDirectory()){
                    this.$store.dispatch('updateCurrentDir', dir)
                } else {
                    if(err)console.log(err.message);
                }
            })
        },
        setActiveDir(dirName){
            this.$store.dispatch('updateSelectedFile');
            const selectedDir = typeof(dirName) === 'string' && dirName.trim().length > 0 ? dirName.trim() : false;
            if(selectedDir) {
                let dir;
                if(this.currentDir === "Drives"){
                    dir=selectedDir;
                } else if(this.currentDir.endsWith('\\')){
                    dir=this.currentDir+selectedDir;
                } else {
                    dir=this.currentDir+'\\'+selectedDir;
                }
                fs.stat(dir, (err, stats)=>{
                    console.log("Dir STATS ", stats)
                    if(!err && stats.isDirectory()){
                        fs.readdir(dir,(err,data)=>{
                            if(err){
                                console.error(err.message)
                            } else {
                                if(data.length > 0){
                                    
                                    this.$store.dispatch('updateSelectedDir', dir);
                                    clearActive();
                                    document.querySelectorAll('.directory').forEach((val,i)=>{
                                        if(val.children[1].innerText == selectedDir){
                                            val.classList.add("is-active");
                                            val.classList.add("is-underlined");
                                        } else {
                                            val.classList.remove("is-active");
                                            val.classList.remove("is-underlined");
                                            val.style.border = 'none';
                                        }
                                    });

                                }
                            }
                        })
                       
                        
                    } else {
                        if(err)console.log(err.message);
                    }
                })  
            } else {
                console.error("ERR NO DIR NAME FOUDN IN SETACTIVE DIR IN THE DRIVES ITEM COMPONENT")
            }
        }
    }
}
</script>

<style>

</style>
