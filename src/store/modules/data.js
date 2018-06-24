import { isArray } from "util";
import {ipcRenderer} from "electron";
import addIcon from "../../helpers/addIcon.js";
const fs = require('fs');
const chokidar = require('chokidar');

const state = {
    currentDir:"Drives",
    currentDirConent:[],
    selectedDir:"",
    selectedFile:"",
    errorMsg:false,
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
      state.currentDirConent = dirArray; 
  },
  "UPDATE_SELECTED_DIR"(state, selectedPath){
    state.selectedDir = selectedPath;
  },
  "UPDATE_SELECTED_DIR_CONTENT"(state, selectedArray){
    state.selectedDirContent = selectedArray;
  },
  "UPDATE_FAVORITES"(state, favoritesArray){
      state.favorites = favoritesArray;
  },
  "UPDATE_SORT_FOLDER_OPTIONS"(state, options){
      if(isArray(options)){
        state.sortFolderOptions = [...options];
      } else {
          //should be an object {name:String, isChecked:Boolean}
        state.sortFolderOptions.push(options);
      }
  },
  "UPDATE_ERROR"(state, errorMsg){
    state.errorMsg = errorMsg;
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
      if(selectedFile && selectedFile.length > 0){
        state.selectedFile = selectedFile;
      } else {
          state.selectedFile = "";
      }
  }
};
let watcher;
const actions = {
    updateCurrentDir({commit}, dirPath){
        commit("UPDATE_CURRENT_DIR", dirPath);
    },
    updateCurrentDirContent({commit}, dirArray){
        commit("UPDATE_CURRENT_DIR_CONTENT", dirArray);
    },
    updateSelectedDir({commit, getters, dispatch}, selectedDir){
        const currentSelectedDir = selectedDir;
        if(watcher){
            watcher.close();
            watcher = null;
        } 
        watcher = chokidar.watch(selectedDir,{ignored: /(^|[\/\\])\../, depth:0});
        watcher.on('ready',()=>{
          console.log(`Watcher -- Scan complete ready for changes`);
          watcher.on('add', (path)=>{
              console.log(`Watcher -- New file added here is the full path ${path}`);
              ipcRenderer.send("newFile", path);
          })
          watcher.on('all', (event, path)=>{
              console.log(`Selected folder has changed event : ${event} , path : ${path}`);
              fs.readdir(currentSelectedDir,(err, data)=>{
                if(!err){
                    const returnSelectedArray = addIcon(data).map((val)=>{
                        const returnObj = {};
                        for(let v in val){
                            returnObj['selectedDir'] = currentSelectedDir;
                            returnObj[v] = val[v];
                        }
                        return returnObj;
                    });
                    dispatch("updateSelectedDirContent", returnSelectedArray);
                } else {
                    console.error("ERROR IN REFRESHING SLECTED DIR CONETNT FROM WATCHER  --  ", err);
                }
              })

          })
        })
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
        if(watcher){
            watcher.close();
            watcher = null;
        } 
        commit("UPDATE_ISLOADING", loading)
    },
    updateError({commit}, errorMsg){
        commit("UPDATE_ERROR", errorMsg);
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
            console.error(err);
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
            console.error(err);
        }  
    },
    addCreateFolder({commit}, newFolder){
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
            commit("UPDATE_FAVORITES", favoritesArray);
        } else {
            console.error("NO FAVS Found in localstorage");
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
    },
    errorMsg(state){
        return state.error;
    }
}

export default {
    state,
    mutations,
    actions,
    getters

}