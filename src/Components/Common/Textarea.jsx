export const Textarea = (props) => {
  const value = () => props.value || '';
  return (
    <textarea
      className={`text-sm focus:outline-none bg-slate-50 border rounded border-amber-700 hover:border-amber-800 p-1 ${props.className || ''}`} rows="5" cols="35"
      value={value()}
      placeholder={props.placeholder || ''}
      onChange={(e) => props.onChange(e.target.value)}
    ></textarea>
  );
};
