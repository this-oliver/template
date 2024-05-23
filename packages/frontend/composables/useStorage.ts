interface StorageOptions {
  server?: boolean;
  cookie?: boolean;
}

// a robust function for inspecting if a string is a stringified object
function _isStringifiedObject (value: string): boolean {
	return (value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'));
}

export function useStorage () {
	function set (key: string, value: string | object, options?: StorageOptions): boolean {
		
		if(typeof value !== 'string'){
			value = JSON.stringify(value);
		}
    
		try {
			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				cookie.value = value;
			} else {
				localStorage.setItem(key, value);
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	function get (key: string, options?: StorageOptions): string | object | undefined {
		try {
			let value = undefined;

			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				value = cookie.value as unknown as string | null | undefined;
			} else {
				value = localStorage.getItem(key);
			}

			if(
				!value || 
        value === '' || 
        value === 'undefined' || 
        value === undefined || 
        value === 'null' || 
        value === null
			){
				return undefined;
			}

			if(_isStringifiedObject(value)){
				value = JSON.parse(value);
			}

			return value;
		} catch (error) {
			return undefined;
		}
	}

	function remove (key: string, options?: StorageOptions): boolean {
		try {
			if (options?.server || options?.cookie || process.server) {
				const cookie = useCookie(key);
				cookie.value = undefined;
			} else {
				localStorage.removeItem(key);
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	return { set, get, remove };
}
