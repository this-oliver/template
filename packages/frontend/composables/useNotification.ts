import type { DefineComponent } from 'vue';
import { defineComponent, h, shallowRef } from 'vue';

export function useNotification () {
	const { $toast } = useNuxtApp();
  
  type NotificationType = 'general' | 'warning' | 'error' | 'success'

	interface Notification {
		type: NotificationType
		title: string
		message: string
		component: DefineComponent
	}

	function _trigger (notification: Notification) {
		$toast(shallowRef(notification.component));
	}

	function _mapTypeToColor (type: NotificationType): string {
		switch (type) {
		case 'warning':
			return 'bg-warning';
		case 'error':
			return 'bg-error';
		case 'success':
			return 'bg-success';
		default:
			return 'bg-primary';
		}
	}

	function _renderNotifictaion (title: string, message: string, type: NotificationType): Notification {
		const component: DefineComponent = defineComponent({
			setup () {
				return () => h('div', { class: `${_mapTypeToColor(type)} w-fit p-2` }, [
					h('h3', { class: 'text-lg font-semibold' }, title),
					h('p', message)
				]);
			}
		});

		return {
			type,
			title,
			message,
			component
		};
	}

	function notify (title: string, message: string, type: NotificationType = 'general') {
		const notification: Notification = _renderNotifictaion(title, message, type);
		_trigger(notification);
	}

	return { notify };
}