let exampleInterval = null;

function exampleFunction() {}

export default {
  id: "example-id",
  name: "Example name",
  description: "Example description",
  default: true,

  enable() {
    if (!exampleInterval) {
      exampleInterval = setInterval(exampleFunction, 500);
      exampleFunction();
    }
  },

  disable() {
    if (exampleInterval) {
      clearInterval(exampleInterval);
      exampleInterval = null;
    }
  },
};
