const {contextBridge, ipcRenderer} = require('electron');


contextBridge.exposeInMainWorld('openAPI',{
    getContent: () => ipcRenderer.invoke("dialog:openFile"),
    runTerminal: (text) => ipcRenderer.invoke("runTerminal",text),
    readTerminalOutput: ()=> ipcRenderer.invoke("readTerminalOutput"),
    writeFile: (filename,data)=> ipcRenderer.invoke("writeFile",filename,data)
});