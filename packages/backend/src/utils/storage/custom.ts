/**
 * Don't use for production, this is just a quick and dirty way to implement a custom storage bucket
 */

import axios from "axios";
import formData from "form-data";
import type { AxiosInstance } from 'axios';
import type { GenericBucket } from "./types";

/**
 * Custom Bucket Logic
 */
class BasicBucket implements GenericBucket {
	endpoint: string;
	axiosClient: AxiosInstance;

	constructor(config: { endpoint: string; }) {
		this.endpoint = config.endpoint;

		this.axiosClient = axios.create({
			baseURL: this.endpoint,
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
	}

	async uploadFile(file: Express.Multer.File, config?: { name?: string; }): Promise<string> {
		const form = new formData();
		form.append("files", file.buffer, config?.name || file.originalname);

		const response = await this.axiosClient.post("/assets", form, { headers: form.getHeaders() });

		if(response.status !== 201) {
			throw response;
		}

		const images = response.data;
		return images[0].url;
	}

	async removeFile(url: string): Promise<boolean> {
		// get file name from url
		const filename = url.split("/").pop();
		// delete file from server
		const response = await this.axiosClient.delete(`/assets/${filename}`);
		// return true if deleted
		return response.data;
	}
}

export { BasicBucket };