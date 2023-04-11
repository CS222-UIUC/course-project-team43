import CryptoJS from 'crypto-js'

var lastOffset: number = 0;

interface onCallBack {
    offset: number
    chunkSize: number
    file: File
    reader: FileReader
    onProgress: CallableFunction
    onFinish: CallableFunction
}

function loadCallback(s: onCallBack, event: ProgressEvent<FileReader>) {
    if (lastOffset === s.offset) {
        lastOffset = s.offset + s.chunkSize
        s.onProgress(event.target.result)
        if (s.offset + s.chunkSize >= s.file.size) {
            s.onFinish()
        }
    } else {
        setTimeout(() => {
            loadCallback(s, event)
        }, 10)
    }   
}

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

        let props: onCallBack =  {
            offset: offset,
            chunkSize: chunkSize,
            file: file,
            reader: reader,
            onProgress: onProgress,
            onFinish: onFinish
        }

        reader.onload = function(evt) {
            loadCallback(props, evt)
        }
        reader.readAsArrayBuffer(partial)
        offset += chunkSize
    }
    debugger
}

// setHash is a hook to update the fileHash field in upload-form
export default async function CheckSum(file : File, setHash: any, setProgress: any) {
    var SHA256 : any = CryptoJS.algo.SHA256.create();
    var hash : string = ""
    var counter: number = 0;

    const onProgress = function(data: any) {
        let wordBuffer = CryptoJS.lib.WordArray.create(data)
        SHA256.update(wordBuffer)
        
        // setState hook to update user on progress.
        counter += data.byteLength
        setProgress((( counter / file.size)*100).toFixed(0))
    }

    const onFinish = function() {
        hash = SHA256.finalize().toString(CryptoJS.enc.Base64)
        
        // setState hook to update the react front-end.
        setHash(hash)
    }

    loading(file, onProgress, onFinish)
}