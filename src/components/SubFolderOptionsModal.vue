<template>
        <div>
            <div class="modal-background"></div>
            <div class="modal-card" style="max-width:75%">
                <header class="modal-card-head">
                <p class="modal-card-title">Modal title</p>
                <button class="delete" aria-label="close" @click="closeModal"></button>
                </header>
                <section class="modal-card-body has-background-dark">
                    <form id='subfolderOptionForm'>
                        <template v-if="process == 'autoSort'">
                            <form id="autoSortFormChecks" style="">
                                <a class="panel-block has-text-light autoSortFolderOption" v-for="subfolder in sortFolderOptions" :key="subfolder.name">
                                    <div class="columns is-full" style="width:100%">
                                        <div class="column is-9">
                                            <label class="checkbox lightHover" title="Select to include this subfolder" style="padding:10px;">
                                                <template v-if="subfolder.name == 'Art' || subfolder.name == 'Production' || subfolder.name == 'Sales Order'">
                                                    <input type="checkbox" :checked="subfolder.isChecked" disabled>
                                                    {{subfolder.name}} <small style="color:grey;">(disabled on sort)</small>
                                                </template>
                                                <template v-else>
                                                    <input type="checkbox" :id="subfolder.name" :checked="subfolder.isChecked" @click="handleCheck">
                                                    {{subfolder.name}}
                                                </template> 
                                            </label>
                                        </div>
                                        <div class="column">
                                             <div v-if="subfolder.name !== 'Art' && subfolder.name !== 'Production' && subfolder.name !== 'Sales Order'" class="is-pulled-right" title="Remove subFolder Option" style="padding-top:8px;"><a class="delete" :removeId="subfolder.name" @click="handleRemoveSortFolder"></a></div>  
                                        </div>
                                    </div>
                                </a>
                            </form>
                            <form id="autoSortFormAddFolder" @submit="handleAddSortFolderOption">
                                <div v-if="!addActive" style="text-align:center; padding:7px;">
                                    <button type="button" class="button is-small is-info" @click="addActive=!addActive"><i class="fas fa-plus"></i></button>
                                </div>
                                <div v-else style="text-align:center; padding:7px;">
                                    <input type="text" class="input" name="newFolderName" id="newFolderNameInput" v-model="formFolderName">
                                    <div style="padding:7px;">
                                         <button class="button is-small is-primary" title="Submit" :disabled="!formFolderName.length > 0">Add Sub Folder Option</button>
                                        <button type="button" class="button is-small is-danger" title="Cancel" @click="()=>{addActive=!addActive;formFolderName='';}"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                            </form>
                        </template>
                        <template v-else-if="process == 'createFolder'">
                            <form id="createFolderFormChecks" style="" v-if="createFolderOptions.length > 0">
                                <a class="panel-block has-text-light createFolderOption" v-for="subfolder in createFolderOptions" :key="subfolder.name">
                                    <div class="columns is-full" style="width:100%">
                                        <div class="column is-9">
                                            <label class="checkbox lightHover" title="Select to include this subfolder" style="padding:10px;">
                                                <template>
                                                    <input type="checkbox" :id="subfolder.name" :checked="subfolder.isChecked" @click="handleCheck">
                                                    {{subfolder.name}}
                                                </template> 
                                            </label>
                                        </div>
                                        <div class="column">
                                             <div class="is-pulled-right" title="Remove subFolder Option" style="padding-top:8px;"><a class="delete" :removeId="subfolder.name" @click="handleRemoveCreateFolder"></a></div>  
                                        </div>
                                    </div>
                                </a>
                            </form>
                            <div v-else style="text-align:center;padding:20px;">
                               <h2>No Subfolders</h2>
                            </div>
                            <form id="createFormAddFolder" @submit="handleAddCreateFolderOption">
                                <div v-if="!addActive" style="text-align:center; padding:7px;">
                                    <button type="button" class="button is-small is-info" @click="addActive=!addActive"><i class="fas fa-plus"></i></button>
                                </div>
                                <div v-else style="text-align:center; padding:7px;">
                                    <input type="text" class="input" name="newFolderName" id="newFolderNameInput" v-model="createFolderName">
                                    <div style="padding:7px;">
                                         <button class="button is-small is-primary" title="Submit" :disabled="!createFolderName.length > 0">Add Sub Folder Option</button>
                                        <button type="button" class="button is-small is-danger" title="Cancel" @click="()=>{addActive=!addActive;createFolderName='';}"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                            </form>
                        </template> 
                    </form>
                </section>
                <footer class="modal-card-foot">
                <button class="button is-success" @click="handleSaveFolder">Save Folder Settings</button>
                <button class="button is-pulled-right" @click="closeModal">Cancel</button>
                </footer>
            </div>
        </div>
</template>

<script>
export default {
    data(){
        return {
            addActive:false,
            formFolderName:"",
            createFolderName:""
        }
    },
    computed:{
        sortFolderOptions:function(){
           return this.$store.getters.autoSortOptions;
        },
        createFolderOptions:function(){
           return this.$store.getters.createOptions;
        }
    },
    props:['process', 'options'],
    methods:{
    closeModal(){
       this.$emit('closeModal');  
     },
     handleAddCreateFolderOption(e){
          e.preventDefault();
         this.$store.dispatch("addCreateFolder", this.createFolderName);
         this.createFolderName = '';
     },
     handleAddSortFolderOption(e){
         e.preventDefault();
         const folderName = this.formFolderName.trim();
         console.log("FOLDER NAME:",folderName);
         this.$store.dispatch("addSortFolder", folderName);
         this.formFolderName = '';
     },
     handleRemoveSortFolder(e){
         console.log("REMOVE sortFolder TRIGGERD",e.target.attributes['removeId'].value)
         this.$store.dispatch("removeSortFolder", e.target.attributes['removeId'].value);
     },
     handleRemoveCreateFolder(e){
         console.log("REMOVE Create folder TRIGGERD",e.target.attributes['removeId'].value)
         this.$store.dispatch("removeCreateFolder", e.target.attributes['removeId'].value);
     },
     handleCheck(e){
         console.log("handleing check",e.target.id, e.target.checked);
         if(this.process == "autoSort"){
            this.$store.dispatch("updateSortCheck", e.target.id);
         }  else {
            this.$store.dispatch("updateCreateCheck", e.target.id);
         }
     },
     handleSaveFolder(){
         if(this.process == "autoSort"){
             window.localStorage.setItem("sortSubfolders", JSON.stringify(this.sortFolderOptions));
             this.$emit('closeModal')
         }  else {
             window.localStorage.setItem("createSubfolders", JSON.stringify(this.createFolderOptions));
            this.$emit('closeModal')
         }
     }
    }
}
</script>

<style>

</style>
