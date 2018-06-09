<template>
    <a :class="['panel-block' ,'directory','no_selection','has-text-light', 'has-background-dark',{'is-active':activeDir}]" :style="{paddingLeft:'20px',width:'100%', border:'none'}" @click="setActiveDir(driveLetter)">
        <span class="panel-icon">
            <i class="fas fa-star"></i>
        </span>
        <span :style="{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}" :title="driveLetter">{{driveLetter}}</span>
    </a>
</template>

<script>
import clearActive from "../helpers/clearActiveClass.js";
const fs = require('fs');
export default {
    data(){
        return {
            test:"AHHHH",
            activeDir:'',
        }
    },
    props:["driveLetter"],
    computed:{
       
    },
    methods:{
        setActiveDir(location){
            this.$store.dispatch('updateSelectedFile');
            clearActive();
                document.querySelectorAll('.directory').forEach((val,i)=>{
                                        if(val.children[1].innerText == location){
                                            val.classList.add("is-active");
                                            val.classList.add("is-underlined");
                                        } else {
                                            val.classList.remove("is-active");
                                            val.classList.remove("is-underlined");
                                            val.style.border = 'none';
                                        }
                                    });
            console.log("FAVORTIE LOCATION",location)
            this.$store.dispatch('updateSelectedDir', location);
        }
    }
}
</script>

<style>

</style>
