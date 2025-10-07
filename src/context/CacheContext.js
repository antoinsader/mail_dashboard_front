import { createContext, useState, useContext, useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "../config";

const CacheContext = createContext(null);

export function CacheProvider({ children }) {
  const local_storage_keys = LOCAL_STORAGE_KEYS;

  const getCache = (key) => {
    // if (!Object.values(local_storage_keys).includes(key)) return [null, null];
    const content = localStorage.getItem(key);
    if (!content) return [null, null];
    const parsed_content = JSON.parse(content);
    const date = parsed_content.date;
    const data = parsed_content.data;

    return [data, date];
  };
  const setCache = (key, value) => {
    // if (!Object.values(local_storage_keys).includes(key)) return;
    const content = {
      date: new Date(),
      data: value,
    };
    localStorage.setItem(key, JSON.stringify(content));
    return true;
  };

  return (
    <CacheContext.Provider value={{ local_storage_keys, getCache, setCache }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  return useContext(CacheContext);
}

export function useCachedState(key, defaultValue){
  const {getCache, setCache} = useCache();

  const [value, setValue] = useState(() => {
    const cached = getCache(key)[0];
    return cached !== null ? cached : defaultValue;
  });
  useEffect(() => {
    const cached = getCache(key)[0];
    if (cached === null) {
      setCache(key, value); // write initial value
    }
  }, [key]); // only runs on mount

  useEffect(() => {
    setCache(key,value);
  }, [key, value, setCache])
  return [value, setValue];
}



