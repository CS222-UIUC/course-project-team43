import CryptoJS from 'crypto-js'

// onProgress and onFinish are callback functions.
function loading(file: File, onProgress: any, onFinish: any) {
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

// setHash is a hook to update the fileHash field in upload-form
export default async function CheckSum(file : File, setHash: any) {
    var SHA256 : any = CryptoJS.algo.SHA256.create();
    var hash : string = ""

    const onProgress = function(data: any) {
        let wordBuffer = CryptoJS.lib.WordArray.create(data)
        SHA256.update(wordBuffer)
    }

    const onFinish = function() {
        hash = SHA256.finalize().toString(CryptoJS.enc.Base64)
        
        // setState hook to update the react front-end
        setHash(hash)
    }

    loading(file, onProgress, onFinish)
}