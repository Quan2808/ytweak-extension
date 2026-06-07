export const removeElementById = (id) => {
  const element = document.getElementById(id);
  element && element.remove();
};

export const removeElement = (selector) => {
  const element = document.querySelector(selector);
  element && element.remove();
};

export const addStyle = (id, css) => {
  removeElementById(id);

  const style = document.createElement("style");
  style.id = `ytweak-${id}`;
  style.className = "ytweak";
  style.textContent = css;

  if (document.head) {
    document.head.append(style);
  } else {
    document.documentElement.append(style);
  }
};
