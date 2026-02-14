import { createSignal, splitProps } from "solid-js";
import { generateRandomString } from "../../utils";

export const TextInput = (props) => {
  const [local, other] = splitProps(props, [
    'id',
    'value',
    'label',
    'className',
    'onChange',
  ]);
  const value = () => local.value;
  const inputId = local.id || generateRandomString();

  return (
    <>
      {local.label ? (
        <label className="select-none" for={inputId}>{props.label}</label>
      ) : (<></>)}
      <input
        {...other}
        className={`
          bg-slate-50 placeholder:text-xs pl-1 w-40 h-6 border rounded border-amber-700 hover:border-amber-800 focus:outline-none
          ${local.className || ''}
        `}
        id={inputId}
        type="text"
        value={value()}
        onChange={(e) => local.onChange(e.target.value)}
      />
    </>
  );
};

export const Checkbox = (props) => {
  const inputId = props.id ? props.id : generateRandomString();

  return (
    <>
      <input
        className={`h-6 ml-1 cursor-pointer align-bottom ${props.checkBoxClass || ''}`}
        id={inputId}
        type="checkbox"
        checked={props.checked}
        onChange={function() {
          props.onChange && props.onChange(this.checked);
        }}
      />

      {props.label ? (
        <label className={`align-bottom select-none text-xs leading-6 pl-1 mr-1 cursor-pointer ${props.labelClass || ''}`} for={inputId}>{props.label}</label>
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
      border-2 border-dashed border-amber-700
      rounded-xl
      bg-gray-50
      hover:border-amber-800 hover:bg-blue-50
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

          props.onChange && props.onChange(this.files);
        }}
      />
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      
      <div>
        <span class="select-none text-amber-700 font-medium">点击上传</span>
        {/* <span class="text-gray-500 ml-2">或拖拽文件到此处</span> */}
        <p class="select-none text-sm text-gray-400 mt-1">仅仅支持 XML 文件</p>
      </div>
      
      <span class="select-none file-name ml-auto text-sm text-gray-600">{filenameText()}</span>
    </label>
  );
};

export const RadioList = (props) => {
  const getListData = () => props.list;
  const [getSelected, setSelected] = createSignal(props.defValue);
  const onChangeHandler = (e) => {
    setSelected(e.target.value);
    props?.onChange(e.target.value);
  };

  return (
    <div className={props.className || ''}>
      <Index each={getListData()}>
        {(item, index) => (
          <div className="inline-block mx-2">
            <input
              name={props.name}
              id={`${props.name}-${index}`}
              type="radio" value={item().value}
              checked={item().value === getSelected()}
              onChange={onChangeHandler}
              className="cursor-pointer"
            />
            <label for={`${props.name}-${index}`} className="cursor-pointer pl-1 select-none">{item().label}</label>
          </div>
        )}
      </Index>
    </div>
  );
};
