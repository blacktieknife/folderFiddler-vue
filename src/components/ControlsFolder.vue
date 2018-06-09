<template>
    <li style="padding:10px">
        <div class="control is-expanded">
             <span class="is-pulled-left is-size-7" style="display:block;font-weight:bold;">Suggested Folder Name</span><a class="delete is-pulled-right is-size-7" @click="exitActive"></a>
             <div class="input_wrapper" style="display:block;width:100%;margin-bottom:5px;">
                 <input :class="['input',computedControlSize, 'has-background-dark',' has-text-light']" :style="{width:'100%',border:'none',borderRadius:'0px',marginTop:'5px', boxShadow:'none', borderBottom:'1px solid #62666c'}" type="text" placeholder="Text input" v-model="folderName">
             </div>
        </div>
         <div class="control is-expanded">
            <div class="input_wrapper" style="display:block;width:100%;">
                <button :class="['button', computedControlSize,'is-primary']" style="line-height:0;max-height:33px;"><i class='fas fa-folder' style="font-size:13px;"></i>&nbsp;Create Folder</button>
                <button :class="['button', computedControlSize,'is-info']" style="line-height:0;max-height:33px;" @click="openFolderOptionModal"><i class='fas fa-question-circle' title="Subfolder Options" style="font-size:16px;"></i></button> 
                <label class="checkbox lightHover no_selection" title="By default these subfolders are not optional">
                    <strong>(</strong><input type="checkbox" id='moveFile' v-model="moveFileCheck">
                    <small>Include File</small><strong>)</strong>
                </label>
                <label class="checkbox lightHover no_selection" title="By default these subfolders are not optional">
                    <strong>(</strong><input type="checkbox" style="line-height:15px;" id='movesimilarFiles' v-model="findSimilarFilesCheck">
                    <small>Include Similar</small><strong>)</strong>
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
export default {
    data(){
        return{
          folderName:this.selected,
          subFolderModal:false,
          moveFileCheck:false,
          findSimilarFilesCheck:false,
        }
    },
    props:['selected', 'height'],
    computed:{
        computedControlSize(){
            if(this.height > 1000){
                return 'is-large';
            } else if(this.height > 400){
                return 'is-medium';
            } else {
                return 'is-small';
            }
        }
    },
    components:{
        folderOptionsModal:subFolderOptionModal
    },
    watch:{
        selected(val){
            this.folderName = val;
        },
        moveFileCheck(val){
              window.localStorage.setItem("moveFileOption", this.moveFileCheck);
        },
        findSimilarFilesCheck(val){
             window.localStorage.setItem("moveSimilarFilesOption", this.findSimilarFilesCheck);
        }
    },
    methods:{
        exitActive(){
            this.$store.dispatch('updateSelectedFile');
            document.querySelectorAll('.shownFile').forEach((val,i)=>{
                val.classList.remove('is-active');
            })

        },
        openFolderOptionModal(){
            this.subFolderModal = true;
        },
        handleCloseModal(){
            this.subFolderModal = false;
        }
    },
    created(){
        const moveFileOption = window.localStorage.getItem("moveFileOption");
        const moveSimilarFilesOption = window.localStorage.getItem("moveSimilarFilesOption");
        if(moveFileOption !== null){
            console.log("MOVE FILE OPTION FOUND IN LOCAL STORAGE", moveFileOption, "type", typeof(moveFileOption));
            this.moveFileCheck = (moveFileOption == 'true');  
        } 
        if(moveSimilarFilesOption !== null){
            console.log("MOVE Similar OPTION FOUND IN LOCAL STORAGE", moveSimilarFilesOption, "type", typeof(moveSimilarFilesOption));
            this.findSimilarFilesCheck = (moveSimilarFilesOption == 'true');
        }
    }
    
}
</script>

<style>

</style>
