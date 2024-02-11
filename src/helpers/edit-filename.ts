// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
import { uuid } from 'uuidv4';

export const editFileName = (
  req,
  file,
  callback: (error: Error, filename: string) => void,
): void => {
  const filename: string =
    path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
  const extension: string = path.parse(file.originalname).ext;

  if (!filename || !extension) {
    return callback(new Error('Invalid file name or extension'), null);
  }

  callback(null, `${filename}${extension}`);
};
