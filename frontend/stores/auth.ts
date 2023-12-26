import { defineStore } from 'pinia';
import { useRequest } from '~/composables/useRequest';
import { useStorage } from '~/composables/useStorage';
import type { User } from '~/types';

/**
 * This store provides a basic authentication logic:
 * 
 * - register a user
 * - login a user
 * - store authentication tokens
 * - refresh tokens
 */
export const useAuthStore = defineStore('auth', () => {
	const STORAGE_KEY_USER = 'app-user';
	const STORAGE_KEY_ACCESS = 'app-token-access';
	const STORAGE_KEY_REFRESH = 'app-token-refresh';

	const { post, patch } = useRequest();
	const { get, set, remove } = useStorage();

	const user = ref<User>();
	const accessToken = ref<string>();
	const refreshToken = ref<string>();

	const isAuthenticated = computed<boolean>(() => accessToken.value !== undefined);

	/**
	 * Set or unset (undefined) user in local storage.
	 */
	function _setUser(setUser: User | undefined){
		if(setUser === undefined){
			remove(STORAGE_KEY_USER);
		} else {
			set(STORAGE_KEY_USER, JSON.stringify(setUser));
			user.value = setUser;
		}
	}

	/**
	 * Set or unset (undefined) tokens in local storage.
	 */
	function _setTokens(accessT: string | undefined, refreshT: string | undefined){
		if(accessT === undefined){
			remove(STORAGE_KEY_ACCESS);
		} else {
			set(STORAGE_KEY_ACCESS, accessT);
		}
		
		if(refreshT === undefined){
			remove(STORAGE_KEY_REFRESH);
		} else {
			set(STORAGE_KEY_REFRESH, refreshT);
		}
		
		accessToken.value = accessT;
		refreshToken.value = refreshT;
	}

  type Tokens = { accessToken: string, refreshToken: string };
  type Credentials = Tokens & { user: User };

  /**
	 * Register user. This function saves auth tokens and returns user if
	 * if everything goes as planned.
	 */
  async function register(username: string, password: string): Promise<User> {
  	logout();
    
  	const { data } = await post('/auth/register', { username, password });

  	const auth = data.value as Credentials | undefined;
		
  	if(!auth?.user){
  		throw new Error('Invalid username or password.');
  	}

  	_setUser(auth.user);
  	_setTokens(auth.accessToken, auth.refreshToken);
		
  	return user.value as User;
  }
	
  /**
	 * Login user. This function saves auth tokens and returns user if credentials
	 * are valid.
	 */
  async function login(username: string, password: string): Promise<User>{
  	logout();
    
  	const { data } = await post('/auth/login', { username, password });
		
  	const auth = data.value as Credentials | undefined;
		
  	if(!auth?.user){
  		throw new Error('Invalid username or password.');
  	}

  	_setUser(auth.user);
  	_setTokens(auth.accessToken, auth.refreshToken);
		
  	return user.value as User;
  }

  /**
	 * Refreshes auth tokens.
	 */
  async function refresh(): Promise<void>{
  	if(!refreshToken.value){
  		throw new Error('Missing refresh token.');
  	}

  	const { data } = await post('/auth/refresh', { refreshToken: refreshToken.value, accessToken: accessToken.value });

  	const tokens = data.value as Tokens | undefined;

  	if(!tokens){
  		throw new Error('Failed to refresh tokens. Please login again.');
  	}

  	_setTokens(tokens.accessToken, tokens.refreshToken);
  }

  /**
	 * Updates user.
	 */
  async function updateUser (id: string, patchedUser: Partial<User>): Promise<User> {
  	const { data } = await patch(`/users/${id}`, patchedUser, { authorization: accessToken.value });
    
  	const updatedUser = data.value as User;

  	if (!updatedUser) {
  		throw new Error('Invalid user.');
  	}

  	_setUser(updatedUser);

  	return user.value as User;
  }

  /**
	 * Updates user password.
	 */
  async function updateUserPassword (id: string, form: {oldPassword: string, newPassword: string}): Promise<User> {
  	const { data } = await patch(`/auth/${id}/password`, form, { authorization: accessToken.value });
    
  	const updatedUser = data.value as User;

  	if (!updatedUser) {
  		throw new Error('Invalid user.');
  	}

  	_setUser(updatedUser);

  	return user.value as User;
  }

  /**
	 * Removes auth tokens.
	 */
  function logout(): void {
  	_setUser(undefined);
  	_setTokens(undefined, undefined);
  }

  function init(): void {
  	user.value = get(STORAGE_KEY_USER) as User | undefined;
  	accessToken.value = get(STORAGE_KEY_ACCESS) as string | undefined;
  	refreshToken.value = get(STORAGE_KEY_REFRESH) as string | undefined;
  }
  
  return {
  	user,
  	accessToken,
  	isAuthenticated,
  	register,
  	login,
  	refresh,
  	updateUser,
  	updateUserPassword,
  	logout,
  	init
  };
});