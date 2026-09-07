type loaderRenderer = (v: boolean) => void;
export default function loaderService() {
  let loadingFn: loaderRenderer;

  return {
    registerLoader: (render: loaderRenderer) => {
      loadingFn = render;
    },
    showLoader: () => {
      if (loadingFn) {
        loadingFn(true);
      }
    },
    hideLoader: () => {
      if (loadingFn) {
        loadingFn(false);
      }
    },
  }
}
