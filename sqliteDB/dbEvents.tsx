type DatabaseChangeListener = () => void;

const listeners = new Set<DatabaseChangeListener>();

export const subscribeToDatabaseChanges = (
  listener: DatabaseChangeListener,
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const notifyDatabaseChanged = () => {
  listeners.forEach((listener) => listener());
};
