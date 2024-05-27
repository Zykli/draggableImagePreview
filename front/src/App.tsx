import React, { ComponentProps, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ImageFile } from './types/Image';
import { Viewer } from './Viewer/Viewer';
import { images } from './mock/data';

function App() {

  const [files, setFiles] = useState<ImageFile[]>([]);
  const filesRef = useRef(files);
  filesRef.current = files;

  const files1 = useMemo(() => files.slice(0, 1), [files]);
  const files2 = useMemo(() => files.slice(0, 2), [files]);
  const files3 = useMemo(() => files.slice(0, 3), [files]);
  const files4 = useMemo(() => files.slice(0, 4), [files]);
  const files5 = useMemo(() => files.slice(0, 5), [files]);
  const files6 = useMemo(() => files.slice(0, 6), [files]);
  const files7 = useMemo(() => files.slice(0, 7), [files]);
  const files8 = useMemo(() => files.slice(0, 8), [files]);
  const files9 = useMemo(() => files.slice(0, 9), [files]);
  const files10 = useMemo(() => files.slice(0, 10), [files]);

  useLayoutEffect(() => {
    const getImages = async () => {
      const files: ImageFile[] = images as any;
      // let files = await fetch(`http://localhost:3001/images`).then(d=> d.json()) as ImageFile[];
      setFiles(files);
    };
    getImages();
  }, []);

  const target = useRef({
    lastTargetId: '',
    lastActionType: ''
  });

  const onDrag = useCallback<ComponentProps<typeof Viewer>['onDrag']>((dragItem, toItem, actionType) => {
    if(target.current.lastActionType === actionType && target.current.lastTargetId === toItem.id) return;
    if(dragItem.id === toItem.id) return;
    target.current.lastTargetId = toItem.id;
    target.current.lastActionType = actionType;
    const dragItemId = dragItem.id.replace('id-', '');
    const toItemId = toItem.id.replace('id-', '');
    const dragingItem = filesRef.current.find((file) => file.id === dragItemId);
    if(!dragingItem) return;
    const positionStep = actionType === 'append' ? 1 : 0;
    const arrayWithoutDraggingItem = filesRef.current.filter((file) => file.id !== dragItemId);
    const toItemIdx = arrayWithoutDraggingItem.findIndex((file) => file.id === toItemId) + positionStep;
    const sortedArray = [arrayWithoutDraggingItem.slice(0, toItemIdx), [dragingItem], arrayWithoutDraggingItem.slice(toItemIdx, arrayWithoutDraggingItem.length)];
    setFiles(sortedArray.flat());
  }, []);

  // useEffect(() => {
  //   console.log('files9', files9.map(el => el.id));
  // }, [files9]);

  const onDrop = useCallback<ComponentProps<typeof Viewer>['onDrop']>((dragItem, toItem) => {
    // console.log('onDrop dragItem', dragItem);
    // console.log('onDrop toItem', toItem);
  }, []);

  const renderArray = [
    // {
    //   name: 'files1',
    //   array: files1
    // },
    // {
    //   name: 'files2',
    //   array: files2
    // },
    // {
    //   name: 'files3',
    //   array: files3
    // },
    // {
    //   name: 'files4',
    //   array: files4
    // },
    // {
    //   name: 'files5',
    //   array: files5
    // },
    // {
    //   name: 'files6',
    //   array: files6
    // },
    // {
    //   name: 'files7',
    //   array: files7
    // },
    // {
    //   name: 'files8',
    //   array: files8
    // },
    // {
    //   name: 'files9',
    //   array: files9
    // },
    // {
    //   name: 'files10',
    //   array: files10
    // },
    {
      name: 'filesAll',
      array: files
    },
  ]

  const [edit, setEdit] = useState(false);

  return (
    <div className="App">
      <button
        onClick={() => {
          setEdit(!edit);
        }}
      >
        toggle drag
      </button>
      <div>
        drag is&nbsp;
        {
          edit
          ? 'enabled'
          : 'disabled'
        }
      </div>
      {/* <div className='Names'>
        {
          files.map(el => <span key={`info-${el.name || el.url}`} style={{
            flexBasis: 'calc(33% - 20px)',
            minWidth: 0
          }}>
            <div>{el.name}</div>
            <div>{JSON.stringify(el.imageSizes).replace(',', ', ')}</div>
            
            </span>)
        }
      </div> */}
      {
        renderArray.map(el => {
          return (
            <div className='AppBlock' key={el.name}>
              <span>
                {el.name}
              </span>
              <Viewer
                allowDrag={edit}
                images={el.array}
                onDrag={onDrag}
                onDrop={onDrop}
              />
            </div>
            )
        })
      }
    </div>
  );
}

export default App;
