import { Storage, Bucket } from "@google-cloud/storage";
import type { GenericBucket } from "./types";

/**
 * GCP Data Storage
 */
class GcpBucket implements GenericBucket {
	projectName: string;
	bucketName: string;
	
	gcStorage: Storage;
	gcBucket: Bucket;

	constructor(config: { projectName: string;  bucketName: string; keyPath: string; }) {
		this.projectName = config.projectName;
		this.bucketName = config.bucketName;
		this.gcStorage = new Storage({ keyFilename: config.keyPath, projectId: config.projectName });
		this.gcBucket = this.gcStorage.bucket(this.bucketName);
	}

	/**
   * Uploads a file to the bucket and returns the url.
   * 
   * By default, the file:
   * - is public
   * - has the same name as the original file
   */
	async uploadFile (file: Express.Multer.File, config?: { name?: string }): Promise<string> {
		// save file to bucket with config.name or file.originalname as name
		await this.gcBucket.file(config?.name || file.originalname)
			.save(file.buffer, {
				public: true,
				metadata: { contentType: file.mimetype, },
			});

		// return url
		return `https://storage.googleapis.com/${this.bucketName}/${config?.name || file.originalname}`;
	}

	/**
   * Removes a file from the bucket and returns true if successful.
   */
	async removeFile(url: string): Promise<boolean> {
		try {
			await this.gcBucket.file(url).delete();
			return true;
		} catch (error) {
			return false;
		}
	}
}

export { GcpBucket };