// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { v4: uuidv4 } = require('uuid');

export const editFileName = (
  req,
  file,
  callback: (error: Error, filename: string) => void,
): void => {
  const filename: string =
    path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;

  if (!filename || !extension) {
    return callback(new Error('Invalid file name or extension'), null);
  }

  callback(null, `${filename}${extension}`);
};
