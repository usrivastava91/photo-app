// Checks if all the images inside parentNode have finished loading or not
export const imagesLoaded = (parentNode: any) => {
  // debugger;

  const imgElements = [...parentNode.current.children];
  // debugger;
  for (let i = 0; i < imgElements.length; i += 1) {
    const img = imgElements[i];
    if (!img.complete) {
      return false;
    }
  }
  return true;
};
