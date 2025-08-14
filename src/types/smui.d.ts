declare module '@smui/top-app-bar' {
  import type { SvelteComponent } from 'svelte';

  export type TopAppBarProps = Record<string, any>;
  export type TopAppBarEvents = { [eventName: string]: CustomEvent<any> };
  export type TopAppBarSlots = {
    default?: {};
    navigation?: {};
    title?: {};
    actions?: {};
  };

  export default class TopAppBar extends SvelteComponent<
    TopAppBarProps,
    TopAppBarEvents,
    TopAppBarSlots
  > {}
}

