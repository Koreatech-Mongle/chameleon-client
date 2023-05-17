import React, {useEffect, useState} from 'react';
import {Badge, Table} from "flowbite-react";
import {Link} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {HiViewGrid} from "react-icons/hi";
import {FiList} from "react-icons/fi";
import {RiDeleteBinLine} from "react-icons/ri";
import {BiAddToQueue, BiDotsVerticalRounded, BiPencil, BiTrash} from "react-icons/bi";
import {VscDebugStart} from "react-icons/vsc";
import Description from "../../../components/layout/Description";
import Header from "../../../components/layout/Header";
import {PlatformAPI} from "../../../platform/PlatformAPI";
import {ModelEntityData} from "../../../types/chameleon-platform.common";
import {DateUtils} from "../../../utils/DateUtils";
import DeleteModal from "../../../components/modal/DeleteModal";

export const modelColumn = {
    list: ['Model Name', 'Input Type', 'Output Type', 'Register', 'Last Modified Date', 'start']
};

export default function Models({own} : {own:boolean}) {
    const {
        menuState,
        onClickMenu,
        currentLayout,
        setCurrentLayout,
        isDesktopOrMobile
    } = useStateContext();
    const [models, setModels] = useState<ModelEntityData[]>([]);
    const [selectedModelId, setSelectedModelId] = useState<number>(-1);
    const [selectedModelName, setSelectedModelName] = useState('');
    const [deleteOption, setDelete] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        let completed = false;

        (async function () {
            try {
                const models = await (own?PlatformAPI.getMyModels():PlatformAPI.getModels());
                if (!completed) {
                    setModels(models);
                }
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            completed = true;
        };
    }, [own]);

    const onModelSelect = (modelData: ModelEntityData) => {
        setSelectedModelId(modelData.id);
    };

    const onModalClose = () => {
        setModalOpen(false)
        setSelectedModelId(-1);
    }

    const onBinClick = (modelName: string) => {
        setModalOpen(true)
        setSelectedModelName(modelName);
    }

    const onModalDeleteClick = async () => {
        setModalOpen(false);
        setIsLoading(true);
        try {
            const uploadResult = await PlatformAPI.deleteModelById(selectedModelId);
            console.log(uploadResult);
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            if (error.response && error.response.status === 501) {
                console.error(error.response.data);
            } else {
                console.error(error);
            }
        }
    };
    const ArrangeMenu = () => (
      <div className="flex items-center gap-2">
        <Link to="/models/create" className="flex items-center rounded-full p-1 hover:bg-light-gray focus:bg-gray">
          <BiAddToQueue size="25" color="#484848" className="pl-1"/>
          <span
            className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Create Model</span>
        </Link>
        <Link to="/" className="flex items-center rounded-full p-1 hover:bg-light-gray focus:bg-gray">
          <BiPencil size="25" color="#484848" className="pl-1"/>
          <span
            className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Update Model</span>
        </Link>
          {
              own?<button className="flex items-center rounded-full p-1 hover:bg-light-gray focus:bg-gray" onClick={() => setDelete(!deleteOption)}>
                  <BiTrash size="25" color="#484848" className="pl-1"/>
                  <span
                      className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Delete Model</span>
              </button>: <></>
          }

      </div>
    );
    const DropdownMenu = () => (
      <div>
        <button type="button" onClick={onClickMenu}
                className="relative text-xl rounded-full p-1 hover:bg-light-gray focus:bg-gray">
          {<BiDotsVerticalRounded aria-hidden="true" size="30"/>}
        </button>
        {menuState ? <Menu/> : null}
      </div>
    );

    const Menu = () => (
      <div className="nav-item absolute right-4 top-30 bg-white drop-shadow-lg py-2 px-4 rounded-lg w-40">
        <Link to="/models/create" className="flex gap-1 border-b-1 border-gray-400 hover:bg-gray-100 items-center">
          <BiAddToQueue size="25" color="#484848" className="pl-1"/>
          <span
            className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Create Model</span>
        </Link>
        <Link to="/" className="flex gap-1 border-b-1 border-gray-400 hover:bg-gray-100 items-center">
          <BiPencil size="25" color="#484848" className="pl-1"/>
          <span
            className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Update Model</span>
        </Link>
        <button className="flex gap-1 hover:bg-gray-100 items-center" onClick={() => setDelete(!deleteOption)}>
          <RiDeleteBinLine size="25" color="#484848" className="pl-1"/>
          <span
            className="text-gray-700 flex justify-between w-full px-1 py-2 text-sm leading-5 text-left">Delete Model</span>
        </button>
      </div>
    );

    const GridLayout = () => (
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 gap-4">
          {models.map((modelData) => (
              <div key={modelData.id} onClick={() => onModelSelect(modelData)}
                   className="w-auto px-5 p-5 mb-4 mr-1 bg-white rounded-xl drop-shadow-lg hover:drop-shadow-xl cursor-pointer">
                  <div className={'border-b-2 '} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                      <p className="font-semibold text-xl break-all">{modelData.name}</p>
                      {deleteOption? <RiDeleteBinLine size="25" color="#484848" className="pl-1" onClick={() => onBinClick(modelData.name)}/>
                      :''}
                  </div>
                  <div className="flex">
                      <div className="py-3"><Badge color="indigo">Input: {modelData.inputType}</Badge></div>
                      <div className="p-3"><Badge color="purple">Output: {modelData.outputType}</Badge></div>
                  </div>
                  <div className="flex mt-10 justify-between">
                      <div
                          className="text-sm text-gray-500 py-3">Updated {DateUtils.formatDate(modelData.updatedTime)} · {modelData.register.username} ·
                          20KB
                      </div>
                      <div className="py-3"><Badge color="gray">{modelData.image.region.name}</Badge></div>
                  </div>
              </div>
          ))}
      </div>
    );

    const ListLayout = () => (
      <div>
          <Table hoverable={true}>
              <Table.Head>
                  {modelColumn.list.map((item) => (
                      <Table.HeadCell>{item}</Table.HeadCell>
                  ))}
                  {
                      deleteOption ? (
                          <Table.HeadCell>{'DELETE'}</Table.HeadCell>
                      ) : (
                          ''
                      )
                  }
              </Table.Head>
              <Table.Body className="divide-y">
                  {models.map((modelData) => (
                      <Table.Row className="bg-white">
                          <Table.Cell
                              className="whitespace-nowrap font-medium text-gray-900">{modelData.name}</Table.Cell>
                          <Table.Cell>
                              <div className="flex"><Badge color="indigo">{modelData.inputType}</Badge></div>
                          </Table.Cell>
                          <Table.Cell>
                              <div className="flex"><Badge color="purple">{modelData.outputType}</Badge></div>
                          </Table.Cell>
                          <Table.Cell>{modelData.register.username}</Table.Cell>
                          <Table.Cell>{DateUtils.formatDate(modelData.updatedTime)}</Table.Cell>
                          <Table.Cell>
                              <VscDebugStart onClick={() => onModelSelect(modelData)}
                                             className="text-white py-1 w-10 h-6 rounded bg-blue-500 hover:bg-blue-600 hover:drop-shadow-lg"/>
                          </Table.Cell>
                          {
                              deleteOption ? (
                                  <Table.Cell>
                                      <RiDeleteBinLine style={{cursor: 'pointer'}} size="25" color="#484848" className="pl-1" onClick={() => onBinClick(modelData.name)}/>
                                  </Table.Cell>
                              ) : (
                                  ''
                              )
                          }
                      </Table.Row>
                  ))}
              </Table.Body>
          </Table>
      </div>
  );

  return (
    <div className="contents">
        <div className="w-full m-2 md:m-10 mt-24">
            <div className="flex justify-between items-center">
                {
                    modalOpen ? (
                        <DeleteModal header={selectedModelName + '를 삭제하시겠습니까?'} submit={onModalDeleteClick} close={onModalClose} />
                    ) : (
                        ''
                    )
                }
                <div className="flex">
                    <Header title="Models"/>
                    <button onClick={() => setCurrentLayout("GridLayout")} type="button"
                            className={`ml-2 mr-1 text-xl rounded-full p-2 hover:bg-light-gray focus:bg-gray ${currentLayout === "GridLayout" ? "bg-light-gray" : null}`}>
                        {<HiViewGrid size="21" className="text-gray-500"/>}
                    </button>
                    <button onClick={() => setCurrentLayout("ListLayout")} type="button"
                            className={`text-xl rounded-full p-2 hover:bg-light-gray focus:bg-gray ${currentLayout === "ListLayout" ? "bg-light-gray" : null}`}>
                        {<FiList size="21" className="text-gray-500"/>}
                    </button>
                </div>
                {!isDesktopOrMobile ? <ArrangeMenu/> : <DropdownMenu/>}
            </div>
            <div className="mt-10 max-h-screen overflow-auto">
                {currentLayout === "GridLayout" ? <GridLayout/> : <ListLayout/>}
            </div>
        </div>
        {selectedModelId > 0 && !modalOpen ?
            <div className="w-[700px] ease-in-out duration-300 translate-x-0"><Description modelId={selectedModelId} setSelectedModelId={setSelectedModelId}/></div>
            :
            <div className="w-0 ease-in-out duration-300 translate-x-full hidden"><Description modelId={selectedModelId} setSelectedModelId={setSelectedModelId}/></div>
        }
        {
            isLoading && (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center">
                    <div role="status">
                        <svg aria-hidden="true"
                             className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                    </div>
                </div>
                // Another Design Draft
                //<div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center">
                //  <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
                //</div>
            )
        }
    </div>
  );
};