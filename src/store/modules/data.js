import { isArray } from "util";

const state = {
    currentDir:"Drives",
    currentDirConent:[],
    selectedDir:"",
    selectedFile:"",
    isLoading:false,
    selectedDirContent:[],
    createFolderOptions:[],
    sortFolderOptions:[],
    favorites:[]
}

const mutations = {
  "UPDATE_CURRENT_DIR"(state, path){
      state.currentDir = path;
  },
  "UPDATE_ISLOADING"(state, loading){
    //loading should be true of false
    state.isLoading = loading;
  },
  "UPDATE_CURRENT_DIR_CONTENT"(state, dirArray){
    console.log("UPDATE CURRENT DIR MUTATION FIRED ", dirArray);
      state.currentDirConent = dirArray; 
      console.log("STATE AFTER MUTATION", state.currentDirConent);
  },
  "UPDATE_SELECTED_DIR"(state, selectedPath){
    state.selectedDir = selectedPath;
  },
  "UPDATE_SELECTED_DIR_CONTENT"(state, selectedArray){
    state.selectedDirContent = selectedArray;
  },
  "UPDATE_FAVORITES"(state, favoritesArray){
      state.favorites = favoritesArray;
      console.log("STATE AFTER UPDATE FAVORITES", state.favorites)
  },
  "UPDATE_SORT_FOLDER_OPTIONS"(state, options){
      if(isArray(options)){
        state.sortFolderOptions = [...options];
      } else {
          //should be an object {name:String, isChecked:Boolean}
        state.sortFolderOptions.push(options);
      }
     console.log("STATE AFTER FOLDER OPTIONS UPDATE", state.sortFolderOptions)
  },
  "UPDATE_CREATE_FOLDER_OPTIONS"(state, options){
      if(isArray(options)){
        //options should be an array here.
        state.createFolderOptions = options
      } else {
        //should be an object {name:String, isChecked:Boolean }
        state.createFolderOptions.push(options);
      }
  },
  "UPDATE_SELECTED_FILE"(state, selectedFile){
      if(selectedFile){
        state.selectedFile = selectedFile;
      } else {
          state.selectedFile = '';
      }
      console.log("UPDATED STATE AFTER UPDATE SELECTED FILE", state.selectedFile);
  }
};

