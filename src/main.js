import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
const fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload();


const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 600,
    minHeight:350,
    minWidth:800,

  });
  
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(VUEJS_DEVTOOLS);
    mainWindow.webContents.openDevTools();
  }

  //on did-finish load event listener
  mainWindow.webContents.on('did-finish-load', ()=>{
   
    mainWindow.webContents.send('data', "New message send from main to renderer");
  });
  
   //listen for on unresponsive event
   mainWindow.on('unresponsive', ()=>{
    unresponsiveEventWindow = new BrowserWindow({
      width:350,
      height:280,
      maxWidth: 350, 
      maxHeight: 280,
      minWidth:770,
      minHeight:300
    });
    unresponsiveEventWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'src/unresponsiveApp.html'),
      protocol: 'file:',
      slashes: true
    }));
  });
  
   //listen for on resposive event
   mainWindow.on('responsive', ()=>{
    unresponsiveEventWindow = null;
  });
  

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });


};

ipcMain.on("autoSort", (e,arg,arg2)=>{
  //console.log("RECVD autosort mesage on main her are the args",arg,arg2)
  autoSortDir(e,arg,arg2);
})

ipcMain.on("createNewFolder", (e, args)=>{
  if(args.moveFile && args.moveSimilar){

  } else if(args.moveFile){
    e.sender.send("updateLoading", "Creating Folders");
    fs.mkdir(`${args.dir}\\${args.folderName}`, (err)=>{
      if(!err){
        args.subFolders.forEach(folder=>{
          if(folder.isChecked){
            fs.mkdir(`${args.dir}\\${args.folderName}\\${folder.name}`, (err)=>{
              if(!err){ 
                const readLoc = `${args.dir}\\${args.file}`;
                const writeLoc = `${args.dir}\\${args.folderName}\\${args.file}`;
                const read = fs.createReadStream(readLoc);
                const write = fs.createWriteStream(writeLoc);
                read.pipe(write);
                write.on('error', (err)=>{
                  console.log("ERROR IN READ WRTIE PIPE IN MOVE FILE PORTION OF CREATE NEW FOLDER", err);
                })
                write.on("finish", ()=>{
                  fs.unlink(readLoc, (err)=>{
                    if(!err){
                      e.sender.send("updateLoading", false);
                    } else {
                      console.error(err)
                    }
                  })
                  
                })
              } else {
                console.error("ERROR in pic main ", err)
              }
            })
          }
        })
      } else {
        console.log(err)
      }
    })
  } else {
    e.sender.send("updateLoading", "Creating Folders");
    fs.mkdir(`${args.dir}\\${args.folderName}`, (err)=>{
      if(!err){
        args.subFolders.forEach(folder=>{
          if(folder.isChecked){
            fs.mkdir(`${args.dir}\\${args.folderName}\\${folder.name}`, (err)=>{
              if(err){
                console.error("ERROR in IPC RENDER",err);
              } 
            })
          }
        })
      } else {
        console.log(err)
      }
      e.sender.send("updateLoading", false);
    })
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function autoSortDir(e,dirContent, subFolders){
     const findSORegEx = /^(\d{4,})([-\.\d]+)*\s*(.*)\s*(so|spi|po)\s*([\$\d]+|.+)*\.(\w+)$/i;
     const seen = [];
     dirContent.forEach((val)=>{
       const match = val.dir.match(findSORegEx);
       //index 0 = full matched string
       //index 1 = order number
       //index 2 = sub order number
       //index 3 = job name
       //index 4 = so , spi, or po
       //index 5 = $ dollar amount
       //index 6 = file extention
       if(match && !seen.hasOwnProperty(match[1])){
         const orderNum = match[1] && typeof(parseInt(match[1])) === 'number' && parseInt(match[1]) > 0 ? match[1] : false;
         const jobName = match[3] && typeof(match[3]) === "string" && match[3].length > 0 ? match[3] : false;
         const orderType = match[4] && typeof(match[4]) === 'string' && match[4].length > 0 ? match[4] : false;
         const fileExtension = match[6] && typeof(match[6]) === 'string' && match[6].length > 0 ? match[6] : false;
         const dollarAmount = match[5] && typeof(match[5]) === 'string' && match[5].length > 0 ? match[5] : '$0';
         //console.log(orderNum,jobName,orderType,fileExtension,dollarAmount);
         if(orderNum && orderType.toLowerCase() === "so" && jobName && fileExtension){
           seen[orderNum] = {
             fullFileName: match[0].trim(),
             jobName:jobName.trim().replace("  ", " "),
             orderType:orderType.toUpperCase().trim(),
             dollarAmount:dollarAmount.trim(),
             fileExtension:fileExtension.trim()
           }
         } else if(orderNum && orderType.toLowerCase() === "spi" && jobName && fileExtension) {
          seen[orderNum] = {
             fullFileName: match[0].trim(),
             jobName:jobName.trim().replace("  ", " "),
             orderType:orderType.toUpperCase().trim(),
             dollarAmount:'$0',
             fileExtension:fileExtension.trim()
           }
         } else if(orderNum && orderType.toLowerCase() === "po" && jobName && fileExtension){
           seen[orderNum] = {
             fullFileName: match[0].trim(),
             jobName:jobName.trim().replace("  ", " "),
             orderType:orderType.toUpperCase().trim(),
             dollarAmount:'$0',
             fileExtension:fileExtension.trim()
           }
         } else {
           alert("ERROR COULD NOT VALIDATE FILENAME IN SORT FUNCTION");
         }
       }
     })
     console.log("SEEN ARRAY", seen)
     const copyArray = [];
     const newFolderArray = [];
     for(let folder in seen){
       const path = `${dirContent[0].selectedDir}\\${seen[folder].jobName+' '+seen[folder].dollarAmount+' '+folder}`;
       console.log("THE PATH",path)
        newFolderArray.push(path);
        dirContent.forEach((item)=>{
          const getOrderNum = /^\d{4,}/;
          const regExFullFileName = /^(\d{4,})([-\.\d]+)*\s*(.+)\s*(so|spi|po|jpg|jpeg)+\s*([\$\d]+|.+)*\.(\w+)$/i;
          if(item.dir.match(getOrderNum) && item.dir.match(getOrderNum)[0] == folder){
            const fullNameParse = item.dir.match(regExFullFileName);
            let subFolder = "";
            if(fullNameParse){
              if(fullNameParse[4]){
                if(fullNameParse[4].toLowerCase() == 'so'){
                  subFolder = '\\Sales Order';
                } else if(fullNameParse[4].toLowerCase() == 'po' || fullNameParse[4].toLowerCase() == 'spi'){
                  subFolder = '\\Production';
                } else if(fullNameParse[4].toLowerCase() == 'jpg' || fullNameParse[4].toLowerCase() == 'jpeg'){
                   subFolder = '\\Art';
                } 
              }
              if(fullNameParse[6]){
                if(fullNameParse[6].toLowerCase() == 'jpg' || fullNameParse[6].toLowerCase() == 'jpeg'){
                  subFolder = "\\Art";
                } else if(fullNameParse[6].toLowerCase() == 'pdf'){
                  subFolder = "\\Production";
                } else if(fullNameParse[6].toLowerCase() == 'xlsx'){
                  subFolder = "\\Sales Order";
                }
              }
            } else if(item.dir.trim().endsWith(".jpg") || item.dir.trim().endsWith(".jpeg") || item.dir.trim().endsWith(".png") || item.dir.trim().endsWith(".gif")){
              subFolder = "\\Art";
            }
           copyArray.push({read:`${item.selectedDir}\\${item.dir}`, write:path + subFolder + '\\' + item.dir});
          } 
        })  
      }
      e.sender.send("updateLoading", "Creating Folders");
      const newDirsArray = makeDirectories(newFolderArray, subFolders);
      console.log("Dir array returned!",newDirsArray)
      Promise.all(newDirsArray).then((createdArr)=>{
        e.sender.send("updateLoading", "Copying Files");
        const copyPromises = batchCopy(copyArray);
        return Promise.all(copyPromises);
      }).then(copiedFiles=>{
        e.sender.send("updateLoading", "Cleaning Old Files");
        const removePromises = batchRemove(copiedFiles);
        return Promise.all(removePromises)
      }).then(final=>{
        console.log("ALL DONE");
        e.sender.send("updateLoading", false);
      }).catch(err=>{
        console.error("Errror in auto sort", err);
      }) 
}
function batchCopy(arr){
  const promiseArray = arr.map((item,i)=>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
      const read = fs.createReadStream(item.read);
      const write = fs.createWriteStream(item.write);
        read.pipe(write);
        write.on('error', (err)=>{
          reject(err);
        })
        write.on('finish', ()=>{
          resolve(item.read);
        })
      },5000) 
    })
  })
  return promiseArray;
}

function batchRemove(arr){
  const promiseArray = arr.map((item,i)=>{
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        try{
          fs.unlink(item, (error)=>{
            if(!error){
              resolve(item);
            } else {
              throw error;
            }
          })
        } catch(err){
          console.log("err caught in batch remove", err)
        }
      }, 2090)
    })
  })
  return promiseArray;
}

function makeDirectories(mainFolders, subFolders){
        const promiseArray = mainFolders.map((item,i)=>{
          return new Promise((res, rej)=>{
            setTimeout(()=>{
              fs.mkdir(item, (err)=>{
                if(err) rej(err);
                subFolders.forEach((folder)=>{
                  fs.mkdir(item+'\\'+folder, (err)=>{
                      if(err) rej(err);
                        res(item);
                    })
                })
              })
            }, 2000)
          })
        })
        return promiseArray;
}