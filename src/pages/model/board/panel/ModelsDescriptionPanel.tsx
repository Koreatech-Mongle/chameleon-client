import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Badge} from "flowbite-react";
import MDEditor from "@uiw/react-md-editor";
import {PlatformAPI} from "../../../../platform/PlatformAPI";
import {ModelEntityData, SitePaths} from "../../../../types/chameleon-platform.common";
import {DescriptionProps} from "../../../../types/chameleon-client";
import {MdOutlineCancel} from "react-icons/md";

export default function ModelsDescriptionPanel({modelId, setSelectedModelId, setModalOpen}: DescriptionProps) {
    const [modelData, setModelData] = useState<ModelEntityData>();
    const navigate = useNavigate();

    useEffect(() => {
        let completed = false;

        if (modelId > -1)
            setTimeout(async function () {
                try {
                    const model = await PlatformAPI.getModelById(modelId);
                    if (!completed && model.id === modelId) {
                        setModelData(model);
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        return () => {
            completed = true;
        };
    }, [modelId]);

    const username = modelData?.register?.username;
    const uniqueName = modelData?.uniqueName;

    const handleStart = () => {
        if (modelId > -1) navigate(SitePaths.MODEL(username!, uniqueName!));
    };

    return (
        <div className="contents">
            <div className="m-2 md:my-10 mt-24 p-2 md:pr-5 md:py-10">
                <div
                    className="flex justify-between items-center pb-6 border-b-1 border-gray-300 overflow-auto max-h-screen">
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">{modelData?.name}</p>
                    <div className="flex gap-2 items-center">
                        <button className="submit-btn text-sm w-full p-1.5" onClick={handleStart}>start</button>
                        <button className="submit-btn text-sm w-full p-1.5" onClick={() => setModalOpen(true)}>delete</button>
                        <button className="text-gray-500 text-2xl rounded-full hover:text-black hover:bg-light-gray"
                                onClick={() => setSelectedModelId(-1)}><MdOutlineCancel/></button>
                    </div>
                </div>
                <div className="mt-4 overflow-auto max-h-screen">
                    <div className="flex my-2 items-center gap-2">
                        <p className="text-lg font-bold">Name:</p>
                        <p className="font-medium">{modelData?.name}</p>
                    </div>
                    <div className="flex my-2 items-center gap-2">
                        <p className="text-lg font-bold">Register:</p>
                        <p className="font-medium">{modelData?.register?.username}</p>
                    </div>
                    <div className="flex my-2 items-center gap-2">
                        <p className="text-lg font-bold">Region:</p>
                        <p className="font-medium">{modelData?.image?.region?.name}</p>
                    </div>
                    {modelData?.price !== 0 && (
                        <div className="flex my-2 items-center gap-2">
                            <p className="text-lg font-bold">Price:</p>
                            <p className="font-medium">￦{modelData?.price.toLocaleString('ko-KR')}</p>
                        </div>
                    )}
                    <div className="flex my-2 justify-items-start gap-2">
                        <div className="pt-3"><Badge color="indigo">Input: {modelData?.inputType}</Badge></div>
                        <div className="pt-3"><Badge color="purple">Output: {modelData?.outputType}</Badge></div>
                    </div>
                    {modelData?.category !== null && (
                        <div className="flex my-2 justify-items-start gap-2">
                            <div className="pt-3"><Badge
                                className="bg-teal-100 text-teal-500">{modelData?.category}</Badge></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <div data-color-mode="light" className="my-4 whitespace-pre-wrap">
                        <MDEditor.Markdown className="py-2" source={modelData?.description}
                                           style={{whiteSpace: 'pre-wrap'}}/>
                    </div>
                </div>
            </div>
        </div>
    );
};