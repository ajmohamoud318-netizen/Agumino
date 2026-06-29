import { useEffect, useState } from "react";
import { STORAGE_KEYS, loadStoredArray, saveStoredArray } from "../services/storage";

// Normalize legacy string entries to objects
function normalize(list) {
  return list.map((item) =>
    typeof item === "string" ? { name: item, birthDate: null } : item
  );
}

export function useChildren() {
  const [childrenList, setChildrenList] = useState(() =>
    normalize(loadStoredArray(STORAGE_KEYS.children))
  );

  useEffect(() => {
    saveStoredArray(STORAGE_KEYS.children, childrenList);
  }, [childrenList]);

  const addChild = (name, birthDate = null) => {
    setChildrenList((prev) => [...prev, { name, birthDate }]);
  };

  return { childrenList, addChild };
}
