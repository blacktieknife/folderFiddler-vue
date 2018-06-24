<template>
    <div>
        <li v-if="selectedDirContent.length > 0" :style="{marginBottom:'10px'}" class="center_item">
            <span>
                <a class="button is-normal is-primary" :disable="loading" @click="handleSort"><i class="fas fa-magic"></i>&nbsp;Auto Sort Directory</a>
            </span>
            <span style="margin-left:15px;">
                <a class="button is-normal is-info" title="Subfolder Options" @click="showModal"><i class="fas fa-question-circle"></i></a>
            </span>
        </li>
      <!-- <transition
            mode="out-in"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            >
            <template v-if="selectedFolderContent.length > 0">
            <li v-if="sub_folder_1" style="margin-bottom:10px;">
                <a class="button is-small" :disable="loading" @click="()=>{if(selectedFolderContent.length>0)sortFunction();}">Sort Selected Directory</a>
                <span style="padding:5px;">
                <label for="othercheck" class="checkbox">
                    <input type="checkbox" id="othercheck" class="subfolderChecks" name="othercheck" :value="otherCheckText">
                    <input type='text' id="otherCheckText" :style="{width:((otherCheckText.length+1)*6.3)+'px', border:'none', borderBottom:'1.3px solid lightgrey', cursor:'text'}" v-model="otherCheckText">
                </label>
                </span>
            </li>
            <li v-else>
                <a class="button is-small" :disable="loading">+</a>
            </li>
            </template>
            </transition> -->
            <div :class="['modal',{'is-active':subFolderModal}]">
                <folder-options-modal @closeModal="handleCloseModal" process="autoSort"></folder-options-modal>
            </div>
    </div>
                        <!-- <span style="padding:5px;">
                    <label for="othercheck" class="checkbox has-text-light">
                        <input type="checkbox" id="othercheck" class="subfolderChecks has-text-light" name="othercheck" :value="otherCheckText">
                        <input type='text' id="otherCheckText" class="has-text-light" :style="{width:((otherCheckText.length+1)*6.3)+'px', border:'none', borderBottom:'1.3px solid lightgrey', cursor:'text', backgroundColor:'inherit'}" v-model="otherCheckText">
                    </label>
                    </span>
                    <span v-if="subFolderOption_1">
                    <span style="padding:5px;">
                        <label for="othercheck2" class="checkbox">
                        <input type="checkbox" id="othercheck2" class="subfolderChecks" name="othercheck2" :value="otherCheckText2">
                        <input type='text' id="otherCheckText2" class="has-text-light" :style="{width:((otherCheckText2.length+1)*6.3)+'px', border:'none', borderBottom:'1.3px solid lightgrey', cursor:'text', backgroundColor:'inherit'}" v-model="otherCheckText2">
                        </label>
                    </span>
                    </span>
                    <span v-else>
                    <a class="button is-small is-rounded" :disable="loading" @click="()=>{subFolderOption_1 = true;lastSubFolder=true;}">+</a>
                    </span>
                    <span v-if="subFolderOption_2">
                    <span style="padding:5px;">
                        <label for="othercheck3" class="checkbox">
                        <input type="checkbox" id="othercheck3" class="subfolderChecks" name="othercheck3" :value="otherCheckText3">
                        <input type='text' id="otherCheckText3" class="has-text-light" :style="{width:((otherCheckText3.length+1)*6.3)+'px', border:'none', borderBottom:'1.3px solid lightgrey', cursor:'text', backgroundColor:'inherit'}" v-model="otherCheckText3">
                        </label>
                    </span>
                    </span>
                    <span v-else-if="lastSubFolder">
                    <a class="button is-small is-rounded" :disable="loading" @click="subFolderOption_2 = true">+</a>
                    </span> -->               
</template>

<script>
import subFolderOptionsModal from "./SubFolderOptionsModal";
import {ipcRenderer} from "electron";
const fs = require('fs');
export default {
 data(){
     return{
        otherCheckText:"Shipping",
        otherCheckText2:"Other",
        otherCheckText3:"Other",
        subFolderOption_1:false,
        subFolderOption_2:false,
        lastSubFolder:false,
        subFolderModal:false
     }
 },
 props:['windowHeight'],
 computed:{
     selectedDir(){
         return this.$store.getters.selectedDir;
     },
     selectedDirContent(){
         return this.$store.getters.selectedDirContent;
     },
     selectedFile(){
         this.folderNameInput = this.$store.getters.selectedFile;
         return this.$store.getters.selectedFile;
     },
 
 },
 components:{
     folderOptionsModal:subFolderOptionsModal
 },
 methods:{
     showModal(){
         this.subFolderModal = true;
     },
     handleCloseModal(){
         this.subFolderModal = false;
     },
     handleSort(){
         const currentSelectedDir = this.selectedDir;
         const currentSelectedDirContent = this.selectedDirContent;
         const subFolders = this.$store.getters.autoSortOptions;
         const activeSubfolders = [];
         subFolders.forEach(val=>{
             if(val.isChecked){
                 activeSubfolders.push(val.name);
             }
         });
         let passCheck = true;
         const folderOrderNumbers = [];
         currentSelectedDirContent.forEach((val)=>{
             const match = val.dir.match(/\d{3,}$/)
             if(match){
                folderOrderNumbers.push(match[0]);
             }
         })
         for(let i=0; i<currentSelectedDirContent.length; i++){
             const match = currentSelectedDirContent[i].dir.match(/^\d{3,}/);
             if(match){
                 if(folderOrderNumbers.includes(match[0])){
                     passCheck = false;
                    alert("This order number is being used by another folder "+match[0], "Error order number in-use");
                    break;
                 } 
             }
         }
        if(currentSelectedDir.length > 3 && passCheck){
           const confirmCheck = confirm(`Are you sure you want to autosort ${currentSelectedDir}?`, `Confirm autosort`);
            if(confirmCheck === true) {
                ipcRenderer.send("autoSort", currentSelectedDirContent, activeSubfolders);
            } else {
                console.log("Confrim check was false")
            }
        } 
         
     }
 }
}
</script>

<style>

</style>
