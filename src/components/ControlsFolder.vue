<template>
    <li style="padding:10px">
        <div class="control is-expanded">
             <span class="is-pulled-left is-size-7" style="display:block;letter-spacing:0.6px;font-weight:bold;color:rgba(190,190,190, 0.8)">Suggested Folder Name</span><a class="delete is-pulled-right is-size-7" @click="exitActive"></a>
             <div class="input_wrapper" style="display:block;width:100%;margin-bottom:5px;">
                 <input :class="['input',computedControlSize, 'has-text-light']" :style="{width:'100%',border:'none',borderRadius:'0px',marginTop:'5px',backgroundColor:'#484848', boxShadow:'none', borderBottom:'1px solid #62666c'}" type="text" placeholder="Text input" v-model="folderName">
             </div>
        </div>
         <div class="control is-expanded">
            <div class="input_wrapper" style="display:block;width:100%;">
                <span>
                    <button :class="['button', computedControlSize,'is-primary']" style="line-height:0;max-height:33px;" @click="createNewFolder"><i class='fas fa-folder' style="font-size:13px;"></i>&nbsp;Create Folder</button>
                </span>
                <span style="margin-left:15px;">
                    <button :class="['button', computedControlSize,'is-info']" style="line-height:0;max-height:33px;" @click="openFolderOptionModal"><i class='fas fa-question-circle' title="Subfolder Options" style="font-size:16px;"></i></button> 
                </span>
                <label class="checkbox lightHover no_selection">
                    <strong>(</strong><input type="checkbox" id='moveFile' v-model="moveFileCheck">
                    <small title="Include the selected file in new folder">Include File</small><strong>)</strong>
                </label>
                <label class="checkbox lightHover no_selection" >
                    <strong>(</strong><input type="checkbox" style="line-height:15px;" id='movesimilarFiles' v-model="findSimilarFilesCheck">
                    <small title="Include files with same order number in new folder">Include Similar</small><strong>)</strong>
                </label>
            </div>
        </div>
        <div id="subzfolderModal" :class="['modal',{'is-active':subFolderModal}]">
            <folder-options-modal @closeModal="handleCloseModal" process="createFolder"></folder-options-modal>
        </div>
    </li>
</template>

<script>
import subFolderOptionModal from './SubFolderOptionsModal';
import {ipcRenderer} from "electron";
export default {
    data(){
        return{
          folderName:"",
          subFolderModal:false,
          moveFileCheck:false,
          findSimilarFilesCheck:false,
        }
    },
    props:['height'],
    computed:{
        computedControlSize(){
            if(this.height > 1000){
                return 'is-large';
            } else if(this.height > 400){
                return 'is-medium';
            } else {
                return 'is-small';
            }
        },
        selected(){
            return this.$store.getters.selectedFile;
        }
    },
    components:{
        folderOptionsModal:subFolderOptionModal
    },
    watch:{
        moveFileCheck(val){
              window.localStorage.setItem("moveFileOption", this.moveFileCheck);
        },
        findSimilarFilesCheck(val){
             window.localStorage.setItem("moveSimilarFilesOption", this.findSimilarFilesCheck);
        },
        selected(val){
            this.folderName = this.parseFolderName(val);
        }
    },
    methods:{
        exitActive(){
            this.$store.dispatch('updateSelectedFile');
            document.querySelectorAll('.shownFile').forEach((val,i)=>{
                val.classList.remove('is-active');
            })

        },
        parseFolderName(name){
             const reggie = /^(\d{4,})([-\.\d]+)*\s*(.*)\s*(so|spi|po)\s*([\$\d]+|.+)*\.(\w+)$/i;
            //index 0 = full matched string
            //index 1 = order number
            //index 2 = sub order number
            //index 3 = job name
            //index 4 = so , spi, or po
            //index 5 = $ dollar amount
            //index 6 = file extention
            const match = name.match(reggie);
            if(match){
                return ((match[3] || "").trim()+" "+(match[5] || "").trim()+" "+(match[1] || "").trim()).replace(/\s{2,}/g, " ");
            } else {
                const revesedFileName = name.split("").reverse().join("");
                const removedExt = revesedFileName.split(".",1).join("").split("").reverse().join("")
                return name.replace(`.${removedExt}`, "").replace(/\s{2,}/g, " ").trim();
            }
        },
        openFolderOptionModal(){
            this.subFolderModal = true;
        },
        handleCloseModal(){
            this.subFolderModal = false;
        },
        createNewFolder(){
            const newFolderObj = {
                dir:this.$store.getters.selectedDir,
                file:this.$store.getters.selectedFile,
                folderName:this.folderName,
                moveFile:this.moveFileCheck,
                moveSimilar:this.findSimilarFilesCheck,
                subFolders:this.$store.getters.createOptions
            }
            ipcRenderer.send("createNewFolder", newFolderObj);
        }
    },
    created(){
        const moveFileOption = window.localStorage.getItem("moveFileOption");
        const moveSimilarFilesOption = window.localStorage.getItem("moveSimilarFilesOption");
        if(moveFileOption !== null){
            this.moveFileCheck = (moveFileOption == 'true');  
        } 
        if(moveSimilarFilesOption !== null){
            this.findSimilarFilesCheck = (moveSimilarFilesOption == 'true');
        }
        this.folderName = this.parseFolderName(this.$store.getters.selectedFile);
    }
    
}
</script>

<style>

</style>
