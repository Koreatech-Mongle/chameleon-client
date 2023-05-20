import React from "react";

import {BiDownload} from "react-icons/bi";
import {DownloadUtils} from "../../../../utils/DownloadUtils";
import {FileUtils} from "../../../../utils/FileUtils";
import {HistoryEntityData} from "../../../../types/chameleon-platform.common";

export default function ImageOutputModule(executeData: HistoryEntityData) {
    let outputInformation = executeData?.outputInfo?.fileName
    const extension = outputInformation?.split('.').pop();
    let outputPath = executeData?.outputPath
    let outputSize = executeData?.outputInfo?.fileSize
    let outputName = executeData?.outputInfo?.fileName

    return (
        <div>
            <div className="md:p-2 space-x-3 flex justify-between items-center border-b border-gray-300"
                 style={{backgroundColor: '#F6F6F6'}}>
                <p className="text-xl font-semibold">Output</p>
                <div className="pt-1 flex items-center rounded-lg hover:drop-shadow-xl focus:bg-white bg-white">
                    <BiDownload size="20" color="#484848" className="pl-1"/>
                    <button className="submit-btn text-sm" onClick={async () => {
                        if (outputName) {
                            DownloadUtils.download('/' + outputPath, outputName);
                        }
                    }}>Download
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto max-h-[352px]">
                <br/>
                <p><span className="px-2 pt-2 font-semibold">Output Format :</span>{extension} </p>
                <p><span className="px-2 pt-2 font-semibold">Size :</span>{FileUtils.formatBytes(outputSize)} </p>
                <div className="px-2 pt-2"
                     style={{overflow: 'hidden', display: 'flex', justifyContent: 'center'}}>
                    {outputPath ?
                        <img style={{width: "100%", objectFit: 'contain', maxWidth: '100%', maxHeight: '100%'}}
                             src={'/' + outputPath}/> : <></>}
                </div>
            </div>
        </div>
    );
}