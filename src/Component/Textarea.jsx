export const Textarea = (props) => {
  const value = () => props.value || '';
  return (
    <textarea
      className="bg-white border rounded border-slate-300 hover:border-indigo-300" rows="5" cols="26"
      value={value()}
      onChange={(e) => props.onChange(e.target.value)}
    ></textarea>
  );
};
