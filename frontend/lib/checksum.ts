import CryptoJS from 'crypto-js'

var lastOffset: number = 0

// interface

// function callbackOnRead(state : any) {
//     debugger
//     if (lastOffset === state.offset) {
//         lastOffset = state.offset + state.chunkSize
//         state.onProgress(state.evt.target.result)

//         if (state.offset + state.chunkSize >= state.file.size) {
//             state.onFinish()
//         }
//     } else {
//         let timeout = setTimeout(function () {

//         }, 10)
//     }




    
// }

// onProgress and onFinish are callback functions.
function loading(file: File, onProgress: any, onFinish: any) {
    debugger
    let chunkSize : number = 1024 * 1024 // 1 megabyte
    let offset : number = 0
    let partial : any

    if (file.size === 0) {
        onFinish()
    }
    while (offset < file.size) {
        partial = file.slice(offset, offset + chunkSize)
        let reader = new FileReader
        
        reader.onload = function(evt) {
            onProgress(evt.target.result)
            if (offset + chunkSize >= file.size) {
                onFinish()
            }
        }
        reader.readAsArrayBuffer(partial)
        offset += chunkSize
    }
}

export default async function CheckSum(file : File, updateProgress: any, setHash: any) {
    debugger
    var SHA256 : any = CryptoJS.algo.SHA256.create();
    var counter : number = 0
    var hash : string = ""

    const onProgress = function(data: any) { // onProgress callback
        let wordBuffer = CryptoJS.lib.WordArray.create(data)
        SHA256.update(wordBuffer)
        counter += data.byteLength

        // Function to update the react front end state.
        updateProgress(((counter / file.size) * 100).toFixed(0))
    }

    const onFinish = function() { // onFinish callback
        updateProgress(100)
        hash = SHA256.finalize().toString(CryptoJS.enc.Base64)
        setHash(hash)
    }

    loading(file, onProgress, onFinish)

    // return new Promise<string>((resolve, reject) => {
    //     resolve(hash)
    // })
}