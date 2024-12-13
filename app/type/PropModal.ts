export type PropModal<T> = {
    isShow: boolean;
    objUpdate?: T;
    onClose: () => void;
    onSave: (objAfterSave: T) => void;
  };
  