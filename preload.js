const {contextBridge, ipcRenderer} = require('electron');


contextBridge.exposeInMainWorld('openAPI',{
    getContent: () => ipcRenderer.invoke("dialog:openFile")
});