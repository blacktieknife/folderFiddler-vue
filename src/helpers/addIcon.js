const addIcon = (dirArr) => {
    const extRegEx = /(\.[a-z0-9]*)$/
    const dirContentArray = dirArr.map((item)=>{
      const match = item.match(extRegEx);
      let customIcon;
      if(match){
        switch(match[0].toLowerCase()){
          case '.jpg':
            customIcon = 'fas fa-image';
            break;
          case '.jpeg':
            customIcon = 'fas fa-image';
            break;
          case '.gif':
            customIcon = 'fas fa-image';
            break;
          case '.tiff':
            customIcon = 'fas fa-image';
            break;
          case '.png':
            customIcon = 'fas fa-image';
            break;  
          case '.ps':
            customIcon = 'fas fa-image';
            break;         
          case '.json':
            customIcon = 'fab fa-js';
            break; 
          case '.js':
            customIcon = 'fab fa-js';
            break;
          case '.css':
            customIcon = 'fab fa-css3-alt';
            break;
          case '.html':
            customIcon = 'fab fa-html5';
            break; 
          case '.mp3':
            customIcon = 'fas fa-music';
            break; 
          case '.wav':
            customIcon = 'fas fa-music';
            break;
          case '.m4a':
            customIcon = 'fas fa-music';
            break; 
          case '.ape':
            customIcon = 'fas fa-music';
            break;    
          case '.flac':
            customIcon = 'fas fa-music';
            break;
          case '.acc':
            customIcon = 'fas fa-music';
            break; 
          case '.avi':
            customIcon = 'fas fa-video';
            break;
          case '.mkv':
            customIcon = 'fas fa-video';
            break;  
          case '.xvid':
            customIcon = 'fas fa-video';
            break;
          case '.mp4':
            customIcon = 'fas fa-video';
            break;
          case '.dvix':
            customIcon = 'fas fa-video';
            break; 
          case '.mpeg':
            customIcon = 'fas fa-video';
            break;
          case '.mpg':
            customIcon = 'fas fa-video';
            break;
          case '.exe':
            customIcon = 'fas fa-desktop';
            break;                             
          case '.zip':
            customIcon = 'fas fa-file-archive';
            break;
          case '.rar':
            customIcon = 'fas fa-file-archive';
            break;      
          case '.txt':
            customIcon = 'fas fa-file-alt';
            break;
          case '.log':
            customIcon = 'fas fa-file-alt';
            break; 
          case '.cfg':
            customIcon = 'fas fa-file-alt';
            break;
          case '.wd':
            customIcon = 'fas fa-file-alt';
            break;           
          case '.pdf':
            customIcon = 'fas fa-file-pdf';
            break;      
          default:
            customIcon = 'fas fa-file';
            break;  
        }
        return {dir:item, icon:customIcon};
      } else {
        return {dir:item, icon:'fas fa-folder'};
      }
    });
    return dirContentArray;
  };

  export default addIcon;