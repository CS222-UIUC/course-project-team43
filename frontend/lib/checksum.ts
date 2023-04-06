import CryptoJS from 'crypto-js'

function chooseCallback(reader : FileReader, 
                        file : File, 
                        state : any,
                        callback : any) {
    callback.onProgress(reader.result)
    if (state.offset + state.chunkSize >= file.size) {
        callback.onFinish()
    }
}

// onProgress and onFinish are callback functions.
function loading(file: any, onProgress: any, onFinish: any) {
    let chunkSize : number = 1024 * 1024 // 1 megabyte
    let offset : number = 0
    let partial : any
    let index : number = 0

    if (file.size === 0) {
        onFinish()
    }
    while (offset < file.size) {
        partial = file.slice(offset, offset + chunkSize)
        let reader = new FileReader
        reader.onload = function(evt) {
            chooseCallback(this, file, 
                        {offset: offset, chunkSize: chunkSize}, 
                        {onProgress: onProgress, onFinish: onFinish})
        }
        reader.readAsArrayBuffer(partial)
        offset += chunkSize
        index += 1
    }
}

export default async function CheckSum(file : File, updateProgress : any) {
    let SHA256 : CryptoJS = CryptoJS.algo.SHA256.create();
    let counter : number = 0
    let hash : string = ""

    loading(file, function(data: any) { // onProgress callback
        let wordBuffer = CryptoJS.lib.WordArray.create(data)
        SHA256.update(wordBuffer)
        counter += data.byteLength

        // Function to update the react front end state.
        updateProgress(((counter / file.size) * 100).toFixed(0))
    }, function() { // onFinish callback
        updateProgress(100)
        hash = SHA256.finalize().toString()
    })

    return new Promise<string>((resolve, reject) => {
        resolve(hash)
    })
}