import mitt, { type Emitter } from 'mitt';

type Events = Record<string | symbol, any>;

const bus: Emitter<Events> = mitt<Events>();

export default bus;
