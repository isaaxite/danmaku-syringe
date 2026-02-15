export const Tailwindcss = (props) => (
  <>
    <style ref={(ref) => {
      if (!window.tailwindcssContent) {
        console.warn('tailwindcssContent is <empty string>');
        return;
      }
      ref.textContent = window.tailwindcssContent;
    }} />
    {props.children}
  </>
);
