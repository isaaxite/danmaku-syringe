import { createSignal } from "solid-js";
import { generateRandomString } from "../utils";

export const TextInput = (props) => {
  const value = () => props.value;
  const inputId = props.id ? props.id : generateRandomString();
  const attrs = {};

  if (props.placeholder) {
    attrs.placeholder = props.placeholder;
  }

  return (
    <>
      {props.label ? (
        <label for={inputId}>{props.label}</label>
      ) : (<></>)}
      <input
        {...attrs}
        className={`bg-white placeholder:text-xs mt-2 w-40 h-6 border rounded border-slate-300 hover:border-indigo-300 ${props.className ? props.className : ''}`}
        id={inputId}
        type="text"
        value={value()}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
};

export const Checkbox = (props) => {
  const inputId = props.id ? props.id : generateRandomString();

  return (
    <>
      <input
        className="h-6 ml-1 mt-2 cursor-pointer"
        id={inputId}
        type="checkbox"
        checked={props.checked}
        onChange={function(e) {
          props.onChange(this.checked)
        }}
      />

      {props.label ? (
        <label className="text-xs leading-6 pl-1 mr-1 mt-2 cursor-pointer" for={inputId}>{props.label}</label>
      ) : (<></>)}
    </>
  );
};

export const Upload = (props) => {
  const [filenameText, setFilenameText] = createSignal('未选择文件')
  return (
    <label class="
      inline-flex items-center gap-3
      px-6 py-4
      border-2 border-dashed border-gray-300
      rounded-xl
      bg-gray-50
      hover:border-blue-400 hover:bg-blue-50
      cursor-pointer
      transition-all duration-200
    ">
      <input
        type="file"
        class="hidden"
        accept=".xml"
        multiple={false}
        onChange={function() {
          const fileName = this.files[0]?.name || '未选择文件';
          setFilenameText(fileName);

          props.onChange(this.files);
        }}
      />
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      
      <div>
        <span class="text-blue-600 font-medium">点击上传</span>
        {/* <span class="text-gray-500 ml-2">或拖拽文件到此处</span> */}
        <p class="text-sm text-gray-400 mt-1">仅仅支持 XML 文件</p>
      </div>
      
      <span class="file-name ml-auto text-sm text-gray-600">{filenameText()}</span>
    </label>
  );
};
