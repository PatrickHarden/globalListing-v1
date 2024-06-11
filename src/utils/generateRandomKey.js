// generate a random key to be used to add a dynamic element
export const generateRandomKey = () => {
    return Math.random()
      .toString(36)
      .substring(7);
};
  