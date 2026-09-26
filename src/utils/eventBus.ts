type EventHandler = (payload: unknown) => void;

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  
  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }
  
  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }
  
  emit(event: string, payload?: unknown): void {
    this.handlers.get(event)?.forEach(handler => handler(payload));
  }
}

export const eventBus = new EventBus();