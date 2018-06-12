<template>
    <a class="panel-block has-text-light has-background-dark shownFile no_selection" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;cursor:pointer;padding:10px;border:none;border-bottom:1px solid #404040;" @dblclick="newSelectedDir(directory.dir)" @click="showSelectedFile(directory.dir)" :title="directory.dir">
        <i style="color:#A8A8A8;padding-right:10px;" :class="directory.icon"></i>
        {{directory.dir}}
    </a>
</template>
<script>
const fs = require('fs');
export default {
    data(){
        return {

        }
    },
    props:['directory'],
    computed:{
        selectedFile(){
            return this.$store.getters.selectedFile;
        }
    },
    methods:{
        showSelectedFile(selectedFile){
            const selectedFilePath = this.directory.selectedDir+'\\'+selectedFile
            console.log("this.directory.selection dir in directory item component ",this.directory.selectedDir)
            console.log("selected file name sent in directory item component ",selectedFile);
            fs.stat(selectedFilePath, (err,stats)=>{
                if(err) return alert("Error check file stats",err);
                if(!stats.isDirectory()){
                     console.log(`IS NOT A DIRECTORY!! Here is the File selected`, selectedFile);
                    document.querySelectorAll('.shownFile').forEach((node)=>{
                        if(node.innerText.replace(/\s+/g, "").toLowerCase() == selectedFile.replace(/\s+/g, "").toLowerCase()){
                            console.log("Matched Element found./", node)
                            node.classList.add('is-active')
                        } else {
                            node.classList.remove('is-active')
                        }
                    })
                    const findSORegEx = /^(\d{4,})([-\.\d]+)*\s*(.*)\s*(so|spi|po)\s*([\$\d]+|.+)*\.(\w+)$/i;  
                    const match =   selectedFile.match(findSORegEx);
                    let selected;
                    if(match){
                        const suggestedFolderName = `${match[3]} ${match[5]} ${match[1]}`
                        selected = suggestedFolderName.replace(/\s{2,}/g, " ").trim();
                    } else {
                        const revesedFileName = selectedFile.split("").reverse().join("");
                        const removeExt = revesedFileName.split(".",1).join("").split("").reverse().join("");
                        selected = selectedFile.replace(`.${removeExt}`, "").trim();
                    }
                    this.$store.dispatch("updateSelectedFile", selectedFile);
                } else {
                  console.log("Selected file is a directory. do Nothing.")  
                }
            });
        },
        newSelectedDir(selectedFile){
            const newPath = this.directory.selectedDir+'\\'+selectedFile;
            console.log("DOBLUE CLICK VALUE", newPath);
            fs.stat(newPath, (err, stats)=>{
                if(err){
                    console.log(err)
                } else {
                    if(stats.isDirectory()){
                        fs.readdir(newPath, (err,data)=>{
                            if(!err){
                                if(data.length > 0){
                                    this.$store.dispatch("updateSelectedDir", newPath);
                                } else {
                                   console.log("SELECTED DIR IS EMPTY!~~~")     
                                }
                            } else {

                            }
                        })
                    }
                }
            })
        }
    }
}

</script>

<style>

</style>
