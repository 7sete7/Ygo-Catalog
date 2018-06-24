export default class Cache
{
  constructor(){
    this.cache = {};
  }

  add({key, value, time}){
    this.cache[key] = value;
    setTimeout(function() {
      this.del(key);
    }, time);
    return this.cache[key];
  }

  deepAdd({key, value, time, deepKey}){
    let v = this.deepSearch(this.cache, deepKey);
    if(Array.isArray(v[deepKey]))
      v[deepKey].push(value);
    else
      v[deepKey] = value;

    if(time){
      setTimeout(function() {
        this.del(key, deepKey);
      }.bind(this), time);
    }

    return v[deepKey];
  }

  get(key){
    return this.cache[key]  ? this.cache[key] : null;
  }

  deepGet(key, deepKey, filterFn){
    let v = this.deepSearch(this.cache, deepKey);
    if(filterFn && typeof filterFn === "function")
      return filterFn(v[deepKey || key]);
    return v[deepKey || key];
  }

  del(key, deepKey){
    let v = this.deepSearch(this.cache, deepKey);
    v[deepKey || key] = null;
  }

  deepSearch(layer, deepKey){
    if(!deepKey) return layer;
    if(typeof layer === "object"){
      for(let x in layer){
        if(deepKey in layer[x])
          return layer[x];
        else
          return this.deepSearch(layer[x], deepKey);
      }
    }
  }
}
