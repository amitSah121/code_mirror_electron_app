// const { ipcMain } = require("electron");

// Create an initial state for the view
const initialState = cm6.createEditorState("Load Something to edit.........");
const view = cm6.createEditorView(initialState, document.getElementById("editor"));
let states = { "Initial State": initialState };

const terminal_initial = cm6.createEditorState("Terminal 1.0.0");
const terminal = cm6.createEditorView(terminal_initial, document.getElementById("terminal"));

const output_initial = cm6.createEditorState("Output");
// output_initial.readOnly.of(true);
const output = cm6.createEditorView(output_initial, document.getElementById("output"));
// doument.querySelector("#tab1").addEventListener("click",()=>{
//     view.dispatch({changes: {
//         from: 0,
//         to: view.state.doc.length,
//         insert: 'my new content'
//     }})
// });


document.querySelector("#run").addEventListener("click",()=>{
    window.openAPI.runTerminal(terminal.state.doc.toString())
    window.openAPI.readTerminalOutput()
    .then(data=>{
        output.dispatch({
            changes:{
                from: 0,
                to: output.state.doc.length,
                insert: data
            }
        });
    }), 1000
    // console.log(t);
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        let temp = document.querySelector("#open-tabs .w3-grey");
        datas[temp.innerHTML.split(" ")[0]-1] = view.state.doc.toString();
        let filename = paths[temp.innerHTML.split(" ")[0]-1];
        let data = datas[temp.innerHTML.split(" ")[0]-1];
        window.openAPI.writeFile(filename,data);
    }
});


let paths = []
let filenames = []
let datas = []
document.querySelector("#menu-open-file").addEventListener("click",async ()=>{
    const data = await window.openAPI.getContent();
    paths.push(data.split("+")[0]);
    datas.push(data.substring(paths[paths.length-1].length+1));
    filenames.push(paths[paths.length-1].substring(paths[paths.length-1].lastIndexOf('/')+1));
    let tabs = document.querySelector("#open-tabs");
    w3.removeClass("#open-tabs span","w3-grey");
    w3.addClass("#open-tabs span","w3-white w3-text-black");
    tabs.innerHTML = tabs.innerHTML+`<span class="w3-bar-item w3-grey w3-text-white w3-small" id="tab1">${filenames.length} ${filenames[filenames.length-1]}</span>`;
    view.dispatch({
        changes:{
            from:0,
            to: view.state.doc.length,
            insert: datas[datas.length-1]
        }
    });
    document.querySelector("#open-tabs").addEventListener("click",(event)=>{
        let temp = document.querySelector("#open-tabs .w3-grey");
        w3.removeClass("#open-tabs span","w3-grey w3-text-white");
        w3.addClass("#open-tabs span","w3-white w3-text-black");
        w3.removeClass(event.target,"w3-white w3-text-black");
        w3.addClass(event.target,"w3-grey w3-text-white");
        datas[temp.innerHTML.split(" ")[0]-1] = view.state.doc.toString();
        view.dispatch({
            changes:{
                from:0,
                to: view.state.doc.length,
                insert: datas[event.target.innerHTML.split(" ")[0]-1]
            }
        });
    });
})