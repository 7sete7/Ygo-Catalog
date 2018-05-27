//Previne mocha de interpetrar @import de arquivos css
function noop(){
  return null;
}

require.extensions[".css"] = noop;
