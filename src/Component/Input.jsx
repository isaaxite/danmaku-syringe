import { generateRandomString } from "../utils";

export const TextInput = (props) => {
  const value = () => props.value;
  const inputId = props.id ? props.id : generateRandomString();

  return (
    <>
      {props.label ? (
        <label for={inputId}>{props.label}</label>
      ) : (<></>)}
      <input
        id={inputId}
        type="text"
        value={value()}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
};
