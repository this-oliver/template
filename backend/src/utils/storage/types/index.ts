/**
 * Generic Bucket Interface for uploading and removing files
 */
export interface GenericBucket {
  /**
   * Upload a file to the bucket and return the url
   * 
   * @param config the upload configuration
   * @param config.name the name of the file
   */
  // eslint-disable-next-line no-unused-vars
  uploadFile: (file: Express.Multer.File, config?: { name: string }) => Promise<string>;
  /**
   * Removes a file from the bucket and returns true if successful.
   * 
   * @param url the url of the file to be removed
   */
  // eslint-disable-next-line no-unused-vars
  removeFile(url: string): Promise<boolean>;
}