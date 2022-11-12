import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState('')
    return (
        <div>
            <Editor
            // 编辑的存储值 与 下面的Change函数进行绑定
                editorState={editorState}
                // 对于编辑器每一块Class的引用
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                // Editor是受控组件，需要通过Change函数进行实时更新
                onEditorStateChange={(editorState)=>{
                    setEditorState(editorState)
                }}
                // 失去焦点,会触发change函数
                onBlur={()=>{
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}
