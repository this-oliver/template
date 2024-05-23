/**
 * Actions to be displayed in the card footer.
 */
export interface ActionItem {
	label: string;
  hint?: string;
	color?: string;
	disabled?: boolean;
	to?: string;
	action?: () => void;
}

export interface DropDownItem {
  label: string;
  color?: string;
  disabled?: boolean;
	to?: string;
	action?: () => void;
}