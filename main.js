const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require("node:path");
const fs = require("fs");

async function handleFileOpenAndContent(){
    const {canceled, filePaths} = await dialog.showOpenDialog();
    if(!canceled){
        fs.readFile(filePaths[0],(err,data)=>{
            if(err){
                console.log(err);
                return filePaths[0];
            }
            return data.toString()+filePaths[0];
        })
    }
    return "nothing";
}

const createWindow = ()=>{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname,'preload.js')
        }
    });

    win.loadFile("index.html");
    win.setMenu(null);
    win.webContents.openDevTools();
}

app.whenReady().then(()=>{
    ipcMain.handle("dialog:openFile",handleFileOpenAndContent);

    createWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length == 0) createWindow();
    });
});

app.on('window-all-closed', ()=>{
    if(process.platform != 'darwin') app.quit();
});