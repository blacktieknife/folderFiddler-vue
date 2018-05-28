<template>
    <a :class="['panel-block' ,'directory','no_selection', {'is-active':activeDir}]" :style="{width:'100%', border:'none'}" @click="setActiveDir(driveLetter)" @dblclick="sendDir(driveLetter)">
        <span class="panel-icon">
            <i :class="icon"></i>
        </span>
        <span :style="{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}" :title="driveLetter">{{driveLetter}}</span>
    </a>
</template>

<script>
export default {
    data(){
        return {
            test:"AHHHH",
            activeDir:'',
        }
    },
    props:["driveLetter", "maxwidth", "icon"],
    methods:{
        sendDir(driveLetter){
            let dir;
            if(document.getElementById("dir-list-title").innerText.trim() === "Drives"){
                dir = driveLetter;
            } else if(document.getElementById("dir-list-title").innerText.trim().endsWith("\\")) {
                dir = document.getElementById("dir-list-title").innerText.trim()+driveLetter
            } else {
                dir = document.getElementById("dir-list-title").innerText.trim()+"/"+driveLetter;
            }
            console.log("SendDir Drive Letter ", dir);
            this.$emit('getDirectory', dir);
        },
        setActiveDir(dirName){
            const selectedDir = typeof(dirName) === 'string' && dirName.trim().length > 0 ? dirName.trim() : false;
            if(selectedDir) {
                document.querySelectorAll('.directory').forEach((val,i)=>{
                    console.log(selectedDir);
                    if(val.children[1].innerText == selectedDir){
                        val.classList.add("is-active");
                        val.classList.add("is-underlined");
                    } else {
                        val.classList.remove("is-active");
                        val.classList.remove("is-underlined");
                    }
                });
                 this.$emit('showDirectory', selectedDir);
            } else {
                console.log("ERR")
            }
        }
    }
    //includes(selectedDir)
}
</script>

<style>

</style>
