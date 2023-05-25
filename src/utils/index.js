//THIS FILE IS MAINLY FOR CALCULATIONS FOR REQUIRED FIELDS 
export const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
  
    return remainingDays.toFixed(0);
  };
  
  export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);
  
    return percentage;
  };
  
  export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;
  
    if (img.complete) callback(true);
  
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
  };

  /* This is a JavaScript function that takes two parameters: url and callback. 
  It checks if the given url is an image by creating a new Image object and setting its src property to the provided url.
  If the image is already loaded (i.e., img.complete is true), the function immediately calls the callback function with the argument true. 
  Otherwise, it sets up img.onload and img.onerror event handlers to call the callback function with true or false, 
  respectively, depending on whether the image loaded successfully or not.
  Overall, this function provides a simple way to asynchronously 
  check if an image exists at a given URL and execute a callback function based on the result. */