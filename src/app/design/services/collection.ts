export class StringMapWrapper {
  static create(): {[k: /*any*/ string]: any} {
    // Note: We are not using Object.create(null) here due to
    // performance!
    // http://jsperf.com/ng2-object-create-null
    return {};
  }

  static contains(map: {[key: string]: any}, key: string): boolean {
    return map.hasOwnProperty(key);
  }

  static get<V>(map: {[key: string]: V}, key: string): V {
    return map.hasOwnProperty(key) ? map[key] : undefined;
  }

  static set<V>(map: {[key: string]: V}, key: string, value: V) {
    map[key] = value;
  }

  static keys(map: {[key: string]: any}): string[] {
    return Object.keys(map);
  }

  static values<T>(map: {[key: string]: T}): T[] {
    return Object.keys(map).reduce((r, a) => {
      r.push(map[a]);
      return r;
    }, []);
  }

  static delete(map: {[key: string]: any}, key: string) {
    delete map[key];
  }

  static forEach<K, V>(map: {[key: string]: V}, callback: /*(V, K) => void*/ Function) {
    for (let prop in map) {
      if (map.hasOwnProperty(prop)) {
        callback(map[prop], prop);
      }
    }
  }

  static merge<V>(m1: {[key: string]: V}, m2: {[key: string]: V}): {[key: string]: V} {
    let m: {[key: string]: V} = {};

    for (let attr in m1) {
      if (m1.hasOwnProperty(attr)) {
        m[attr] = m1[attr];
      }
    }

    for (let attr in m2) {
      if (m2.hasOwnProperty(attr)) {
        m[attr] = m2[attr];
      }
    }

    return m;
  }

  static equals<V>(m1: {[key: string]: V}, m2: {[key: string]: V}): boolean {
    let k1 = Object.keys(m1);
    let k2 = Object.keys(m2);
    if (k1.length !== k2.length) {
      return false;
    }
    let key;
    for (let i = 0; i < k1.length; i++) {
      key = k1[i];
      if (m1[key] !== m2[key]) {
        return false;
      }
    }
    return true;
  }
}