const actions = {
    updateCurrentDir({commit}, dirPath){
        commit("UPDATE_CURRENT_DIR", dirPath);
    },
    updateCurrentDirContent({commit}, dirArray){
        console.log("UPDATE CURRENT DIR ACTION FIRED ", dirArray);
        commit("UPDATE_CURRENT_DIR_CONTENT", dirArray);
    },
    updateSelectedDir({commit}, selectedDir){
        console.log("UPDATE SELECTED DIR ACITON FIRED ", selectedDir);
        commit("UPDATE_SELECTED_DIR", selectedDir)
    },
    updateSelectedDirContent({commit}, selectedArray){
        commit("UPDATE_SELECTED_DIR_CONTENT", selectedArray)
    },
    updateSelectedFile({commit}, selectedFile){
        if(selectedFile){
            commit("UPDATE_SELECTED_FILE", selectedFile);
        } else {
            commit("UPDATE_SELECTED_FILE");
        }
    },
    updateLoading({commit}, loading){
        commit("UPDATE_ISLOADING", loading)
    },
    fetchSortSubFolderOptions({commit}){
        try{
            const folderOptionsSort = window.localStorage.getItem('sortSubfolders');
            if(folderOptionsSort){
                const parsedOptions = JSON.parse(folderOptionsSort);
                commit("UPDATE_SORT_FOLDER_OPTIONS", parsedOptions)
            } else {
                console.log("No folder options load defaults")
                const sortDefaults = [
                        {name:"Art",isChecked:true},
                        {name:"Production",isChecked:true},
                        {name:"Sales Order",isChecked:true}    
                    ]
                commit("UPDATE_SORT_FOLDER_OPTIONS", sortDefaults)
            }
        } catch(err){
            console.log(err);
        }
    },
    updateSortCheck({commit, getters}, folder){
        if(folder){
            const autoArray = getters.autoSortOptions;
            const updatedArray = autoArray.map((val,i)=>{
                if(val.name == folder){
                    return {name:folder, isChecked:!val.isChecked};
                } else {
                    return val;
                }
            });
            commit("UPDATE_SORT_FOLDER_OPTIONS", updatedArray);
        }else{
            console.error('Error Missing foldername in updateSortCheck')
        }
    },
    addSortFolder({commit, getters}, newFolder){
        const folder = typeof(newFolder) === 'string' && newFolder.trim().length > 0 ? newFolder.trim() : false;
        if(folder){
            console.log("Folder made it though to addSortFolder,",folder);
            commit("UPDATE_SORT_FOLDER_OPTIONS", {name:folder, isChecked:false});
        } else {
            console.error("ERROR: Missing FOLDER NAME in Add sortFolder function")
        }
    },
    removeSortFolder({commit, getters}, removeFolder){
        const folder = typeof(removeFolder) === 'string' && removeFolder.trim().length > 0 ? removeFolder.trim() : false;
        if(folder){
            const returnArr = [];
            const autoSortArr = getters.autoSortOptions;
            for(let i=autoSortArr.length-1; i >=0; i--){
                if(autoSortArr[i].name !== folder){
                    returnArr.push(autoSortArr[i]);
                }
            }
            console.log("Folder made it though to remove,",folder);
            console.log("New sort array",returnArr);
            commit("UPDATE_SORT_FOLDER_OPTIONS", returnArr);
        } else {
            console.error("ERROR: Missing FOLDER NAME in Remove sortFolder function")
        }
    },
    fetchCreateFolderOptions({commit}){
        try{
            const folderOptionsCreate = window.localStorage.getItem('createSubfolders');
            if(folderOptionsCreate){
                const parsedOptions = JSON.parse(folderOptionsCreate);
                commit("UPDATE_CREATE_FOLDER_OPTIONS", parsedOptions)
            } else {
                console.log("No folder options load defaults")
                const createDefaults = [
                        {name:"Art",isChecked:true},
                        {name:"Sales Order",isChecked:true},
                        {name:"Production", isChecked:true}  
                    ]
                commit("UPDATE_CREATE_FOLDER_OPTIONS", createDefaults)
            }
        } catch(err){
            console.log(err);
        }  
    },
    addCreateFolder({commit}, newFolder){
        console.log("ADD CREATE FOLDER VALUE ",newFolder );
        const folder = typeof(newFolder) === "string" && newFolder.trim().length > 0 ? newFolder.trim() : false;
        if(folder){
            commit("UPDATE_CREATE_FOLDER_OPTIONS", {name:folder, isChecked:false})
        } else {
            console.error("ERROR in ADD Create folder -- Missing Folder Name")
        }
    },
    removeCreateFolder({commit, getters}, removeFolder){
        const folder = typeof(removeFolder) === "string" && removeFolder.trim().length > 0 ? removeFolder.trim() : false;
        if(folder){
            const createFolderArr = getters.createOptions;
            const returnArray = [];
            for(let i=createFolderArr.length-1; i >= 0; i--){
                if(createFolderArr[i].name !== folder){
                    returnArray.push(createFolderArr[i]);
                }
            }
            commit("UPDATE_CREATE_FOLDER_OPTIONS", returnArray)
        } else {
            console.error("ERROR in ADD Create folder -- Missing Folder Name")
        }
    },
    updateCreateCheck({commit, getters}, folder){
        if(folder){
            const autoArray = getters.createOptions;
            const updatedArray = autoArray.map((val,i)=>{
                if(val.name == folder){
                    return {name:folder, isChecked:!val.isChecked};
                } else {
                    return val;
                }
            });
            commit("UPDATE_CREATE_FOLDER_OPTIONS", updatedArray);
        }else{
            console.error('Error Missing foldername in updateSortCheck')
        }
    },
    fetchFavorites({commit}){
        const favs = window.localStorage.getItem('favorites');
        if(favs){
            const favoritesArray = JSON.parse(favs);
            console.log("IS array",favoritesArray instanceof Array)
            commit("UPDATE_FAVORITES", favoritesArray);
        } else {
            console.log("NO FAVS");
        }
    },
    updateFavorites({commit}, newFavoriteArray){
        window.localStorage.setItem('favorites', JSON.stringify(newFavoriteArray));
        commit("UPDATE_FAVORITES",newFavoriteArray);
    },
    removeFavorite({commit}, updatedFavoriteArray){
        window.localStorage.setItem('favorites', JSON.stringify(updatedFavoriteArray));
        commit("UPDATE_FAVORITES", updatedFavoriteArray);
    }
};

const getters = {
    currentDir(state) {
        return state.currentDir;
    },
    currentDirContent(state){
        return state.currentDirConent;
    },
    selectedDir(state){
        return state.selectedDir;
    },
    selectedDirContent(state){
        return state.selectedDirContent;
    },
    favorites(state){
        return state.favorites;
    },
    selectedFile(state){
        return state.selectedFile;
    },
    createOptions(state){
        return state.createFolderOptions;
    },
    autoSortOptions(state){
        return state.sortFolderOptions;
    },
    isLoading(state){
        return state.isLoading;
    }
}

export default {
    state,
    mutations,
    actions,
    getters

}