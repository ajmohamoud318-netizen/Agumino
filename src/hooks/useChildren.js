import { useEffect, useState } from "react";
import { STORAGE_KEYS, loadStoredArray, saveStoredArray } from "../services/storage";

export function useChildren() {
  const [childrenList, setChildrenList] = useState(() => loadStoredArray(STORAGE_KEYS.children));

  useEffect(() => {
    saveStoredArray(STORAGE_KEYS.children, childrenList);
  }, [childrenList]);

  const addChild = (name) => {
    setChildrenList((prev) => [...prev, name]);
  };

  return { childrenList, addChild };
}
